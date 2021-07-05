<template>
  <v-container
    class="section-technology"
    :style="`background-image: url('${backgroundImage}'); 
             background-color: ${backgroundColor}`"
    fluid
  >
    <v-container class="py-12">
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
        <v-col v-for="(card, i) in cards" :key="i" cols="12" md="6">
          <v-hover v-slot="{ hover }">
            <v-card shaped :class="`${hover ? 'on-hover' : ''}`">
              <div class="d-flex flex-no-wrap justify-space-between">
                <div
                  class="d-flex flex-column flex-no-wrap justify-space-between"
                >
                  <v-card-title
                    class="title-styles pt-3"
                    v-text="card.title"
                  ></v-card-title>

                  <v-card-subtitle
                    class="subtitle-styles pt-1"
                    v-text="card.subTitle"
                  ></v-card-subtitle>

                  <v-card-actions>
                    <a
                      :href="card.href"
                      class="ml-2 mb-1 text-body2 link-styles"
                      >{{ buttonText }}
                      <v-icon small class="link-styles"
                        >mdi-chevron-right</v-icon
                      ></a
                    >
                  </v-card-actions>
                </div>

                <v-avatar class="ma-3" size="125" tile>
                  <v-img :src="card.image"></v-img>
                </v-avatar>
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
    cards: {
      type: Array,
      required: true,
      default() {
        return []
      },
    },
    buttonText: {
      type: String,
      required: true,
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
.section-technology {
  min-height: 400px;
  background-position: center;
  background-size: cover;
  .v-card {
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
    .link-styles {
      color: #929db6;
      &:hover {
        color: #47536b;
      }
    }
  }
  .on-hover {
    box-shadow: 0px 15px 35px 0px rgba(112, 144, 176, 0.4);
    transform: scale(1.03);
  }
}
</style>
