# My Notes

Next.js is a React framework, it comes with SSR, bundling, webpack etc all built in.

Next.js comes with a built in Router, to add pages it is as simple as adding components to pages. (e.g Adding sell.js would be /sell)

Routing between different pages can be done via a(href) links wrapped in a next link component. Wrapping it in a next link component tells next.js not to reload the page but instead use browser push state.

Video #4:
It is great having pages that are different etc but if you need a higher parent to maybe fetch some data, keep some cache then we need to write our own App.js component. By default next.js comes with a App.js component that wraps your entire application but many times you want to overwrite it with your own.

Overwriting the app.js is very simple and can done by creating a file called _app.js and extending the build in next.js App.js.

Components folder is for everything not related to routing, these should be the parts that mark up your application like a regular react app.

Because next.js is compiled on the server, there is a css flash/flicker when using styled components as it done on the client side. To avoid this we need to tell next.js to compile everything before is shown to the user.

Next.js and styled components have a way using an _document.js file, that will crawl all your components figure out the CSS that it needs and put it into the document before the page is sent from the server that way there is no flicker. 

## Module #3
GraphQL is a specification built to serve and fetching data. It is alternative to Rest, it is agnostic to the language. 

GraphQL has a single endpoint that you hit, you send it a query and it will return the data that you requested via your query. e.g:
```graphql
query {
    items {
        id
        title
    }
}
```
Fetch me the id, and title for all the items, this is the power of GraphQL, you can specific exactly what you need.

GraphQL is a typed language, it supports for primitive types(String, Boolean, Int) and custom types (Item). You can also specify relationships between the data. 

GraphQL also has the concept of mutations, which is put, updating and deleting data. 
GraphQL by default has no way to filter, sorting but Prisma which is a GraphQL implementation has this for you via functions you can pass in via your query. Resolvers on the server, resolve the query being passed via the client. Resolves basically tells grapgql where the data comes from. (Database, network requests etc). 

### Prisma

Prisma is an open-source GraphQL interface that provides a set of CRUD api's for MySQL or Postgres, MongoDB etc. It is a bit like an GraphQL ORM that allows you to use any database you require. Good thing is you won't be writing database specfic code, it is all done via Prisma. Prisma can be provided as a docker container or a software as a service. 

Primsa has a handy command line tool(prisma) that will allow you to setup whatever way you need, (docker, demo, existing service). 
```sh
    npm i -g prisma
    prisma login
    prisma init
```

After, you follow the steps from init you will end up with two files, datamodel and prisma.yml file. Prima.yml has the configuration for your prisma instance. You should swap the hardcoded values for environment variables usin a .env file and referencing via ${ENV:VARIABLES_NAME}. It is important for production app you add a secret to the .yml file as this will lock down the prisma endpoint.

When you add fields for change your data model you will want them changes pushed up to your prima instance for that you need to setup a hooks configuration variables in the prisma.yml file. After your hooks run there is a generated prisma.graphql file, which is the entire graphql schema for prisma. It creates the GraphQL endpoint file and mutations available that make up prisma and downloads the schema. 

Each time you make a change to your datamodel it must push via the deploy command.

## GraphQL Yoga

Yoga, is an express GraphQL server. It connects to your GraphQL prisma DB and pulls that data back and forward. 

Resolvers, answer the question where does this data come from or what does this data do in the database. There are two types of resolvers:

Mutations: Used to push data to your database.
Query: Used to fetch the data.