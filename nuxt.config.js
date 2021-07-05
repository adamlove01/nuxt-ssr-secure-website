import * as dotenv from 'dotenv'
dotenv.config()

export default {
  /**
   * Headers of the page
   * Favicons were generated using https://realfavicongenerator.net/
   */
  head: {
    title: 'Your Website',
    meta: [
      { charset: 'utf-8' },
      { name: 'viewport', content: 'width=device-width, initial-scale=1' },
      {
        hid: 'description',
        name: 'description',
        content: process.env.npm_package_description || '',
      },
    ],
    link: [
      {
        rel: 'apple-touch-icon',
        href: '/apple-touch-icon.png',
        sizes: '180x180',
      },
      {
        rel: 'icon',
        type: 'image/png',
        href: '/favicon-32x32.png',
        sizes: '32x32',
      },
      {
        rel: 'icon',
        type: 'image/png',
        href: '/favicon-16x16.png',
        sizes: '16x16',
      },
      {
        rel: 'manifest',
        href: '/site.webmanifest',
      },
      {
        rel: 'mask-icon',
        href: '/safari-pinned-tab.svg',
        color: '#5bbad5',
      },
      {
        rel: 'shortcut icon',
        href: '/favicon.ico',
      },
      {
        name: 'msapplication-TileColor',
        content: '#da532c',
      },
      {
        name: 'msapplication-config',
        content: '/browserconfig.xml',
      },
      {
        name: 'theme-color',
        content: '#ffffff',
      },

      { rel: 'preconnect', href: 'https://fonts.gstatic.com' },
      {
        rel: 'stylesheet',
        href:
          'https://fonts.googleapis.com/css2?family=DM+Sans:wght@400;500;600&display=swap',
      },
    ],
  },

  /**
   * Content Security Policy (CSP)
   */
  render: {
    csp: {
      reportOnly: true,
      addMeta: false,
      hashAlgorithm: 'sha256',
      policies: {
        'default-src': ["'self'"],
        'base-uri': [process.env.BASE_URL],
        'script-src': ["'self'", "'unsafe-inline'"],
        'style-src': [
          "'self'",
          "'unsafe-inline'",
          '*.gstatic.com',
          '*.googleapis.com',
        ],
        'font-src': ["'self'", '*.gstatic.com', '*.googleapis.com'],
        'img-src': ["'self'"],
        'connect-src': ["'self'"],
        'form-action': ["'self'"],
        'object-src': ["'self'"],
      },
    },
  },

  /**
   * Customize the progress-bar color
   */
  loading: { color: '#4285f4' },

  /**
   * Global CSS
   */
  css: [{ src: '~/assets/css/variables.scss', lang: 'scss' }],

  /**
   * Components
   */
  /** Auto-import components in .vue files */
  components: true,

  /**
   * Plugins to load before mounting the App
   */
  plugins: [{ src: '@plugins/vuetify' }, { src: '~/plugins/directives.js' }],

  /**
   * Nuxt.js dev-modules
   */
  buildModules: ['@nuxt/components'],

  /**
   * Nuxt.js modules
   */
  modules: [
    /** helmet options - see https://helmetjs.github.io/docs/ */
    'nuxt-helmet',
    /** Doc: https://axios.nuxtjs.org/usage */
    '@nuxtjs/axios',
  ],

  /**
   * Axios module configuration
   * See https://axios.nuxtjs.org/options
   */
  axios: {
    baseURL: process.env.BASE_URL,
    browserBaseURL: process.env.BROWSER_BASE_URL,
    debug: false,
  },

  /**
   * Build configuration
   */
  build: {
    /**
     * You can extend webpack config here
     *
     * extend(config, ctx) {},
     */
    analyze: false,
    extend(config, { isClient }) {
      if (isClient) {
        config.optimization.splitChunks.maxSize = 200000
      }
    },
  },
  /** Express server */
  serverMiddleware: ['~/server/addRoutes.js'],

  telemetry: false,
}
