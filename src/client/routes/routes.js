import DashboardLayout from 'pages/Layout/DashboardLayout.vue'

import Login from 'pages/Login/Login.vue'
import Dashboard from 'pages/Dashboard.vue'
import Registrations from 'pages/Registrations/Registrations.vue'
import CreateRegistration from 'pages/Registrations/CreateRegistration.vue'
import Registration from 'pages/Registrations/Registration.vue'
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
        //beforeEnter: ifNotAuthenticated,
      },
      {
        path: 'dashboard',
        name: 'Home',
        component: Dashboard,
        beforeEnter: ifAuthenticated,
      },
      {
        path: 'registrations',
        name: '试课报名列表页',
        component: Registrations,
      },
      {
        path: 'registrations/new',
        name: '新的试课报名',
        component: CreateRegistration,
      },
      {
        path: 'registrations/:id',
        name: '试课报名详情页',
        component: Registration,
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
