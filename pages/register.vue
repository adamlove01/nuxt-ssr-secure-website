<template>
  <v-container id="section-1" fluid>
    <v-container v-if="!showSignUp" class="pt-8 d-flex">
      <span class="ma-auto">
        <h1 class="text-h4 text-center mt-8">Sign-up is disabled.</h1>
      </span>
    </v-container>

    <v-container v-else class="pt-8">
      <v-card
        v-show="!registerSuccess"
        class="mx-auto px-2 py-3 rounded-lg"
        max-width="400"
        elevation="8"
      >
        <v-card-title class="text-h4 justify-center mb-6">
          Sign up now!</v-card-title
        >
        <v-card-text>
          <v-form ref="form">
            <v-text-field
              v-model="input.name"
              outlined
              class="custom-input-outlined rounded-lg mb-2"
              label="Full Name"
              prepend-inner-icon="mdi-account-outline"
              :rules="rules.name"
            ></v-text-field>

            <v-text-field
              v-model="input.email"
              outlined
              class="custom-input-outlined rounded-lg mb-2"
              label="Email"
              prepend-inner-icon="mdi-email-outline"
              :rules="rules.email"
            ></v-text-field>

            <v-text-field
              v-model="input.password"
              outlined
              class="custom-input-outlined rounded-lg"
              label="Password"
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
              Sign up
            </v-btn>
          </v-form>
        </v-card-text>
      </v-card>

      <p v-show="!registerSuccess" class="mt-8 text-center">
        Already signed up? &nbsp;
        <v-btn small outlined rounded color="blue darken-2" nuxt to="/login"
          >Sign in</v-btn
        >
      </p>

      <v-slide-y-transition>
        <v-card
          v-show="registerSuccess"
          class="mx-auto rounded-lg"
          max-width="600"
          elevation="8"
        >
          <v-toolbar color="primary" dark
            ><v-card-title class="text-h5 mx-auto">
              Sign Up Successful!</v-card-title
            ></v-toolbar
          >
          <v-card-text class="mx-auto pa-12">
            <h2 class="text-h4 mb-6">Please verify your account.</h2>
            <p class="text-body-1 mb-10">
              <b>Check your email</b> inbox and click on the link to verify your
              account. Then you're all set!
            </p>
            <div class="d-flex justify-center">
              <v-btn nuxt to="/login" outlined rounded
                >Go to Sign In Page</v-btn
              >
            </div>
          </v-card-text>
        </v-card>
      </v-slide-y-transition>
    </v-container>
  </v-container>
</template>

<script>
import { schema } from '~/validation/schemas/userSchema'
import { validate, joiResponse } from '~/validation/JoiValidate'
import Try from '~/helpers/tryCatch.js'

export default {
  middleware: 'authorize',

  /** Set showSignUp = false to disable all signups */
  data() {
    return {
      showSignUp: true,
      registerSuccess: false,
      showPassword: false,
      input: { name: '', email: '', password: '' },
      errors: { name: '', email: '', password: '', other: '' },

      rules: {
        name: [() => this.errors.name === '' || this.errors.name],
        email: [() => this.errors.email === '' || this.errors.email],
        password: [() => this.errors.password === '' || this.errors.password],
      },
    }
  },

  head: {
    title: 'Sign up | Your Website',
  },

  methods: {
    /** Submit the form */
    async submitForm() {
      /** Clear all 'errors' values */
      Object.keys(this.errors).forEach((i) => (this.errors[i] = ''))

      /** --- Client-side: Validate */

      /** Sanitize and validate login input */
      /** @var {Array} - [vErr false || {object}, v {object} || false] */
      const [vErr, v] = validate('name, email, password', this.input, schema)

      /** Error: Invalid input */
      if (vErr || !v) return this.showInputErrors(joiResponse(vErr))

      /** Reset the form */
      this.$refs.form.resetValidation()

      /** --- Server-side: Register */

      /** Register the user in db */
      const [err, res] = await Try(
        this.$axios.post('/server/register', {
          name: this.input.name,
          email: this.input.email,
          type: 'client',
          status: 'pending',
          password: this.input.password,
        })
      )

      /** Error: Axios */
      if (err || !res.data)
        return (this.errors.other = `Error while signing up.
        Please try again later.`)

      /** @var {Object} r - r.status, r.message, r[other] from server */
      const r = res.data

      /** Error: Input. Show JoiValidate() server error(s) */
      if (r.status === 'inputError') return this.showInputErrors(r)

      /** Error: server */
      if (r.status === 'error') {
        r.name in this.input
          ? (this.errors[r.name] = r.message)
          : (this.errors.other = r.message)

        /** Trigger error messages under the form inputs */
        return this.$refs.form.validate()
      }

      /** Success. Go to login page with success message */
      if (r.status === 'success') {
        this.registerSuccess = true
      }
      // return this.$router.push({
      //   path: '/login',
      //   query: { registered: 'yes' },
      // })
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
