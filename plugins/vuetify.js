import Vue from 'vue'
import Vuetify from 'vuetify'
import 'vuetify/dist/vuetify.min.css'
import '@mdi/font/css/materialdesignicons.css'
Vue.use(Vuetify)

export default (ctx) => {
  const vuetify = new Vuetify({
    treeShake: true,
    theme: {
      dark: false,
    },
  })

  ctx.app.vuetify = vuetify
  ctx.$vuetify = vuetify.framework
}
