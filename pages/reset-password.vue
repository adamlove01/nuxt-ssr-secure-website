<template>
  <v-container class="bg_white_geometric" fluid>
    <v-container class="pt-8 d-flex">
      <span v-show="!showForm" class="ma-auto">
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
        We're sorry, your email address could not be verified.
        {{ error }}
      </v-alert>
    </v-container>

    <v-container class="pt-8 d-flex">
      <v-card
        v-show="showForm"
        class="mx-auto px-2 py-3 rounded-lg"
        max-width="400"
        elevation="8"
      >
        <v-card-title class="text-h4 justify-center mb-6">
          Enter New Password</v-card-title
        >
        <v-card-text>
          <v-form ref="form">
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
              Update Password
            </v-btn>
          </v-form>
        </v-card-text>
      </v-card>
    </v-container>
  </v-container>
</template>

<script>
import { schema } from '~/validation/schemas/userSchema'
import { validate, joiResponse } from '~/validation/JoiValidate'
import Try from '~/helpers/tryCatch.js'

export default {
  middleware: 'authorize',

  data() {
    return {
      showForm: false,
      error: false,
      showPassword: false,
      id: '',
      input: { password: '' },
      errors: { password: '', other: '' },

      rules: {
        password: [() => this.errors.password === '' || this.errors.password],
      },
    }
  },

  head: {
    title: 'Reset Password | Your Website',
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
    if (r.status !== 'success') {
      this.error = r.message
      return
    }

    /** Success. Get user ID and Show password form */
    this.id = r.data.id
    this.showForm = true
    return
  },

  methods: {
    /** Submit the form */
    async submitForm() {
      /** Clear all 'errors' values */
      Object.keys(this.errors).forEach((i) => (this.errors[i] = ''))

      /** --- Client-side: Validate */

      /** Sanitize and validate login input */
      /** @var {Array} - [vErr false || {object}, v {object} || false] */
      const [vErr, v] = validate('password', this.input, schema)

      /** Error: Invalid input */
      if (vErr || !v) return this.showInputErrors(joiResponse(vErr))

      /** Reset the form */
      this.$refs.form.resetValidation()

      /** --- Server-side: Register */

      /** Register the user in db */
      const [err, res] = await Try(
        this.$axios.post('/server/reset-password', {
          id: this.id,
          password: this.input.password,
        })
      )

      /** Error: Axios */
      if (err || !res.data)
        return (this.errors.other = `Error while updating password.
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
      if (r.status === 'success')
        return this.$router.push({
          path: '/login',
          query: { passwordUpdated: 'yes' },
        })
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
