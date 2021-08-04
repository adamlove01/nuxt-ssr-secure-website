<template>
  <v-container
    class="section-text"
    :style="`background-image: url('${backgroundImage}'); background-color: ${backgroundColor}`"
    fluid
  >
    <v-container class="py-10">
      <span class="ma-auto">
        <h2 class="text-h4 text-center" style="color: #4a556d">
          {{ title }}
        </h2>
        <h3
          class="mt-4 subtitle-big"
          style="color: #6b7b9c"
          v-html="subTitle"
        ></h3>
      </span>
    </v-container>
  </v-container>
</template>

<script>
export default {
  props: {
    title: {
      type: String,
      required: false,
      default: '',
    },
    subTitle: {
      type: String,
      required: false,
      default: '',
    },
    backgroundImage: {
      type: String,
      required: false,
      default: '',
    },
    backgroundColor: {
      type: String,
      required: false,
      default: '#f9fafd',
    },
  },
}
</script>

<style lang="scss" scoped>
.section-text {
  min-height: 400px;
  background-position: center;
  background-size: cover;
}
</style>
