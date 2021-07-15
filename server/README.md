# Server

The `/server folder contains everything that happens on the server, including database operations, ExpressJS routes, controllers, APIs, and utilities.

## express.js

This script starts up Express, which we are using as Server middleware. All the routes from the `/routes` folder are initialized here for ExpressJS. This file is called in nuxt.config.js:

```
...
serverMiddleware: ['~/server/express.js'],
...
```

