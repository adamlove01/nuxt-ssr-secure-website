/**
 * ACCESS LIST
 *
 * ALL pages on the site must be listed on the access list, including pages
 * that do not require login!
 */

/**
 * Client-side access list (Vue page routes)
 *
 * @param {String} clientList[0] - Client-side wildcard routes
 * @param {String} clientList[1] - the user types who have access to the route,
 *                                 comma-separated string ('client, dev, admin')
 *                                 '' = No login required (any type can access)
 *
 * Note: ALL Vue pages must include the 'authorize' middleware, REGARDLESS of
 * whether login is required or not. This is because the login status will
 * show in the nav bar even for logged-out pages. Example - /pages/myPage.vue:
 *
 *   export default { middleware: 'authorize', ... }
 */
export const clientList = [
  ['/', ''],
  ['/login', ''],
  ['/logout', ''],
  ['/register', ''],
  ['/verify', ''],
  ['/account', 'client, admin'],
  ['/admin', 'admin'],
]

/**
 * Server-side access list (Express routes)
 *
 * @param {String} serverList[0] - server-side wildcard routes
 * @param {String} serverList[1] - the user types who have access to the route
 *                                 '' = No login required (any type can access)
 *
 * Note: ONLY Express routes that REQUIRE LOGIN should include the 'authorize'
 * method. Example - /server/routes/myRoutes.js:
 *
 *   myRoute.get( '/server/myPath', authorize, ... )
 *
 * New server routes should start with /server to avoid collision with client
 * routes.
 */
export const serverList = [
  ['/server/login', ''],
  ['/server/logout', ''],
  ['/server/register', ''],
  ['/server/admin', 'admin'],
  ['/server/users/*', 'admin'],
]
