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
    // route level code-splitting
    // this generates a separate chunk (about.[hash].js) for this route
    // which is lazy-loaded when the route is visited.
    component: () => import(/* webpackChunkName: "signup" */ '../components/SignUp.vue')
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
      next()
      return
    }
    console.log("GO SINGING")
    next('/signin')
  } else {
    next()
  }
})

export default router
