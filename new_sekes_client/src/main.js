import Vue from 'vue'
import './plugins/bootstrap-vue'
import { BootstrapVueIcons } from 'bootstrap-vue'
import App from './App.vue'
import router from './router'

Vue.use(require('vue-cookies'))
Vue.use(BootstrapVueIcons)
Vue.config.productionTip = false

new Vue({
  router,
  render: h => h(App)
}).$mount('#app')
