# MIDDLEWARE

Files in the `/middleware` directory run before the client page loads. Since our project is server-side rendered (SSR), the files run on the server.

## authorize.js

This function controls access to all client pages on the site. ALL `/pages` paths on the site must have a call to `middleware: 'authorize'`, including pages that do not require login. Otherwise the page nav will not show the user's login status, and access control will not be enforced on that page.

Example:
```
export default {
  ...
  middleware: 'authorize',
  ...
```

This function works by calling the server path `/server/authorize`, which runs the controller `/server/controllers/authController.js`.
This in turn checks if the page is listed in the `/server/accessList.js` file, and then checks if the login type of the user matches the accessList. It then returns a status code to the `/middleware/authorize.js` function.

These are the possible status codes:


| Status   | Code       | Description                                      |
|----------|------------|--------------------------------------------------|
| Error   | 404         | ROUTE is not in the access list                  |
| Error   | 401         | Logged in  -- USER TYPE not found in access list |
| Error   | notLoggedIn | Logged out -- USER TYPE not found in access list |
| Success | loggedIn    | Logged in  -- USER TYPE is in access list        |
| Success | loggedOut   | Logged out -- ROUTE does not require login       |


## More info

[Nuxtjs.org - Middleware](https://nuxtjs.org/docs/2.x/directory-structure/middleware)

