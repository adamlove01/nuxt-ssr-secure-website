<template>
  <v-container fluid>
    <v-container class="pt-9" style="text-align: center">
      <div v-if="error.statusCode === 404">
        <v-img
          src="/img/error-404.png"
          class="ma-auto"
          min-height="268px"
          max-width="400px"
          contain
        ></v-img>
        <h1>Oops, this page is extinct.</h1>
      </div>

      <div v-else-if="error.statusCode === 401">
        <v-img
          src="/img/error-401.png"
          class="ma-auto"
          min-height="228px"
          max-width="200px"
          contain
        ></v-img>
        <h1>Not Authorized</h1>
        <p class="mt-2">{{ error.message }}</p>
      </div>

      <div v-else>
        <v-img
          src="/img/error-unknown.png"
          class="ma-auto"
          min-height="228px"
          max-width="200px"
          contain
        ></v-img>
        <h1 class="mt-5">Unknown Error</h1>
        <p class="mt-2">Please try again later.</p>
      </div>

      <v-btn nuxt to="/" outlined rounded class="mt-8"
        >Go back to home page
      </v-btn>
    </v-container>
  </v-container>
</template>

<script>
export default {
  props: {
    error: {
      type: Object,
      required: true,
      default() {
        return { statusCode: '', message: '' }
      },
    },
  },
}
</script>
