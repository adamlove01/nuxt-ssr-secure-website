import Try from '~/helpers/tryCatch.js'

/**
 * Authorize the user and page
 *
 * 1) Verify the user's login status
 * 2) Verify the page route & the page's access requirements
 * 3) Take action based on the results
 *
 * @param {Object} store    - Vuex store context
 * @param {Object} route    - Nuxt route context
 * @param {Object} redirect - Nuxt redirect context
 * @param {Object} error    - Nuxt error context
 * @param {Object} $axios   - Axios plugin context
 * @return {void|*}  -
 *   void: User login status and page access requirements are a match
 *   *:    Error. redirect() or error()
 */
export default async function ({ store, route, redirect, error, $axios }) {
  /**
   * setLoggedOut - Set the user as logged out in Vuex
   *                and redirect if necessary
   *
   * @param {String} type -
   *   'ok'    - user is already logged out and on a guest page - do nothing
   *   'login' - user is already logged out but the page requires login - send
   *             to login page
   *   'home'  - error while authorizing - set as logged out & send to home page
   * @return {String|void} redirect path
   */
  const setLoggedOut = (type) => {
    store.commit('login/setToken', '')
    store.commit('login/setUser', {})
    store.commit('login/setLoggedIn', false)

    if (type === 'ok') return
    if (type === 'login') return redirect(`/login?from=${route.path}`)
    if (type === 'home') return redirect(`/?error=true`)
  }

  /** --- Try to authorize the user on the server */

  /** Call to the server 'authorize' function */
  const [err, res] = await Try(
    $axios.post('/server/authorize', {
      route: route.path,
      token: store.state.login.token,
    })
  )

  /** Error: Axios */
  if (err || !res.data) return setLoggedOut('home')

  /** @var {Object} r - r.status, r.message, r[other] from server */
  const r = res.data

  /** Error: Input */
  if (r.status === 'inputError') return setLoggedOut('home')

  /** Error: server */
  if (r.status === 'error') {
    /** The user type is not allowed for this page */
    if (r.code === '401') {
      const type = store.state.login.type ? store.state.login.type : 'guest'
      return error({
        statusCode: 401,
        message: `We're sorry, '${type}' 
        users do not have access to this page.`,
      })
    }

    /** The route does not match the server access list */
    if (r.code === '404') return error({ statusCode: 404 })

    /** The user is not logged in but the page requires login */
    if (r.code === 'notLoggedIn') return setLoggedOut('login')
  }

  /** --- Success: User and route are a match */

  if (r.status === 'success') {
    /** User status is 'logged in' and user type is correct */
    if (r.code === 'loggedIn') {
      /** Set User login data in Vuex */
      store.commit('login/setUser', r.data)
      store.commit('login/setLoggedIn', true)
      return
    }

    /** User status is 'logged out' and page does not require login */
    return setLoggedOut('ok')
  }
}
