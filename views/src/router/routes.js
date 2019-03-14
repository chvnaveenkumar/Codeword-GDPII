import Vue from 'vue'
import Router from 'vue-router'
import SignIn from '@/components/User/SignIn'
import Signup from '@/components/User/SignUp'
import InstructorDashboard from '@/components/InstructorDashboard'
import ForgetPassword from '@/components/User/ForgetPassword'
import ChangePassword from '@/components/User/ChangePassword'
import StudentDashboard from '@/components/StudentDashboard'
import CodeWordSet from '@/components/CodeWordSet'
import CodeWord from '@/components/CodeWord'
import CourseStudent from '@/components/CourseStudent'
import Authenticate from '@/services/middleware'
Vue.use(Router)

var router = new Router({
  linkExactActiveClass: 'active',
  routes: [
    {
      path: '/',
      beforeEnter (to, from, next) {
        let logged = localStorage.getItem('status')
        console.log(logged)
        if (logged !== null) {
          if (logged && logged === 'true') {
            console.log('instructordashboard')
            next('/instructordashboard')
          } else {
            console.log('studentdashboard')
            next('/studentdashboard')
          }
        }
        next()
      },
      name: 'SignIn',
      component: SignIn
    },
    {
      path: '/signup',
      name: 'Signup',
      component: Signup
    },
    {
      path: '/instructordashboard',
      name: 'InstructorDashboard',
      component: InstructorDashboard,
      beforeEnter: Authenticate.auth,
      meta: {
        role: 'instructor'
      }
    },
    {
      path: '/forgetpassword',
      name: 'ForgetPassword',
      component: ForgetPassword
    },
    {
      path: '/changepassword',
      name: 'ChangePassword',
      component: ChangePassword
    },
    {
      path: '/coursestudent',
      name: 'CourseStudent',
      beforeEnter: Authenticate.auth,
      component: CourseStudent
    },
    {
      path: '/codewordset',
      name: 'CodeWordSet',
      beforeEnter: Authenticate.auth,
      component: CodeWordSet
    },
    {
      path: '/codeword',
      name: 'CodeWord',
      beforeEnter: Authenticate.auth,
      component: CodeWord
    },
    {
      path: '/studentdashboard',
      name: 'StudentDashboard',
      component: StudentDashboard,
      beforeEnter: Authenticate.auth,
      meta: {
        role: 'student'
      }
    }
  ]
})
export default router
