import Vue from 'vue'
import DashboardLayout from 'pages/Layout/DashboardLayout.vue'
import Login from 'pages/Login/Login.vue'
import Dashboard from 'pages/Dashboard.vue'
import Registrations from 'pages/Registrations/Registrations.vue'
import CreateRegistration from 'pages/Registrations/CreateRegistration.vue'
import Registration from 'pages/Registrations/Registration.vue'
import Teachers from 'pages/Teachers/Teachers.vue'
import CreateTeacher from 'pages/Teachers/CreateTeacher.vue'
import Teacher from 'pages/Teachers/Teacher.vue'
import UserProfile from 'pages/UserProfile.vue'
import TableList from 'pages/TableList.vue'
import Typography from 'pages/Typography.vue'
import Icons from 'pages/Icons.vue'
import Maps from 'pages/Maps.vue'
import Notifications from 'pages/Notifications.vue'
import Store from 'store'

const ifNotAuthenticated = (to, from, next) => {
  if (!Store.getters.isAuthenticated) {
    next()
    return
  }
  next('/')
}

const ifAuthenticated = (to, from, next) => {
  if (Store.getters.isAuthenticated) {
    Vue.http.headers.common['x-access-token'] = Store.getters.authToken;
    next()
    return
  }
  next('/login')
}

const routes = [
  {
    path: '/',
    component: DashboardLayout,
    redirect: '/dashboard',
    children: [
      {
        path: '/login',
        name: '登录',
        component: Login,
        beforeEnter: ifNotAuthenticated,
      },
      {
        path: 'dashboard',
        name: '主页',
        component: Dashboard,
        beforeEnter: ifAuthenticated,
      },
      {
        path: 'registrations',
        name: '试课报名列表页',
        component: Registrations,
        beforeEnter: ifAuthenticated,
      },
      {
        path: 'registrations/new',
        name: '新的试课报名',
        component: CreateRegistration,
        beforeEnter: ifAuthenticated,
      },
      {
        path: 'registrations/:id',
        name: '试课报名详情页',
        component: Registration,
        beforeEnter: ifAuthenticated,
      },
      {
        path: 'teachers',
        name: '老师管理列表页',
        component: Teachers,
        beforeEnter: ifAuthenticated,
      },
      {
        path: 'teachers/new',
        name: '新的老师',
        component: CreateTeacher,
        beforeEnter: ifAuthenticated,
      },
      {
        path: 'teachers/:id',
        name: '老师管理详情页',
        component: Teacher,
        beforeEnter: ifAuthenticated,
      },
      {
        path: 'user',
        name: 'User Profile',
        component: UserProfile
      },
      {
        path: 'table',
        name: 'Table List',
        component: TableList
      },
      {
        path: 'typography',
        name: 'Typography',
        component: Typography
      },
      {
        path: 'notifications',
        name: 'Notifications',
        component: Notifications
      }
    ]
  }
]

export default routes
