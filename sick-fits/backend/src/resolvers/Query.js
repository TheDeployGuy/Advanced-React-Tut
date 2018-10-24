// This file, resolves the question where do i get that data, it will query the database, restAPI or anything from here and the data will be returned.
// Each Query much be a function that returns something, a function that maps to a Query type in your schema, a function has 4 params:
/*
    parent: GraphQL parent schema,
    args: arguments to the query,
    ctx: Context that we setup in createServer, which we pass the req details as well as the db connection(e.g Prisma)
    info: Information about the request
*/
const Query = {
    dogs(parent, args, ctx, info) {
        global.dogs = global.dogs || []
        return global.dogs
    }
};

module.exports = Query;
