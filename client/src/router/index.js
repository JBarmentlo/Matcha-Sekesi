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
    component: SignIn
  },
  {
    path: '/signup',
    name: 'Sign Up',
    component: SignUp
  },
  {
    path: '/signin',
    name: 'Sign In',
    component: SignIn
  },
  {
    path: '/forgotpassword',
    name: 'Forgot Password',
    component: ForgotPassword
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


const router = new VueRouter({
  routes
})

router.beforeEach((to, from, next) => {
  if(to.matched.some(record => record.meta.requiresAuth)) {
    if (Vue.$cookies.isKey('user') && Vue.$cookies.isKey('sekes_tokens')) {
      console.log("checking login")
      getMyUser(Vue.$cookies.get('sekes_tokens'))
      .then( user => {
        console.log("User logged in check:" + user.data.code)
        if (user.data.code == "SUCCESS") {
          console.log("checking login success")
          next()
          return
        }
        else {
          console.log("checking login fail")
          Vue.$cookies.remove('sekes_tokens')
          Vue.$cookies.remove('user')
          next('/signin')
          return

        }
      })
      .catch(e => {
          console.log("checking login failure")
          Vue.$cookies.remove('sekes_tokens')
        Vue.$cookies.remove('user')
        console.log("Trying to access page that requires signin", e)
        next('/signin')
        return
      })
    }
  } else {
    next()
    return
  }
})

export default router
