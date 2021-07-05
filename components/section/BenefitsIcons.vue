<template>
  <v-container
    class="section-benefits-icons"
    :style="`background-image: url('${backgroundImage}'); background-color: ${backgroundColor}`"
    fluid
  >
    <v-container class="py-10">
      <v-row>
        <v-col v-for="(card, i) in cards" :key="i" cols="12" md="4">
          <v-card flat>
            <div class="d-flex flex-column align-center">
              <v-avatar size="120" color="white" class="mt-4">
                <v-icon size="50" :color="card.iconColor" :src="icon">{{
                  card.icon
                }}</v-icon>
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
    icon: {
      type: String,
      required: false,
      default: '/img/icon-checkmark.png',
    },
    iconColor: {
      type: String,
      required: false,
      default: 'primary',
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
.section-benefits-icons {
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
