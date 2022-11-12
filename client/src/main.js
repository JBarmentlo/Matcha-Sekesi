import Vue from 'vue'
import './plugins/bootstrap-vue'

import App from './App.vue'
import router from './router'

import VueCookies from 'vue-cookies-reactive'
Vue.use(VueCookies)

import VoerroTagsInput from '@voerro/vue-tagsinput';
Vue.component('tags-input', VoerroTagsInput);

import { BootstrapVueIcons } from 'bootstrap-vue'
Vue.use(BootstrapVueIcons)

import Notifications from 'vue-notification'
Vue.use(Notifications)

import bFormSlider from 'vue-bootstrap-slider';
Vue.use(bFormSlider)


import VueSweetalert2 from 'vue-sweetalert2';
import 'sweetalert2/dist/sweetalert2.min.css';
Vue.use(VueSweetalert2);


import VueGeolocation from 'vue-browser-geolocation';
Vue.use(VueGeolocation);


import { extend } from 'vee-validate';
import { required, email, regex, alpha_num, alpha, numeric } from 'vee-validate/dist/rules';

extend('required', {
  ...required,
  message: 'This field is required'
});

extend('email', {
  ...email,
  message: 'Please enter a valid email'
});

extend('passewordo', {
  ...regex,
  message: '12 characters, a symbol and a number pls.'
});

extend('alpha_num', {
  ...alpha_num,
  message: 'Please use only letters and numbers.'
});

extend('alpha', {
  ...alpha,
  message: 'Please use only letters.'
});

extend('length', {
  validate(value, args) {
    return value.length >= args.length;
  },
  params: ['length'],
  message: 'At least 5 characters.'
});

extend('rating05', {
  validate(value) {
    return value[0] >= 0 && value[1] <= 5;
  },
});

extend('zipcodeNum', {
  ...numeric,
  message: 'Please enter a valid zipcode.'
});

extend('zipcode', {
  validate(value) {
    return value.length == 5;
  },
  params: ['length'],
  message: 'Please enter a valid zipcode.'
});

Vue.config.productionTip = false

new Vue({
  router,
  render: h => h(App)
}).$mount('#app')
