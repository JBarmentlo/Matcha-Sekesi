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
    component: SignIn,
    props: route => ({ oauth_token: route.query.oauth_token })
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


function InitialiseTok() {
  console.log("Initialising store eTok")
  let tok
  try {
    tok = JSON.parse(sessionStorage.sekes_tokens)
  }
  catch {
    tok = null
  }
  return tok
}


export var store = {
  debug: true,
  state: {
    token            : InitialiseTok(),
    user             : null,
    logged_in        : false,
  },


  setTokenAction (newValue) {
    if (this.debug) console.log('setTokenAction triggered', newValue)
    
    if (newValue == null) {
      return this.clearTokenAction()
    }

    try {
      this.state.token = newValue
      sessionStorage.setItem('sekes_tokens', JSON.stringify(newValue))
    }
    catch (e) {
      console.log("SET TOKEN ERR", e)
      this.clearTokenAction()
    }
  },

  clearTokenAction () {
    if (this.debug) console.log('clearTokenAction triggered')
    this.state.token = null

    sessionStorage.removeItem('sekes_tokens')
  },

  
  setUserAction (newValue) {
    if (this.debug) console.log('setUserAction triggered', newValue != null)

    if (newValue == null) {
      return this.clearUserAction()
    }

    try {
      this.state.user = newValue
      sessionStorage.setItem('user', JSON.stringify(newValue))
    }
    catch (e) {
      this.clearUserAction()
      console.log("SET USER ERR", e)
    }
  },

  clearUserAction () {
    if (this.debug) console.log('clearUserAction triggered')
    this.state.user = null
    sessionStorage.removeItem('user')
  },

  setLoggedInAction(newValue) {
    if (this.debug) console.log('setLoggedInAction triggered')
    this.state.logged_in = newValue
  },

  getMailVerified() {
    if (this.state.user == null) {
      return false
    }
    return this.state.user.mail_verified
  },

  getProfileComplete() {
    if (this.state.user == null) {
      return false
    }
    return this.state.user.is_complete_profile
  },

  clearStore() {
    this.clearTokenAction()
    this.clearUserAction()
    this.setLoggedInAction(false)
  },
}

export const updateUserStore = async () => {
  if (store.state.token == null) {
    console.log("No token to update store")
    return store.clearStore()
  }

  try {
    console.log('Updating user store')
    let user_res = await getMyUser(store.state.token)
    if (user_res.status == 200 && user_res.data.code == 'SUCCESS') {
      console.log("Setting creds")
      store.setUserAction({...user_res.data.data})
      store.setLoggedInAction(true)
      console.log("Update store Logged in")
      return
    }
    else {
      console.log("CODE: ", user_res.status)
      return store.clearStore()
    }
  }
  catch (e) {
    console.log("ERROR IN UPDASTE STORE", e)
    return store.clearStore()
  }
}
// updateUserStore()

router.beforeResolve(async (to, from, next) => {
  console.log("Navigation Guard from ", from.fullPath, "to ", to.fullPath)
  // await updateUserStore()
  console.log("logged_in: ", store.state.logged_in, "user: ", store.state.user != null, "token: ", store.state.token != null)
  if (to.matched.some(record => record.meta.requiresAuth)) {
    console.log("Requires auth")
    if (store.state.logged_in) {
      console.log("gut")
      next()
    }
    else {
      console.log("bat")
      return next('/signin')
    }
  }

  else if (to.matched.some(record => record.meta.requiresNotAuth)) {
    console.log("Requires no auth")
    if (!store.state.logged_in) {
      console.log("gut")
      return next()
    }
    else {
      console.log("bat")
      return next('/editprofile')
    }
  }
  else {
    console.log("EZ")
    return next()
  }
})

