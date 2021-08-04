# COMPONENTS

We are using the Vuetify component library in this project so most of our components are from Vuetify -- we do not need a lot of custom components. Vuetify was installed using Vue CLI. We did not use the Nuxt Vuetify module because this is locked at a lower version. We wanted the latest version of Vuetify for our project.

## Section folder

All presentation sections for landing pages, About pages and other 'banner' sections are in this folder.

### PageTitle.vue
A title component for logged-in pages.

### section/Hero.vue
A full-width image section with hero title.

### section/Benefits.vue
A landing page section showing a series of cards.

### section/Technology.vue
A landing page section showing a series of cards with links.

Note that we have enabled @nuxt/components by `npm install @nuxt/components` and setting `components: true` in nuxt.config.js which allows us to include custom components on a .vue page without needing to manually import them in the code.

## TheFooter.vue

The footer appears on every page. It is added in `/layouts/default.vue`.

## More info

[Nuxtjs.org - Components](https://nuxtjs.org/docs/2.x/directory-structure/components)

[npmjs.com - @nuxt/components](https://www.npmjs.com/package/@nuxt/components)

[Vuetify - Getting Started](https://vuetifyjs.com/en/getting-started/installation/)

[Vuetify - Footers](https://vuetifyjs.com/en/components/footer/)
