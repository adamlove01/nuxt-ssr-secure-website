<template>
  <v-footer class="footer-bg" dark padless>
    <v-row justify="center" no-gutters>
      <v-col class="footer-bg pt-4 text-center" cols="12">
        <v-btn
          v-for="item in footerLinks"
          :key="item.name"
          text
          rounded
          class="my-2"
          nuxt
          :to="item.link"
          active-class="none"
        >
          {{ item.name }}
        </v-btn>
      </v-col>

      <v-col class="footer-bg pt-2 text-center" cols="12">
        <v-btn
          v-for="item in socialIcons"
          :key="item.icon"
          class="mx-4 white--text"
          icon
          :href="item.link"
        >
          <v-icon size="24px">
            {{ item.icon }}
          </v-icon>
        </v-btn>
      </v-col>

      <v-col class="footer-bg pt-5 pb-4 text-center caption" cols="12">
        © {{ new Date().getFullYear() }} — Your Website, All rights reserved
      </v-col>
    </v-row>
  </v-footer>
</template>

<script>
export default {
  data() {
    return {
      activeclass: false,
      footerLinks: [
        { name: 'Home', link: '/' },
        { name: 'About', link: '/about' },
        { name: 'Contact', link: '/contact' },
      ],
      socialIcons: [
        { icon: 'mdi-facebook', link: 'https://facebook.com' },
        { icon: 'mdi-twitter', link: 'https://twitter.com' },
        { icon: 'mdi-linkedin', link: 'https://linkedin.com' },
        { icon: 'mdi-instagram', link: 'https://instagram.com' },
      ],
    }
  },
}
</script>

<style lang="scss" scoped>
body .v-application {
  /** Custom footer background color */
  .footer-bg {
    background-color: #2b354f;
  }
  /** Don't show opacity on active link */
  .theme--dark.v-btn--active:before {
    opacity: 0;
  }
  /** Show normal opacity on active:hover link */
  .theme--dark.v-btn--active:hover:before {
    opacity: 0.08;
  }
}
</style>
