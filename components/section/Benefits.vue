<template>
  <v-container
    class="section-benefits"
    :style="`background-image: url('${backgroundImage}'); background-color: ${backgroundColor}`"
    fluid
  >
    <v-container class="py-10">
      <span class="ma-auto">
        <h2 class="text-h4 text-center" style="color: #4a556d">
          {{ title }}
        </h2>
        <h3 class="text-center mt-4 subtitle-big" style="color: #6b7b9c">
          {{ subTitle }}
        </h3>
      </span>

      <v-row class="mt-10">
        <v-col v-for="(card, i) in cards" :key="i" cols="12" md="6">
          <v-hover v-slot="{ hover }">
            <v-card rounded="md" :class="`${hover ? 'on-hover' : ''}`">
              <div class="d-flex">
                <div style="width: 40px">
                  <v-img
                    contain
                    height="15"
                    class="ml-4 my-6 align-self-start"
                    :src="icon"
                  ></v-img>
                </div>

                <div class="flex-grow-1">
                  <v-card-title
                    class="title-styles pt-4"
                    v-text="card.title"
                  ></v-card-title>

                  <v-card-subtitle
                    class="subtitle-styles pt-1 pb-5"
                    v-text="card.subTitle"
                  ></v-card-subtitle>
                </div>
              </div>
            </v-card>
          </v-hover>
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
.section-benefits {
  min-height: 400px;
  background-position: center;
  background-size: cover;
  .v-card {
    min-height: 144px;
    transition: all 0.3s ease-in-out;
    box-shadow: 0px 15px 35px 0px rgba(112, 144, 176, 0.2);
    .title-styles {
      font-weight: 500 !important;
      color: #47536b;
    }
    .subtitle-styles {
      font-size: 1.02em;
      line-height: 1.5em;
      color: #6b7b9c;
    }
  }
  .on-hover {
    box-shadow: 0px 15px 35px 0px rgba(112, 144, 176, 0.4);
    transform: scale(1.03);
  }
}
</style>
