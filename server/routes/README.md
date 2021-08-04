# Routes

All files in the `/routes` directory define ExpressJS server routes for the project. The `/server/controller` functions are called for each route. All of these routes are pulled into express in the `/server/express.js` file. 

While Express has access to the root of the server `/` in this project, all server routes should begin with `/server/...` to prevent collision with client-side routes. 

## authRoutes.js

This has only one route: `/server/authorize`.

## captchaRoutes.js
This route is for the login captcha.

## loginRoutes.js

All routes relating to login: `register, login, logout, verify, forgot-password, reset-password`.

## userRoutes.js
Create, Read, Update and Delete routes for the `users` table.

## More Info

[Expressjs.com - Routing](https://expressjs.com/en/guide/routing.html)

[Npmjs.com - SVG Captcha](https://www.npmjs.com/package/svg-captcha)