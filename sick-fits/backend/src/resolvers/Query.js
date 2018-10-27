// This file, resolves the question where do i get that data, it will query the database, restAPI or anything from here and the data will be returned.
// Each Query much be a function that returns something, a function that maps to a Query type in your schema, a function has 4 params:
/*
    parent: GraphQL parent schema,
    args: arguments to the query,
    ctx: Context that we setup in createServer, which we pass the req details as well as the db connection(e.g Prisma)
    info: Information about the request
*/
const { forwardTo } = require('prisma-binding');

const Query = {
    items: forwardTo('db') // If your query matches exactly query in your prisma model(i.e no custom logic to check auth status or anything), you can simply just forward the query onto prisma.
    //async items(parent, args, ctx, info) {
    //    const items = await ctx.db.query.items();
    //    return items;
    // }
};

module.exports = Query;
