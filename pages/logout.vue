<template>
  <v-container class="bg_white_geometric" fluid>
    <v-container class="pt-8 d-flex">
      <span class="ma-auto">
        <h1 class="text-h4 text-center mt-8">Signing out...</h1>
        <v-progress-linear
          indeterminate
          rounded
          height="8"
          color="#4285f4"
          class="text-center mt-8"
        ></v-progress-linear>
      </span>
    </v-container>
  </v-container>
</template>

<script>
import Try from '~/helpers/tryCatch.js'

export default {
  middleware: 'authorize',

  head: {
    title: 'Sign out | Your Website',
  },

  async mounted() {
    /** Log out the user */
    const [err, res] = await Try(this.$axios.get('/server/logout'))

    /** Error: Axios */
    if (err || !res.data)
      return this.$router.push({ path: '/', query: { logout: 'error' } })

    /** @var {Object} r - r.status, r.message, r[other] from server */
    const r = res.data

    /** Error: server */
    if (r.status !== 'success')
      return this.$router.push({ path: '/', query: { logout: 'error' } })

    /** Success. Delete user data from Vuex store */
    this.$store.commit('login/setToken', '')
    this.$store.commit('login/setUser', {})
    this.$store.commit('login/setLoggedIn', false)

    /** Redirect to home page with logout success message */
    return this.$router.push({ path: '/', query: { logout: 'yes' } })
  },
}
</script>
