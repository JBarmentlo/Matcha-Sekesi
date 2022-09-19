import Vue            from 'vue'
import VueRouter      from 'vue-router'
import HomeView       from '../views/HomeView.vue'
import SignIn         from '../components/SignIn'
import ForgotPassword from '../components/ForgotPassword'
import VerifyMail     from '../components/VerifyMail.vue'
import ResetPassword  from '../components/ResetPassword.vue'
import ProfileEdit    from '../components/ProfileEdit.vue'
import SearchUsers    from '../components/SearchUsers.vue'

Vue.use(VueRouter)

const routes = [
  {
    path: '/',
    name: 'home',
    component: HomeView
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
    component: ProfileEdit
  },
  {
    path: '/getallusers',
    name: 'See Users',
    component: SearchUsers
  }
]

const router = new VueRouter({
  routes
})

export default router
