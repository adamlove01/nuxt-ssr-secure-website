<template>
  <v-container class="bg_white_geometric" fluid>
    <PageTitle title="ADMIN"></PageTitle>
    <v-container class="pt-6">
      <v-data-table
        v-cloak
        :headers="headers"
        :items="users"
        sort-by="name"
        class="elevation-1"
        :footer-props="{
          'items-per-page-options': [10, 20, 50, -1],
          'show-current-page': true,
        }"
      >
        <template #top>
          <v-toolbar flat class="pt-3 py-0 mb-8">
            <v-toolbar-title class="text-h5">Users List</v-toolbar-title>
            <v-spacer></v-spacer>

            <v-dialog v-model="editDialog" max-width="500px">
              <template #activator="{ on, attrs }">
                <v-btn
                  color="primary"
                  dark
                  v-bind="attrs"
                  v-on="on"
                  @click="openNewDialog"
                >
                  Add User
                </v-btn>
              </template>

              <v-form ref="form" lazy-validation>
                <v-card>
                  <v-card-title>
                    <span v-if="input.id === null" class="text-h5"
                      >Add New User</span
                    >
                    <span v-else class="text-h5">Edit User</span>
                  </v-card-title>

                  <v-card-text>
                    <v-container>
                      <v-row>
                        <v-col cols="12">
                          <v-text-field
                            v-model="input.name"
                            class="custom-input-default"
                            label="Full Name"
                            :rules="rules.name"
                          ></v-text-field>

                          <v-text-field
                            v-model="input.email"
                            class="custom-input-default"
                            label="Email"
                            :rules="rules.email"
                          ></v-text-field>

                          <v-text-field
                            v-if="input.id == null"
                            v-model="input.password"
                            class="custom-input-default"
                            label="Password"
                            :rules="rules.password"
                            :append-icon="
                              showPassword
                                ? 'mdi-eye-outline'
                                : 'mdi-eye-off-outline'
                            "
                            :type="showPassword ? 'text' : 'password'"
                            hint="At least 8 characters"
                            counter
                            @click:append="showPassword = !showPassword"
                          ></v-text-field>
                        </v-col>
                        <v-col cols="12" sm="6" md="4">
                          <v-select
                            v-model="input.type"
                            label="Type"
                            :items="typeOptions"
                          ></v-select>
                        </v-col>
                        <v-col cols="12" sm="6" md="4">
                          <v-select
                            v-model="input.status"
                            label="Status"
                            :items="statusOptions"
                          ></v-select>
                        </v-col>
                      </v-row>
                    </v-container>
                  </v-card-text>

                  <v-card-actions>
                    <v-spacer></v-spacer>
                    <v-btn color="blue darken-1" text @click="closeEditDialog">
                      Cancel
                    </v-btn>
                    <v-btn color="blue darken-1" text @click="saveUser">
                      Save
                    </v-btn>
                  </v-card-actions>
                </v-card>
              </v-form>
            </v-dialog>

            <v-dialog v-model="deleteDialog" max-width="500px">
              <v-card>
                <v-card-title class="text-h5">Delete This User?</v-card-title>
                <v-card-text class="body-1">
                  Name: &nbsp;{{ input.name }}<br />
                  Email: &nbsp;{{ input.email }}<br />
                </v-card-text>
                <v-card-actions class="text-right pb-3">
                  <v-spacer></v-spacer>
                  <v-btn color="blue darken-1" text @click="closeDeleteDialog"
                    >Cancel</v-btn
                  >
                  <v-btn color="blue darken-1" text @click="deleteUserOK"
                    >OK</v-btn
                  >
                </v-card-actions>
              </v-card>
            </v-dialog>
          </v-toolbar>
        </template>
        <!-- eslint-disable-next-line vue/valid-v-slot -->
        <template #item.actions="{ item }">
          <v-icon small class="mr-2" @click="openEditDialog(item)">
            mdi-pencil
          </v-icon>
          <v-icon small @click="openDeleteDialog(item)"> mdi-delete </v-icon>
        </template>
      </v-data-table>

      <v-alert
        v-show="errors.other"
        text
        dismissible
        type="error"
        class="mx-auto mt-6"
      >
        {{ errors.other }}
      </v-alert>
    </v-container>
  </v-container>
</template>

<script>
import { schema } from '~/validation/schemas/userSchema'
import { validate, joiResponse } from '~/validation/JoiValidate'
import Try from '~/helpers/tryCatch.js'

export default {
  middleware: 'authorize',

  /** Get all users */
  async asyncData({ $axios }) {
    /** Get the user data from db */
    const [err, res] = await Try($axios.get('/server/users/read'))

    /** Error: Axios */
    if (err || !res.data)
      return {
        errors: {
          other: `Error while retrieving users. Please try again later.`,
        },
      }

    /** @var {Object} r - r.status, r.message, r[other] from server */
    const r = res.data

    /** Error: server */
    if (r.status === 'error') return { errors: { other: r.message } }
    if (r.status === 'info') return { errors: { other: r.message } }

    /** Success. Return user data */
    if (r.status === 'success') return { users: r.data }
  },

  data() {
    const inputInit = {
      id: null,
      name: '',
      email: '',
      password: '',
      type: 'client',
      status: 'active',
    }
    return {
      editDialog: false,
      deleteDialog: false,
      headers: [
        { text: 'Name', value: 'name', align: 'start' },
        { text: 'Email', value: 'email' },
        { text: 'Type', value: 'type' },
        { text: 'Status', value: 'status' },
        { text: 'Actions', value: 'actions', sortable: false },
      ],

      input: inputInit,
      inputDefault: inputInit,
      users: [],

      errors: { name: '', email: '', password: '', other: '' },
      rules: {
        name: [() => this.errors.name === '' || this.errors.name],
        email: [() => this.errors.email === '' || this.errors.email],
        password: [() => this.errors.password === '' || this.errors.password],
      },
      showPassword: false,

      typeOptions: ['client', 'admin'],
      statusOptions: ['active', 'inactive', 'pending'],
    }
  },

  head: {
    title: 'Admin | Your Website',
  },

  methods: {
    openNewDialog() {
      /** Clear all 'errors' values */
      Object.keys(this.errors).forEach((i) => (this.errors[i] = ''))
      this.input = Object.assign({}, this.inputDefault)
      this.editDialog = true
      /** Wait for dialog to fully load and form exists */
      this.$nextTick(() => {
        this.$refs.form.resetValidation()
      })
    },

    openEditDialog(item) {
      /** Clear all 'errors' values */
      Object.keys(this.errors).forEach((i) => (this.errors[i] = ''))
      this.input = Object.assign({}, item)
      this.editDialog = true
      /** Wait for dialog to fully load and form exists */
      this.$nextTick(() => {
        this.$refs.form.resetValidation()
      })
    },

    closeEditDialog() {
      this.editDialog = false
    },

    openDeleteDialog(item) {
      this.input = Object.assign({}, item)
      this.deleteDialog = true
    },

    closeDeleteDialog() {
      this.deleteDialog = false
    },

    async deleteUserOK() {
      const r = await this.deleteUser()
      if (r === 'success') {
        this.closeDeleteDialog()
        /** Refresh the asyncData from the server (the list of users) */
        this.$nuxt.refresh()
      }
    },

    async saveUser() {
      const r =
        this.input.id === null
          ? await this.createUser()
          : await this.updateUser()
      if (r === 'success') {
        this.closeEditDialog()
        /** Refresh the asyncData from the server (the list of users) */
        this.$nuxt.refresh()
      }
    },

    /** Create User -- submit form */
    async createUser() {
      /** Clear all 'errors' values */
      Object.keys(this.errors).forEach((i) => (this.errors[i] = ''))

      /** --- Client-side: Validate */

      /** Sanitize and validate input */
      /** @var {Array} - [vErr false || {object}, v {object} || false] */
      const [vErr, v] = validate(
        'name, email, password, type, status',
        this.input,
        schema
      )

      /** Error: Invalid input */
      if (vErr || !v) return this.showInputErrors(joiResponse(vErr))

      /** Reset the form */
      this.$refs.form.resetValidation()

      /** --- Server-side: Create user */

      /** Create the user in db */
      const [err, res] = await Try(
        this.$axios.post(
          '/server/users/create',
          {
            name: this.input.name,
            email: this.input.email,
            password: this.input.password,
            type: this.input.type,
            status: this.input.status,
          },
          { headers: { Authorization: this.$store.state.login.token } }
        )
      )

      /** Error: Axios */
      if (err || !res.data)
        return (this.errors.other = `Error while creating the user. 
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

      /** Success */
      return 'success'
    },

    /** Update User -- submit form */
    async updateUser() {
      /** Clear all 'errors' values */
      Object.keys(this.errors).forEach((i) => (this.errors[i] = ''))

      /** --- Client-side: Validate */

      /** Sanitize and validate input */
      /** @var {Array} - [vErr false || {object}, v {object} || false] */
      const [vErr, v] = validate(
        'name, email, type, status',
        this.input,
        schema
      )

      /** Error: Invalid input */
      if (vErr || !v) return this.showInputErrors(joiResponse(vErr))

      /** Reset the form */
      this.$refs.form.resetValidation()

      /** --- Server-side: Update user */

      /** Update the user in db */
      const [err, res] = await Try(
        this.$axios.put(
          '/server/users/update',
          {
            id: this.input.id,
            name: this.input.name,
            email: this.input.email,
            type: this.input.type,
            status: this.input.status,
          },
          { headers: { Authorization: this.$store.state.login.token } }
        )
      )

      /** Error: Axios */
      if (err || !res.data)
        return (this.errors.other = `Error while updating the user. 
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

      /** Success */
      return 'success'
    },

    /** Delete User */
    async deleteUser() {
      /** Delete the user in db */
      const [err, res] = await Try(
        this.$axios.delete(`/server/users/delete/${this.input.id}`, {
          headers: { Authorization: this.$store.state.login.token },
        })
      )

      /** Error: Axios */
      if (err || !res.data)
        return (this.errors.other = `Error while deleting the user. 
        Please try again later.`)

      /** @var {Object} r - r.status, r.message, r[other] from server */
      const r = res.data

      if (r.status === 'error') {
        r.name in this.input
          ? (this.errors[r.name] = r.message)
          : (this.errors.other = r.message)
      }

      /** Success */
      return 'success'
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
