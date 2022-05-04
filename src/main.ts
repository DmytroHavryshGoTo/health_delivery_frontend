import Vue from 'vue'
import App from './App.vue'
import './registerServiceWorker'
import router from './router'
import store from './store'
import vuetify from './plugins/vuetify'
import VueI18n from 'vue-i18n'
import Vuelidate from 'vuelidate'
import JsonViewer from "vue-json-viewer";
import * as VueGoogleMaps from "vue2-google-maps";
import "material-design-icons-iconfont/dist/material-design-icons.css";

import { messages } from "./utils/locales";

Vue.config.productionTip = false;

Vue.use(JsonViewer);
Vue.use(VueI18n)
Vue.use(Vuelidate)
Vue.use(VueGoogleMaps, {
  load: {
    key: process.env.VUE_APP_GOOGLE_MAPS_KEY,
    map_ids: process.env.VUE_APP_MAP_ID,
    libraries: 'places,drawing,visualization'
  }
});

let locale: string | null = localStorage.getItem('locale')
if (!locale) {
  locale = 'en'
  localStorage.setItem('locale', locale)
}

const i18n = new VueI18n({
  locale,
  messages
})

new Vue({
  router,
  store,
  i18n,
  vuetify,
  render: h => h(App)
}).$mount('#app')
