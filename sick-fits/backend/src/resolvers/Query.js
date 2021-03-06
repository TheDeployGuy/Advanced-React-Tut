// This file, resolves the question where do i get that data, it will query the database, restAPI or anything from here and the data will be returned.
// Each Query much be a function that returns something, a function that maps to a Query type in your schema, a function has 4 params:
/*
    parent: GraphQL parent schema,
    args: arguments to the query,
    ctx: Context that we setup in createServer, which we pass the req details as well as the db connection(e.g Prisma)
    info: Information about the request
*/
const { forwardTo } = require("prisma-binding");
const { hasPermission, isUserLoggedIn } = require("../utils");

const Query = {
  items: forwardTo("db"), // If your query matches exactly query in your prisma model(i.e no custom logic to check auth status or anything), you can simply just forward the query onto prisma.
  item: forwardTo("db"),
  itemsConnection: forwardTo("db"),
  me(parent, args, ctx, info) {
    // check if there is a current user id
    if (!ctx.request.userId) {
      return null;
    }
    return ctx.db.query.user(
      {
        where: { id: ctx.request.userId }
      },
      info
    );
  },
  async users(parent, args, ctx, info) {
    // 1. Check if they are logged in
    isUserLoggedIn(ctx);

    // 2. Check if the user has the permissions to query all users
    hasPermission(ctx.request.user, ["ADMIN", "PERMISSIONUPDATE"]);

    // 3. if they do, query all users
    return ctx.db.query.users({}, info);
  },
  async order(parents, args, ctx, info) {
    // 1. Check if they are logged in
    isUserLoggedIn(ctx);
    // 2. Query the current order
    const order = await ctx.db.query.order(
      {
        where: { id: args.id }
      },
      info
    );
    // 3. Check if the have the permissions to see this order
    const ownsOrder = order.user.id === ctx.request.userId;
    const hasPermissionToSeeOrder = ctx.request.user.permissions.includes(
      "ADMIN"
    );
    if (!ownsOrder || !hasPermissionToSeeOrder) {
      throw new Error("You cant see this buddd");
    }
    // 4. Return the order
    return order;
  },
  async orders(parents, args, ctx, info) {
    // 1. Check if they are logged in
    isUserLoggedIn(ctx);

    return ctx.db.query.orders(
      {
        where: {
          user: { id: ctx.request.userId }
        }
      },
      info
    );
  }
};

module.exports = Query;
