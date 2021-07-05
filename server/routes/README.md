# Routes

All files in the `/routes` directory define ExpressJS server routes for the project. The `/server/authorization/authorize` function and `/server/controller` functions are called for each route. All of these routes are pulled into express in the `/server/express.js` file. 

While Express has acces to the root of the server `/` in this project, all server routes should begin with `/server/...` to prevent collision with client-side routes. 

## captchaRoutes.js
This route generates a text or math captcha and returns the data to the client. It is used on the `/login` form. The captcha appears only if the user enters an invalid password.

## userRoutes.js
CRUD, login, logout, register, verify and authorize for the `users` table.

## More Info

[Expressjs.com - Routing](https://expressjs.com/en/guide/routing.html)

[Npmjs.com - SVG Captcha](https://www.npmjs.com/package/svg-captcha)