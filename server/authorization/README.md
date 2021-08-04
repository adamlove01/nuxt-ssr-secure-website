# authorization

## accessList.js
The access list controls access to all client pages and all server routes on the site.

ALL `/pages` paths on the site and ALL Express routes must be listed in the access list. 
<br><br>

Example for `/pages` path `/myPage` :
```
...
export const clientList = [
  ['/myPage', ''],
...
```
<br>

Example for `/pages` path `/myAccount` that requires 'client' or 'admin' login :
```
...
export const clientList = [
  ['/myAccount', 'client, admin'],
...
```
<br>

Example for Express route `/server/myPath` :
```
...
export const serverList = [
 = [
  ['/server/myPath', ''],
...
```
<br>

Example for Express route `/server/myAdmin` that requires 'admin' login:
```
...
export const serverList = [
 = [
  ['/server/myAdmin', 'admin'],
...
```


## authController.js
ALL `/pages` paths on the site must call the `authorize` function, including pages that do not require login. Otherwise the page nav will not show the user's login status, and access control will not be enforced on that page.

Example: `/pages/myPage.vue`:

```
...
export default { middleware: 'authorize', ... }
...
```
<br>

ONLY Express routes that REQUIRE LOGIN should include the `authorize` function. 

Example: `/server/routes/myRoutes.js`:

```
...
myRoute.get( '/server/myPath', authorize, ... )
...
```
<br>


For client authorization (called from `middleware/authorize.js`) it returns these status codes:



| Status   | Code       | Description                                      |
|----------|------------|--------------------------------------------------|
| Error   | 404         | ROUTE is not in the access list                  |
| Error   | 401         | Logged in  -- USER TYPE not found in access list |
| Error   | notLoggedIn | Logged out -- USER TYPE not found in access list |
| Success | loggedIn    | Logged in  -- USER TYPE is in access list        |
| Success | loggedOut   | Logged out -- ROUTE does not require login       |

<br>

For server authorization (initiated by an Axios server call on the client, to a server route that includes the authorize function) it returns these status codes:

| Status   | Code       | Description                                      |
|----------|------------|--------------------------------------------------|
| Error | 404           | ROUTE is not in the access list                  |
| Error | 401           | Logged in  -- USER TYPE not found in access list |
| Error | notLoggedIn   | Logged out -- USER TYPE not found in access list |


On success, the server calls next() and continues on normally.
<br>

## function: checkAccess.js
This function checks if the user type has access to the route. It returns one of these codes:

| Code         | Description                                      |
|--------------|--------------------------------------------------|
| noRouteMatch | ROUTE is not in the access list                  |
| noTypeMatch  | User Type does not match any accessList types    |
| allMatch     | accessList has no types (matches all user types) |
| typeMatch    | User Type matches an existing accessList type    |

<br>

## function: checkLogin.js
This function checks the user's login status using the accessToken and refreshToken.




