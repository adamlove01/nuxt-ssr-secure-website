<template>
  <v-container class="bg_white_geometric" fluid>
    <v-container class="pt-8 d-flex">
      <span v-if="!error" class="ma-auto">
        <h1 class="text-h4 text-center mt-8">Verifying...</h1>
        <v-progress-linear
          indeterminate
          rounded
          height="8"
          color="#4285f4"
          class="text-center mt-8"
        ></v-progress-linear>
      </span>
      <v-alert v-if="error" text dismissible type="error" class="mx-auto mb-6">
        We're sorry, the your email address could not be verified.
      </v-alert>
    </v-container>
  </v-container>
</template>

<script>
import Try from '~/helpers/tryCatch.js'

export default {
  middleware: 'authorize',

  data() {
    return {
      error: false,
    }
  },

  head: {
    title: 'Verify Email | Your Website',
  },

  async mounted() {
    /** Log out the user */
    const [err, res] = await Try(
      this.$axios.post('/server/verify', {
        token: this.$route.query.token,
      })
    )

    /** Error: Axios */
    if (err || !res.data)
      return this.$router.push({ path: '/', query: { logout: 'error' } })

    /** @var {Object} r - r.status, r.message, r[other] from server */
    const r = res.data

    /** Error: server */
    if (r.status !== 'success') return (this.error = true)

    /** Success. Redirect to home page with logout success message */
    return this.$router.push({ path: '/login', query: { registered: 'yes' } })
  },
}
</script>
