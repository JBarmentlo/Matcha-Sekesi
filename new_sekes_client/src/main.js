import Vue from 'vue'
import './plugins/bootstrap-vue'
import { BootstrapVueIcons } from 'bootstrap-vue';

import App from './App.vue'
import router from './router'
import VueCookies from 'vue-cookies-reactive'
Vue.use(VueCookies)

import VoerroTagsInput from '@voerro/vue-tagsinput';
Vue.component('tags-input', VoerroTagsInput);

Vue.use(BootstrapVueIcons)
Vue.config.productionTip = false

import Notifications from 'vue-notification'
Vue.use(Notifications)

new Vue({
  router,
  render: h => h(App)
}).$mount('#app')
