<template>
  <v-container class="bg_white_geometric" fluid>
    <v-container class="pt-8">
      <v-alert
        v-if="$route.query.registered === 'yes'"
        text
        type="success"
        class="mx-auto"
        max-width="400"
      >
        Account verified! &nbsp;<v-icon>mdi-emoticon-cool-outline</v-icon>&nbsp;
        Thank you!
      </v-alert>

      <v-alert
        v-if="$route.query.from"
        text
        type="info"
        class="mx-auto mb-6"
        max-width="400"
      >
        Please sign in to access that page.
      </v-alert>

      <v-card
        class="mx-auto px-2 py-3 rounded-lg"
        max-width="400"
        elevation="8"
      >
        <v-card-title class="text-h4 justify-center mb-6">
          Please sign in.</v-card-title
        >
        <v-card-text>
          <v-form ref="form">
            <v-text-field
              v-model="input.email"
              class="custom-input-outlined rounded-lg mb-2"
              label="Email"
              outlined
              prepend-inner-icon="mdi-email-outline"
              :rules="rules.email"
            ></v-text-field>

            <v-text-field
              v-model="input.password"
              class="custom-input-outlined rounded-lg"
              label="Password"
              outlined
              prepend-inner-icon="mdi-lock-outline"
              :rules="rules.password"
              :append-icon="
                showPassword ? 'mdi-eye-outline' : 'mdi-eye-off-outline'
              "
              :type="showPassword ? 'text' : 'password'"
              hint="At least 8 characters"
              counter
              @click:append="showPassword = !showPassword"
            ></v-text-field>

            <div v-if="showCaptcha" class="captcha mt-2 mb-4 pa-4">
              <!-- eslint-disable-next-line vue/no-v-html -->
              <div class="captcha-svg" v-html="captcha.data"></div>
              <v-text-field
                v-model="input.captcha"
                class="captcha-input mt-2 mx-4 mb-0 rounded-lg"
                :placeholder="captcha.message"
                flat
                width="200"
                :rules="rules.captcha"
              ></v-text-field>
            </div>

            <v-alert
              v-if="errors.other"
              text
              dismissible
              type="error"
              class="mx-auto mb-6"
            >
              {{ errors.other }}
            </v-alert>

            <v-btn
              class="mt-6"
              rounded
              x-large
              block
              color="blue darken-2"
              dark
              @click="submitForm()"
            >
              Sign in
            </v-btn>
          </v-form>

          <p v-if="errors.password" class="mt-4 mb-0 text-center text-body-1">
            <nuxt-link to="/users/forgotPassword"
              >Forgot your password?</nuxt-link
            >
          </p>
        </v-card-text>
      </v-card>

      <p v-if="showSignUp" class="mt-8 text-center">
        No account? &nbsp;
        <v-btn small outlined rounded color="blue darken-2" nuxt to="/register"
          >Sign up now!</v-btn
        >
      </p>
    </v-container>
  </v-container>
</template>

<script>
import { schema } from '~/validation/schemas/userSchema'
import { validate, joiResponse } from '~/validation/JoiValidate'
import Try from '~/helpers/tryCatch.js'

export default {
  middleware: 'authorize',

  /** Get captcha */
  async asyncData({ $axios }) {
    /** Get the captcha data from db */
    const [err, res] = await Try($axios.get('/server/captcha'))

    /** Error: Axios */
    if (err || !res.data)
      return { errors: { other: 'Error retrieving captcha!' } }

    /** Set captcha */
    return { captcha: res.data }
  },

  data() {
    return {
      showSignUp: false,
      showPassword: false,
      showCaptcha: false,
      captcha: { data: '', text: '' },
      input: { email: '', password: '', captcha: '' },
      errors: { email: '', password: '', captcha: '', other: '' },

      rules: {
        email: [() => this.errors.email === '' || this.errors.email],
        password: [() => this.errors.password === '' || this.errors.password],
        captcha: [() => this.errors.captcha === '' || this.errors.captcha],
      },
    }
  },

  head: {
    title: 'Sign In | Your Website',
  },

  methods: {
    /** Reset the captcha */
    async resetCaptcha() {
      /** Clear captcha input */
      this.input.captcha = ''

      /** Get the captcha data from db */
      const [err, res] = await Try(this.$axios.get('/server/captcha'))

      /** Error: Axios */
      if (err || !res.data)
        return (this.errors.other = 'Error retrieving captcha!')

      /** Set captcha */
      this.showCaptcha = true
      return (this.captcha = res.data)
    },

    /** Submit the form */
    async submitForm() {
      /** Clear all 'errors' values */
      Object.keys(this.errors).forEach((i) => (this.errors[i] = ''))

      /** --- Client-side: Validate */

      /** Check captcha, if enabled */
      if (this.showCaptcha && this.input.captcha !== this.captcha.text) {
        this.errors.captcha = 'Answer is incorrect.'

        /** Trigger error messages under the form inputs */
        return this.$refs.form.validate()
      }

      /** Sanitize and validate login input */
      /** @var {Array} - [vErr false || {object}, v {object} || false] */
      const [vErr, v] = validate('email, password', this.input, schema)

      /** Error: Invalid input */
      if (vErr || !v) return this.showInputErrors(joiResponse(vErr))

      /** Reset the form */
      this.$refs.form.resetValidation()

      /** --- Server-side: Log in */

      /** Log in the user */
      const [err, res] = await Try(
        this.$axios.post('/server/login', {
          email: this.input.email,
          password: this.input.password,
        })
      )

      /** Error: Axios */
      if (err || !res.data)
        return (this.errors.other = `Error while signing in.
         Please try again later.`)

      /** @var {Object} r - r.status, r.message, r[other] from server */
      const r = res.data

      console.log('error-type=', r.name)

      /** Error: Input. Show JoiValidate() server error(s) */
      if (r.status === 'inputError') return this.showInputErrors(r)

      /** Error: server */
      if (r.status === 'error') {
        r.name in this.input
          ? (this.errors[r.name] = r.message)
          : (this.errors.other = r.message)

        /** If password failed, show captcha */
        if (this.errors.password) this.resetCaptcha()

        /** Trigger error messages under the form inputs */
        return this.$refs.form.validate()
      }

      /** Success. Set User data in Vuex and redirect to 'from' page or '/' */
      if (r.status === 'success') {
        this.$store.commit('login/setToken', r.data.token)
        this.$store.commit('login/setUser', r.data.user)
        this.$store.commit('login/setLoggedIn', true)

        /** Redirect to the 'from' page (a login-required page that the user
         * was trying to access while logged out) or the home page (default) */
        return this.$route.query.from
          ? this.$router.push({ path: this.$route.query.from })
          : this.$router.push({ path: '/', query: { login: 'yes' } })
      }
    },

    /** Error: Input. Show JoiValidate() error(s) */
    showInputErrors(r) {
      for (let i = 0; i < r.count; i++) {
        r.name[i] in this.input
          ? (this.errors[r.name[i]] = r.message[i])
          : (this.errors.other = r.message[i])
      }
      /** Trigger error messages under the form inputs */
      return this.$refs.form.validate()
    },
  },
}
</script>

<style lang="scss" scoped>
.captcha {
  border: 1px solid #9e9e9e;
  border-radius: 12px;
  background-color: #f6f6f6;
  .captcha-svg {
    margin: 4px 15px;
    text-align: center;
    background-color: #333;
  }
  .captcha-input::v-deep input {
    text-align: center;
  }
}
</style>
