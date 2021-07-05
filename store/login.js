/**
 * Login Module
 *
 * Note: If you use vuex-persist or vuex-persistedstate in your app,
 * you should exclude this login module. Local storage is accessible
 * via javascript, which is a security risk.
 *
 * This app uses an HTTP-only refresh cookie to persist login, which is
 * not accessible via client-side javascript.
 */
export const state = () => ({
  token: '',
  id: null,
  email: '',
  name: '',
  type: '',
  loggedIn: false,
})

export const mutations = {
  setToken(state, data) {
    state.token = data
  },
  setUser(state, data) {
    state.id = data.id || ''
    state.email = data.email || ''
    state.name = data.name || ''
    state.type = data.type || ''
  },
  setLoggedIn(state, data) {
    state.loggedIn = data
  },
}
