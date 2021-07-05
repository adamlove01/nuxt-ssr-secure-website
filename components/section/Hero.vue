<template>
  <v-container
    class="section-hero"
    :style="`background-image: url('${backgroundImage}');`"
    fluid
  >
    <v-container class="mt-8 d-flex" style="height: 40vh">
      <span class="ma-auto">
        <h1 v-if="heroTitle" class="text-h2 text-center mb-8 white--text">
          {{ heroTitle }}
        </h1>
        <h2 v-if="title" class="text-h4 text-center white--text">
          {{ title }}
        </h2>
      </span>
    </v-container>
  </v-container>
</template>

<script>
export default {
  props: {
    heroTitle: {
      type: String,
      required: false,
      default: '',
    },
    title: {
      type: String,
      required: false,
      default: '',
    },
    backgroundImage: {
      type: String,
      required: false,
      default: '',
    },
  },
}
</script>

<style scoped>
.section-hero {
  min-height: 400px;
  background-position: center;
  background-size: cover;
}
</style>
