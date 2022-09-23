import Vue from 'vue'
import './plugins/bootstrap-vue'
import { BootstrapVueIcons } from 'bootstrap-vue'
import App from './App.vue'
import router from './router'
import VoerroTagsInput from '@voerro/vue-tagsinput';

import VueCookies from 'vue-cookies-reactive'
Vue.use(VueCookies)
Vue.component('tags-input', VoerroTagsInput);



// Vue.use(require('vue-cookies'))
// Vue.use(require('vue-cookies-reactive'))

Vue.use(BootstrapVueIcons)
Vue.config.productionTip = false

new Vue({
  router,
  render: h => h(App)
}).$mount('#app')
