import Vue            from 'vue'
import VueRouter      from 'vue-router'
import SignIn         from '../components/SignIn'
import ForgotPassword from '../components/ForgotPassword'
import VerifyMail     from '../components/VerifyMail.vue'
import ResetPassword  from '../components/ResetPassword.vue'
import ProfileEdit    from '../components/ProfileEdit.vue'
import SearchUsers    from '../components/SearchUsers.vue'
import PopulateDb     from '../components/PopulateDb.vue'
import ChatEx         from '../components/ChatEx.vue'
import SignUp         from '../components/SignUp.vue'
import {getMyUser}    from '../services/user'

Vue.use(VueRouter)

const routes = [
  {
    path: '/',
    name: 'home',
    meta: {requiresNotAuth: true},
    component: SignIn
  },
  {
    path: '/signup',
    name: 'Sign Up',
    meta: {requiresNotAuth: true},
    component: SignUp
  },
  {
    path: '/signin',
    name: 'Sign In',
    meta: {requiresNotAuth: true},
    component: SignIn
  },
  {
    path: '/forgotpassword/:email?',
    name: 'Forgot Password',
    component: ForgotPassword,
    props: true,
  },
  {
    path: '/verify/:hash',
    name: 'Verify Mail',
    component: VerifyMail
  },
  {
    path: '/reset/:hash',
    name: 'Reset Password',
    component: ResetPassword
  },
  {
    path: '/editprofile',
    name: 'Edit Profile',
    meta: {requiresAuth: true},
    component: ProfileEdit
  },
  {
    path: '/getallusers',
    name: 'See Users',
    meta: {requiresAuth: true},
    component: SearchUsers
  },
  {
    path: '/populate',
    name: 'Populate for testing',
    meta: {requiresAuth: true},
    component: PopulateDb
  },
  {
    path: '/cat',
    name: 'pussy',
    meta: {requiresAuth: true},
    component: ChatEx
  },
  {
    path: '/profile/:userName',
    name: 'profile',
    props: true,
    meta: {requiresAuth: true},
    component: () => import('../components/OtherProfile.vue')
  },
]

export const router = new VueRouter({
  mode: 'history',
  routes
})

export var store = {
  debug: true,
  state: {
    token    : null,
    user     : null,
    logged_in: false,
    counter  : 0
  },
  setLoggedInAction (newValue) {
    if (this.debug) console.log('setLoggedInAction triggered with', newValue)
    this.state.logged_in = newValue
  },
  setTokenAction (newValue) {
    if (this.debug) console.log('setTokenAction triggered')
    this.state.token = newValue
  },
  clearTokenAction () {
    if (this.debug) console.log('clearTokenAction triggered')
    this.state.token = ''
  },
  setUserAction (newValue) {
    if (this.debug) console.log('setUserAction triggered')
    this.state.user = newValue
  },
  clearUserAction () {
    if (this.debug) console.log('clearUserAction triggered')
    this.state.user = ''
  },
  increaseCounterAction () {
    if (this.debug) console.log('Counter triggered')
    this.state.counter += 1
  }
}

export const updateUserStore = async () => {
  if (store.token != null) {
    try {
      let user_res = await getMyUser(store.token)
      if (user_res.code == 200 && user_res.data.code == 'SUCCESS') {
        store.setUserAction({...user_res.data.data})
        store.setLoggedInAction(true)
        console.log("Logged in")
        return true
      }
    }
    catch (e) {
      console.log("ERROR IN UPDASTE STORE", e)
    }
  }
  store.clearUserAction(null)
  store.setLoggedInAction(false)
  return false
}

router.beforeEach((to, from, next) => {
  updateUserStore().then(() => {
    if (to.matched.some(record => record.meta.requiresAuth)) {
      if (store.state.logged_in) {
        next()
      }
      else {
        next('/signin')
      }
    }
  
    else if (to.matched.some(record => record.meta.requiresNotAuth)) {
      if (!store.state.logged_in) {
        next()
      }
      else {
        next('/editprofile')
      }
    }

    else {
      next()
      return
    }
  })
})

