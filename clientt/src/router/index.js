import Vue from 'vue'
import VueRouter from 'vue-router'
Vue.use(VueRouter)
  const routes = [
  {
    path: '/',
    name: 'signup',
    component: () => import('../components/Signup.vue')
  },
  {
    path: '/profile',
    name: 'profile',
    component: () => import('../components/Profile.vue')
  },
  {
    path: '/login',
    name: 'login',
    component: () => import('../components/Login.vue')
  },
  {
    path: '/forgot-password',
    name: 'forgot-password',
    component: () => import('../components/ForgotPassword.vue')
  },
  {
    path: '/verify/:hashId',
    name: 'verify-mail',
    component: () => import('../components/Verify.vue')
  },
  {
    path: '/reset/:hashId',
    name: 'reset-password',
    component: () => import('../components/ResetPassword.vue')
  },
  {
    path: '/search',
    name: 'search-user',
    component: () => import('../components/Search.vue')
  }
]
const router = new VueRouter({
  mode: 'history',
  base: process.env.BASE_URL,
  routes
})
export default router
