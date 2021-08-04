# Server

The `/server folder contains everything that happens on the server, including database operations, ExpressJS routes, controllers, APIs, and utilities.

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

## express.js

This script starts up Express, which we are using as Server middleware. All the routes from the `/routes` folder are initialized here for ExpressJS. This file is called in nuxt.config.js:

```
...
serverMiddleware: ['~/server/express.js'],
...
```



