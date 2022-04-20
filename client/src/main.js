import '@babel/polyfill'
import 'mutationobserver-shim'
import Vue from 'vue'
import './plugins/bootstrap-vue'
import { BootstrapVueIcons } from 'bootstrap-vue'
import App from './App.vue'
import router from './router'
// import 'bootstrap/dist/css/bootstrap.min.css'
import '@/assets/css/main.css'
import VoerroTagsInput from '@voerro/vue-tagsinput';

Vue.component('tags-input', VoerroTagsInput);

Vue.use(require('vue-cookies'))
Vue.use(BootstrapVueIcons)

Vue.config.productionTip = false
new Vue({
  router,
  render: h => h(App)
}).$mount('#app')