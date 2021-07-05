# ASSETS

The `/assets` folder is for any file assets that require processing. For example .scss files need to be converted to plain .css using the installed `sass` and `sass-loader` npm packages. Fonts are another good example -- if you want to include fonts directly from your server, you can add them here.

## css/variables.scss
This file contains all global CSS. This project uses Vuetify so custom heading, subtitle and body fonts are defined here to override Vuetify defaults. 

Global CSS will override Vuetify's default styling so keep that in mind.

This file is defined in nuxt.config.js:
```
...
css: [{ src: '~/assets/css/variables.scss', lang: 'scss' }],
...
```

## More info

[Nuxtjs.org - Assets Directory](https://nuxtjs.org/docs/2.x/directory-structure/assets)

[Vuetifyjs.com - SASS Variables](https://vuetifyjs.com/en/features/sass-variables/)

