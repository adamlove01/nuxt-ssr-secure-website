<template>
  <v-container fluid>
    <v-container class="pt-8">
      <v-row>
        <v-col class="col-12 col-md-6 col-lg-7">
          <h1 class="text-h4 mt-2 mb-5" style="color: #4a556d">
            We want to hear from you!
          </h1>
          <p class="text-body-1 mb-6" style="color: #6b7b9c">
            Our customers are important to us. Drop us a line and let us know
            what you're thinking.
          </p>
          <v-img src="/img/bg_email.png" max-width="670" />
        </v-col>
        <v-col class="col-12 col-md-6 col-lg-5">
          <v-card
            class="mx-auto rounded-lg"
            elevation="0"
            max-width="600"
            color="transparent"
          >
            <v-card-text>
              <v-form ref="form">
                <v-text-field
                  v-model="input.name"
                  class="custom-input-outlined rounded-lg mb-2"
                  background-color="white"
                  label="Name"
                  outlined
                  prepend-inner-icon="mdi-account-outline"
                  :rules="rules.name"
                ></v-text-field>
                <v-text-field
                  v-model="input.email"
                  class="custom-input-outlined rounded-lg mb-2"
                  background-color="white"
                  label="Email"
                  outlined
                  prepend-inner-icon="mdi-email-outline"
                  :rules="rules.email"
                ></v-text-field>
                <v-text-field
                  v-model="input.subject"
                  class="custom-input-outlined rounded-lg mb-2"
                  background-color="white"
                  label="Subject"
                  outlined
                  prepend-inner-icon="mdi-pencil-outline"
                  :rules="rules.subject"
                ></v-text-field>
                <v-textarea
                  v-model="input.message"
                  class="custom-input-outlined rounded-lg mb-2"
                  background-color="white"
                  label="Your message"
                  outlined
                  :rules="rules.message"
                ></v-textarea>

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
                  class="mt-0 mb-6"
                  rounded
                  x-large
                  block
                  color="blue darken-2"
                  dark
                  @click="submitForm()"
                >
                  Send
                </v-btn>

                <v-alert
                  v-if="emailSent"
                  text
                  type="success"
                  class="mt-6 mx-auto"
                  max-width="600"
                >
                  {{ emailSent }}
                </v-alert>
              </v-form>
            </v-card-text>
          </v-card>
        </v-col>
      </v-row>
    </v-container>
  </v-container>
</template>

<script>
import { schema } from '~/validation/schemas/mailSchema'
import { validate, joiResponse } from '~/validation/JoiValidate'
import Try from '~/helpers/tryCatch.js'

export default {
  middleware: 'authorize',

  data() {
    return {
      showPassword: false,
      emailSent: false,

      input: { name: '', email: '', subject: '', message: '' },
      errors: { name: '', email: '', subject: '', message: '', other: '' },

      rules: {
        name: [() => this.errors.name === '' || this.errors.name],
        email: [() => this.errors.email === '' || this.errors.email],
        subject: [() => this.errors.subject === '' || this.errors.subject],
        message: [() => this.errors.message === '' || this.errors.message],
      },
    }
  },

  head: {
    title: 'Contact us | Your Website',
  },

  methods: {
    /** Submit the form */
    async submitForm() {
      /** Clear all 'errors' values */
      Object.keys(this.errors).forEach((i) => (this.errors[i] = ''))

      /** --- Client-side: Validate */

      /** Sanitize and validate login input */
      /** @var {Array} - [vErr false || {object}, v {object} || false] */
      const [vErr, v] = validate(
        'name, email, subject, message',
        this.input,
        schema
      )

      /** Error: Invalid input */
      if (vErr || !v) return this.showInputErrors(joiResponse(vErr))

      /** Reset the form */
      this.$refs.form.resetValidation()

      /** --- Server-side: Log in */

      /** Send the email */
      const [err, res] = await Try(
        this.$axios.post('/server/sendContactEmail', this.input)
      )

      /** Error: Axios */
      if (err || !res.data)
        return (this.errors.other = `Error while sending email.
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

        /** If password failed, show captcha */
        if (this.errors.password) this.resetCaptcha()

        /** Trigger error messages under the form inputs */
        return this.$refs.form.validate()
      }

      /** Success. */
      /** Clear all 'input' values */
      Object.keys(this.input).forEach((i) => (this.input[i] = ''))
      /** Show 'Email Sent' message */
      if (r.status === 'success') return (this.emailSent = r.message)
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
body
  .v-application
  form
  .custom-input-outlined.v-input
  > .v-input__control
  > .v-input__slot {
  background-color: white;
}
</style>
