<template>
  <div>
    <SectionHero
      hero-title="HELLO!"
      title="This could be your website."
      background-image="/img/bg_sunset.jpg"
    ></SectionHero>
    <SectionTechnology
      title="Built with the latest technology."
      button-text="Learn More"
      :cards="sectionTechnologyCards"
      background-image="/img/bg_white_geometric.jpg"
    ></SectionTechnology>
    <SectionBenefitsIcons
      :cards="sectionBenefitsIconsCards"
    ></SectionBenefitsIcons>
    <SectionBenefits
      title="Production-ready security you can trust."
      sub-title="You need a stable, reliable website that won't be hacked two days after launch. We've got you covered."
      background-image="/img/bg_white_parchment.jpg"
      :cards="sectionBenefitsCards"
    ></SectionBenefits>

    <v-snackbar v-model="sb.open" top rounded :color="sb.color">
      {{ sb.text }}
      <template #action="{ attrs }">
        <v-btn
          color="#ddd"
          text
          min-width="30px"
          class="body-1"
          v-bind="attrs"
          @click="sb.open = false"
        >
          <v-icon>mdi-window-close</v-icon>
        </v-btn>
      </template>
    </v-snackbar>
  </div>
</template>

<script>
export default {
  middleware: 'authorize',

  data() {
    return {
      sectionTechnologyCards: [
        {
          title: 'Nuxt.js',
          subTitle: 'A popular framework for creating Vue.js applications.',
          image: '/img/logo-nuxt.png',
          href: 'https://nuxtjs.org/',
        },
        {
          title: 'Express',
          subTitle: 'The Node.js server framework you know and love.',
          image: '/img/logo-expressjs.png',
          href: 'https://expressjs.com/',
        },
        {
          title: 'Vuetify',
          subTitle: 'The Material Design CSS framework for fantastic UI/UX.',
          image: '/img/logo-vuetify.png',
          href: 'https://vuetifyjs.com/en/',
        },
        {
          title: 'Knex.js',
          subTitle:
            'The awesome SQL query builder for Postgres, MariaDB & more.',
          image: '/img/logo-knex.png',
          href: 'http://knexjs.org/',
        },
        {
          title: 'Joi Validation',
          subTitle: 'The most powerful data validation library for Javascript.',
          image: '/img/logo-joi.png',
          href: 'https://joi.dev/api/?v=17.4.0',
        },
        {
          title: 'Node ES Modules',
          subTitle: 'Share code between the Vue client and the Express server!',
          image: '/img/logo-node+esm.png',
          href: 'https://blog.logrocket.com/es-modules-in-node-today/',
        },
      ],

      sectionBenefitsIconsCards: [
        {
          title: 'Professional UI',
          subTitle: 'Trendy design and user-friendly interface',
          icon: 'mdi-gesture-double-tap',
          iconColor: 'blue',
        },
        {
          title: 'Mobile-friendly Nav',
          subTitle: 'Adjusts to any screen size with nice menus',
          icon: 'mdi-cellphone-text',
          iconColor: 'orange darken-1',
        },
        {
          title: 'Well Documented',
          subTitle: 'Heavily-commented code and READMEs for every file',
          icon: 'mdi-text-box-check-outline',
          iconColor: 'green accent-4',
        },
      ],

      sectionBenefitsCards: [
        {
          title: 'Helmet.js',
          subTitle: `Adds security-related HTTP response headers to prevent 
            attacks like ClickJacking, sniffing attacks and more.`,
        },
        {
          title: 'Content Security Policy (CSP)',
          subTitle: `An added layer of security that helps to detect and 
            mitigate certain types of attacks, including Cross Site Scripting 
            (XSS) and data injection.`,
        },
        {
          title: 'Sanitized & Validated input',
          subTitle: `All input on both the client and server is sanitized & 
            validated using the powerful Joi validation and sanitize-html libraries.`,
        },
        {
          title: 'Login Captcha',
          subTitle: `SVG Captcha prevents bots from spamming your login page. 
            The captcha randomly shows text or a math problem to keep bots 
            guessing.`,
        },
        {
          title: 'User Access List',
          subTitle: `Controls access to all pages and routes based on user type.
            You can change access rules for any page or server route from 
            a single file.`,
        },
        {
          title: 'Secure JSON WebTokens',
          subTitle: `Uses JWT to verify login. The accessToken is 
          stored in memory (VUEX) and the refreshToken is HttpOnly with 
          'expires' and 'sameSite' flags.`,
        },
      ],

      sb: { open: false, color: 'success', text: '' },
    }
  },

  mounted() {
    if (this.$route.query.login === 'yes') {
      this.sb.color = 'success'
      this.sb.text = 'You are signed in.'
      return (this.sb.open = true)
    }
    if (this.$route.query.logout === 'yes') {
      this.sb.color = 'success'
      this.sb.text = 'You are signed out.'
      return (this.sb.open = true)
    }
    if (this.$route.query.logout === 'error') {
      this.sb.color = 'error'
      this.sb.text = 'Sign-out error. Please try again.'
      return (this.sb.open = true)
    }
  },
}
</script>
