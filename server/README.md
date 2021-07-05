# Server

The `/server folder contains everything that happens on the server, including database operations, ExpressJS routes, controllers, APIs, and utilities.

## addRoutes.js

All the routes from the `/routes` folder are initialized here for ExpressJS. This file is called in nuxt.config.js:

```
...
serverMiddleware: ['~/server/addRoutes.js'],
...
```

## startApp.js

The script boots up Nuxt and ExpressJS when we run `npm run dev` or `npm run start`.
This file is called in package.json:

```
...
"scripts": {
    "dev": "nodemon server/startApp.js --watch server",
...
    "start": "node server/startApp.js",
...
```



## More Info

