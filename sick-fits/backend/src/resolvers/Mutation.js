const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const { randomBytes } = require("crypto");
const { promisify } = require("util");
const { transport, makeANiceEmail } = require("../mail");
const { hasPermission, isUserLoggedIn } = require("../utils");
const stripe = require("../stripe");

const ONE_YEAR = 1000 * 60 * 60 * 24 * 365;
const Mutations = {
  async createItem(parent, args, ctx, info) {
    //Check if they are logged in
    isUserLoggedIn(ctx);

    const item = await ctx.db.mutation.createItem(
      {
        data: {
          // This is how you create a relationship between the Item and the User
          user: {
            connect: {
              id: ctx.request.userId
            }
          },
          ...args
        }
      },
      info
    );

    return item;
  },
  updateItem(parent, args, ctx, info) {
    // Take a copy of the updates
    const updates = { ...args };
    // Remove the id from the updates
    delete updates.id;
    // run the update method
    return ctx.db.mutation.updateItem(
      {
        data: updates,
        where: {
          id: args.id
        }
      },
      info // Tells GQL what to return as a response
    );
  },
  async deleteItem(parent, args, ctx, info) {
    // 1. Find the item
    const item = await ctx.db.query.item(
      {
        where: { id: args.id }
      },
      `{id title user { id }}`
    ); // Usually we would pass info as the 2nd arg here but that will resolve the mutation which we don't want we want to preform some checks so instead we put raw graphql
    // 2. Check if they own that item, or have the permissions
    const ownsItem = item.user.id === ctx.request.userId;
    const hasPermissions = ctx.request.user.permissions.some(permission =>
      ["ADMIN", "ITEMDELETE"].includes(permission)
    );

    if (!ownsItem && hasPermissions) {
      throw new Error("You don't have permission to do that");
    }
    // 3. Delete it!
    return ctx.db.mutation.deleteItem({ where }, info);
  },
  async signup(parent, args, ctx, info) {
    // lowercase their email
    args.email = args.email.toLowerCase();
    // hash their password
    const password = await bcrypt.hash(args.password, 11);
    // create the user in the database
    const user = await ctx.db.mutation.createUser(
      {
        data: {
          ...args,
          password,
          permissions: { set: ["USER"] } // This is how you set a enum for graphql
        }
      },
      info
    );

    // create the JWT token for them
    const token = jwt.sign(
      {
        userId: user.id
      },
      process.env.APP_SECRET
    );

    // Set the JWT as a cookie on the response
    ctx.response.cookie("token", token, {
      httpOnly: true,
      maxAge: ONE_YEAR
    });

    // return user to browser
    return user;
  },
  async signin(parent, { email, password }, ctx, info) {
    // check if there is a user
    const user = await ctx.db.query.user({ where: { email } });
    if (!user) {
      throw new Error(`No user was found matching ${email}`);
    }

    // Check password
    const valid = await bcrypt.compare(password, user.password);
    if (!valid) {
      throw new Error(`Invalid Password`);
    }

    // create the JWT token for them
    const token = jwt.sign(
      {
        userId: user.id
      },
      process.env.APP_SECRET
    );

    // Set the JWT as a cookie on the response
    ctx.response.cookie("token", token, {
      httpOnly: true,
      maxAge: ONE_YEAR
    });

    // return user to browser
    return user;
  },
  signout(parent, args, ctx, info) {
    ctx.response.clearCookie("token");
    return { message: "You have been successfully signed out!" };
  },
  async requestReset(parent, args, ctx, info) {
    // 1. Check if there is a user
    const user = await ctx.db.query.user({ where: { email: args.email } });
    if (!user) {
      throw new Error(`No user was found matching ${args.email}`);
    }

    // 2. Set a reset token and expiry on that user
    const randomBytesPromise = promisify(randomBytes);
    const resetToken = (await randomBytesPromise(20)).toString("hex");
    const resetTokenExpiry = Date.now() + 3600000; // 1 hour from now
    const res = await ctx.db.mutation.updateUser({
      where: { email: args.email },
      data: { resetToken, resetTokenExpiry }
    });
    // 3. Email them that reset token

    const mailRes = await transport.sendMail({
      from: "support@sickfitsssss.com",
      to: user.email,
      subject: "Your Password Reset Token",
      html: makeANiceEmail(`Your Password Reset Token is here!
      \n\n
      <a href="${
        process.env.FRONTEND_URL
      }/reset?resetToken=${resetToken}">Click Here to Reset</a>`)
    });
    return {
      message:
        "Instructions for resetting your password has been sent to your email"
    };
  },
  async resetPassword(parent, args, ctx, info) {
    // 1. Check if passwords match
    if (args.password !== args.confirmPassword) {
      throw new Error("Passwords do not match");
    }
    // 2. Check if it's a real reset token
    // 3. Check if the token expired
    // We are querying all users that match the given condition, if their token is expired or is not correct it won't return anything. We cannot use the regular User query for this as that only accepts a email or name to query on.
    const [user] = await ctx.db.query.users({
      where: {
        resetToken: args.resetToken,
        resetTokenExpiry_gte: Date.now() - 3600000
      }
    });

    if (!user) {
      throw new Error("This token is invalid or expired");
    }

    // 4. Hash their new password
    const password = await bcrypt.hash(args.password, 11);

    // 5. Save the new password to the user and remove the old resetToken
    const updatedUser = await ctx.db.mutation.updateUser({
      where: { email: user.email },
      data: {
        password,
        resetToken: null,
        resetTokenExpiry: null
      }
    });

    // 6. Generate the JWT
    const token = jwt.sign(
      {
        userId: updatedUser.id
      },
      process.env.APP_SECRET
    );

    // 7. Set the JWT cookie
    ctx.response.cookie("token", token, {
      httpOnly: true,
      maxAge: ONE_YEAR
    });

    // 8. return the new user
    return updatedUser;
  },
  async updatePermissions(parent, args, ctx, info) {
    // 1. Check if they are logged in
    isUserLoggedIn(ctx);
    // 2. Query the current user
    const user = await ctx.db.query.user(
      { where: { id: ctx.request.userId } },
      info
    );
    // 3. Check if they have permissions to do this
    hasPermission(user, ["ADMIN", "PERMISSIONUPDATE"]);
    // 4. Update the permissions
    return ctx.db.mutation.updateUser(
      {
        data: {
          permissions: {
            set: args.permissions
          }
        },
        where: {
          // We are passing the userId as we may be updating somebody elses permissions
          id: args.userId
        }
      },
      info
    );
  },
  async addToCart(parent, args, ctx, info) {
    // 1. Make sure they are signed in
    const { userId } = ctx.request;

    isUserLoggedIn(ctx);
    // 2. Query the users current cart
    const [existingCartItem] = await ctx.db.query.cartItems({
      where: {
        user: { id: userId },
        item: { id: args.id }
      }
    });
    // 3. Check if that item is already in their cart and increment by 1 if it is
    if (existingCartItem) {
      return ctx.db.mutation.updateCartItem(
        {
          where: { id: existingCartItem.id },
          data: { quantity: existingCartItem.quantity + 1 }
        },
        info
      );
    }
    // 4. If its not, create a fresh CartItem for that user!
    return ctx.db.mutation.createCartItem(
      {
        data: {
          user: {
            connect: { id: userId }
          },
          item: {
            connect: { id: args.id }
          }
        }
      },
      info
    );
  },
  async removeFromCart(parent, args, ctx, info) {
    // 1. Find the cart item
    const cartItem = await ctx.db.query.cartItem(
      {
        where: {
          id: args.id
        }
      },
      `{ id, user { id }}`
    );
    // 1.5 Make sure we found an item
    if (!cartItem) throw new Error("No CartItem Found!");
    // 2. Make sure they own that cart item
    if (cartItem.user.id !== ctx.request.userId) {
      throw new Error("Cheatin huhhhh");
    }
    // 3. Delete that cart item
    return ctx.db.mutation.deleteCartItem(
      {
        where: { id: args.id }
      },
      info
    );
  },
  async createOrder(parent, args, ctx, info) {
    // 1. Query the current user and make sure they are signed in
    isUserLoggedIn(ctx);
    const user = await ctx.db.query.user(
      {
        where: { id: ctx.request.userId }
      },
      `{
      id
      name
      email
      cart {
        id
        quantity
        item { title price id description image largeImage }
      }}`
    );
    // 2. Recalculate the total for the price (never trust the client calculation)
    const amount = user.cart.reduce(
      (tally, cartItem) => tally + cartItem.item.price * cartItem.quantity,
      0
    );
    // 3. Create the stripe charge
    const charge = await stripe.charges.create({
      amount,
      currency: "USD",
      source: args.token
    });

    // 4. Convert the CartItems to OrderItems
    const orderItems = user.cart.map(cartItem => {
      const orderItem = {
        ...cartItem.item,
        quantity: cartItem.quantity,
        user: { connect: { id: ctx.request.userId } }
      };
      delete orderItem.id;
      return orderItem;
    });
    // 5. Create the order
    const order = await ctx.db.mutation.createOrder({
      data: {
        total: charge.amount,
        charge: charge.id,
        items: { create: orderItems },
        user: { connect: { id: ctx.request.userId } }
      }
    });
    // 6. Clear the users cart , delete cartItem
    const cartItemIds = user.cart.map(cartItem => cartItem.id);
    await ctx.db.mutation.deleteManyCartItems({
      where: {
        id_in: cartItemIds
      }
    });
    // 7. Return order to the client
    return order;
  }
};

module.exports = Mutations;
