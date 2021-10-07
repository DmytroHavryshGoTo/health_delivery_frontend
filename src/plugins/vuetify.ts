import Vue from 'vue';
import Vuetify from 'vuetify/lib/framework';
import uk from 'vuetify/src/locale/uk'
import en from 'vuetify/src/locale/en'

Vue.use(Vuetify);

export default new Vuetify({
  lang: {
    locales: { en, uk },
    current: localStorage.getItem('locale') || 'en'
  },
  icons: {
    iconfont: 'mdi'
  }
});
