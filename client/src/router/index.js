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

function InitialiseUser() {
  console.log("Initialising store User")
  let user
  try {
    user = JSON.parse(sessionStorage.user)
  }
  catch {
    user = null
  }
  return user
}

function InitialiseLoggedIn() {
  return InitialiseUser() != null
}

export var store = {
  debug: true,
  state: {
    token    : InitialiseTok(),
    user     : InitialiseUser(),
    logged_in: InitialiseLoggedIn(),
    counter  : 0
  },

  setLoggedInAction (newValue) {
    if (this.debug) console.log('setLoggedInAction triggered with', newValue)
    this.state.logged_in = newValue
  },

  setTokenAction (newValue) {
    if (this.debug) console.log('setTokenAction triggered', newValue != null)
    if (this.state.token != null && newValue == null) console.log("DESTRAUES TOKE")
    this.state.token = newValue
    try {
      sessionStorage.setItem('sekes_tokens', JSON.stringify(newValue))
    }
    catch (e) {
      console.log("SET TOKEN ERR", e)
    }
  },

  clearTokenAction () {
    if (this.debug) console.log('clearTokenAction triggered')
    if (this.state.token != null) console.log("DESTRAUES TOKE")

    this.state.token = null
    sessionStorage.removeItem('user')
  },

  
  setUserAction (newValue) {
    if (this.debug) console.log('setUserAction triggered', newValue != null)
    if (this.state.user != null && newValue == null) console.log("DESTRAUES user")
    this.state.user = newValue
    try {
      sessionStorage.setItem('user', JSON.stringify(newValue))
    }
    catch (e) {
      console.log("SET USER ERR", e)
    }
  },

  clearUserAction () {
    if (this.debug) console.log('clearUserAction triggered')
    if (this.state.user != null) console.log("DESTRAUES user")
    this.state.user = null
    sessionStorage.removeItem('user')
  },

  increaseCounterAction () {
    if (this.debug) console.log('Counter triggered')
    this.state.counter += 1
  }
}

export const updateUserStore = async () => {
  if (store.state.token != null) {
    console.log('Updating user store')
    try {
      let user_res = await getMyUser(store.state.token)
      if (user_res.status == 200 && user_res.data.code == 'SUCCESS') {
        console.log("Setting creds")
        store.setUserAction({...user_res.data.data})
        store.setLoggedInAction(true)
        console.log("Update store Logged in")
        return user_res
      }
      else {
        console.log("CODE: ", user_res.status)
      }
    }
    catch (e) {
      console.log("ERROR IN UPDASTE STORE", e)
    }
  }
  console.log("Update store Not Logged in")
  return "falsetto "
}
updateUserStore()

router.beforeEach((to, from, next) => {
  console.log("Navigation Guard from ", from.fullPath, "to ", to.fullPath)
  console.log("store token null: ", store.state.token == null)
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

