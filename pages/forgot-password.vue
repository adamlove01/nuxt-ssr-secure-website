<template>
  <v-container class="bg_white_geometric" fluid>
    <v-container class="pt-8">
      <v-card
        v-show="!linkSent"
        class="mx-auto px-2 py-3 rounded-lg"
        max-width="400"
        elevation="8"
      >
        <v-card-title class="text-h4 justify-center mb-4">
          Change Password</v-card-title
        >
        <v-card-subtitle class="mb-4"
          >Please enter your email address and we will send you an email link to
          change your password.</v-card-subtitle
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
              class="mt-4"
              rounded
              x-large
              block
              color="blue darken-2"
              dark
              @click="submitForm()"
            >
              Send Password Reset Link
            </v-btn>
          </v-form>
        </v-card-text>
      </v-card>
      <div v-show="linkSent">
        <v-alert class="mx-auto px-2 py-3" max-width="400" text type="info">
          {{ linkSent }}
        </v-alert>
        <div style="text-align: center">
          <v-btn nuxt to="/" outlined rounded class="mx-auto mt-8"
            >Go back to home page
          </v-btn>
        </div>
      </div>
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
      linkSent: '',
      input: { email: '' },
      errors: { email: '', other: '' },

      rules: {
        email: [() => this.errors.email === '' || this.errors.email],
      },
    }
  },

  head: {
    title: 'Forgot Password | Your Website',
  },

  methods: {
    /** Submit the form */
    async submitForm() {
      /** Clear all 'errors' values */
      Object.keys(this.errors).forEach((i) => (this.errors[i] = ''))

      /** --- Client-side: Validate */

      /** Sanitize and validate login input */
      /** @var {Array} - [vErr false || {object}, v {object} || false] */
      const [vErr, v] = validate('email', this.input, schema)

      /** Error: Invalid input */
      if (vErr || !v) return this.showInputErrors(joiResponse(vErr))

      /** Reset the form */
      this.$refs.form.resetValidation()

      /** --- Server-side: Log in */

      /** Log in the user */
      const [err, res] = await Try(
        this.$axios.post('/server/forgot-password', {
          email: this.input.email,
        })
      )

      /** Error: Axios */
      if (err || !res.data)
        return (this.errors.other = `Error while sending password reset email. Please try again later.`)

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

      /** Success. Ask user to check their email */
      this.linkSent = r.message
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
