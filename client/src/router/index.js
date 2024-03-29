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
  initialized: false,
  state: {
    token            : InitialiseTok(),
    user             : null,
    logged_in        : false,
    dark_mode_on     : false,
    messages         : [],
    notifications    : []
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



  setMessagesAction (newValue) {
    if (this.debug) console.log('setMessagesAction triggered', newValue != null)

    this.state.messages = newValue
  },

  addMessageAction (addedValue) {
    if (this.debug) console.log('Add Message triggered', addedValue != null)
    this.state.messages.push(addedValue)
    this.state.messages = [...this.state.messages]
    // this.state.messages = this.state.messages.slice(-10)
  },

  clearMessagesAction () {
    if (this.debug) console.log('clearMessagesAction triggered')
    this.state.messages = []
  },



  setNotificationsAction (newValue) {
    if (this.debug) console.log('setNotificationsAction triggered', newValue != null)
    this.state.notifications = newValue
  },

  setSeenNotification(id) {
    if (this.debug) console.log('setting seen notif triggered', id)
    let index = this.state.notifications.findIndex(elem => elem.id == id)
    if (index != undefined) {
      this.state.notifications[index].seen = true
      this.state.notifications = [...this.state.notifications]
    }
  },

  deleteNotification(id) {
    if (this.debug) console.log('setting seen notif triggered', id)
    let index = this.state.notifications.findIndex(elem => elem.id == id)
    if (index != undefined) {
      this.state.notifications.splice(index, 1)
      this.state.notifications = [...this.state.notifications]
    }
  },

  addNotificationAction (addedValue) {
    if (this.debug) console.log('Add Notif triggered', addedValue != null)
    this.state.notifications.push(addedValue)
    this.state.notifications = [...this.state.notifications]
    // this.state.notifications = this.state.notifications.slice(-10)
  },

  clearNotificationsAction () {
    if (this.debug) console.log('clearNotificationsAction triggered')
    this.state.notifications = []
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
    this.clearNotificationsAction()
    this.clearMessagesAction()
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
  if (store.initialized == false) {
    await updateUserStore()
    store.initialized = true
  }
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

