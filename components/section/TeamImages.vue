<template>
  <v-container
    class="section-team-images"
    :style="`background-image: url('${backgroundImage}'); background-color: ${backgroundColor}`"
    fluid
  >
    <v-container class="py-10">
      <span class="ma-auto">
        <h1
          v-if="heroTitle"
          class="text-h2 mb-6 text-center"
          style="color: #4a556d"
        >
          {{ heroTitle }}
        </h1>
        <h2
          v-if="title"
          class="text-h4 text-center mb-12"
          style="color: #4a556d"
        >
          {{ title }}
        </h2>
      </span>
      <v-row>
        <v-col v-for="(card, i) in cards" :key="i" cols="12" md="4">
          <v-card flat>
            <div class="d-flex flex-column align-center">
              <v-avatar size="120" color="white" class="mt-4">
                <v-img size="50" :src="card.image"></v-img>
              </v-avatar>

              <v-card-title
                class="title-styles mt-2"
                v-text="card.title"
              ></v-card-title>

              <v-card-subtitle
                class="text-center subtitle-styles pt-2"
                v-text="card.subTitle"
              ></v-card-subtitle>
            </div>
          </v-card>
        </v-col>
      </v-row>
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
    subTitle: {
      type: String,
      required: false,
      default: '',
    },
    cards: {
      type: Array,
      required: true,
      default() {
        return []
      },
    },
    image: {
      type: String,
      required: false,
      default: '/img/users/default.png',
    },
    backgroundImage: {
      type: String,
      required: false,
      default: '',
    },
    backgroundColor: {
      type: String,
      required: false,
      default: 'white',
    },
  },
}
</script>

<style lang="scss" scoped>
.section-team-images {
  background-position: center;
  background-size: cover;
  .v-card {
    background-color: transparent;
    .v-avatar {
      box-shadow: 0px 15px 35px 0px rgba(70, 90, 109, 0.3);
    }
    .title-styles {
      color: #47536b;
    }
    .subtitle-styles {
      font-size: 1.02em;
      line-height: 1.5em;
      color: #6b7b9c;
    }
  }
}
</style>
