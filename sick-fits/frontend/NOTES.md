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