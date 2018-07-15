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
import Students from 'pages/Students/Students.vue'
import CreateStudent from 'pages/Students/CreateStudent.vue'
import Student from 'pages/Students/Student.vue'
import Books from 'pages/Books/Books.vue'
import CreateBook from 'pages/Books/CreateBook.vue'
import Book from 'pages/Books/Book.vue'
import BookInbound from 'pages/Books/BookInbound.vue'
import BookOutbound from 'pages/Books/BookOutbound.vue'
import Users from 'pages/UserProfile/Users.vue'
import UserProfile from 'pages/UserProfile.vue'
import LeaveForm from 'pages/tickets/LeaveForm.vue'
import TableList from 'pages/TableList.vue'
import Typography from 'pages/Typography.vue'
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
        path: 'students',
        name: '学员管理列表页',
        component: Students,
        beforeEnter: ifAuthenticated,
      },
      {
        path: 'students/new',
        name: '新的学员',
        component: CreateStudent,
        beforeEnter: ifAuthenticated,
      },
      {
        path: 'students/:id',
        name: '学员管理详情页',
        component: Student,
        beforeEnter: ifAuthenticated,
      },
      {
        path: 'books',
        name: '图书管理列表页',
        component: Books,
        beforeEnter: ifAuthenticated,
      },
      {
        path: 'books/new',
        name: '新的图书',
        component: CreateBook,
        beforeEnter: ifAuthenticated,
      },
      {
        path: 'books/inbound',
        name: '图书入库',
        component: BookInbound,
        beforeEnter: ifAuthenticated,
      },
      {
        path: 'books/outbound',
        name: '图书出库',
        component: BookOutbound,
        beforeEnter: ifAuthenticated,
      },
      {
        path: 'books/:id',
        name: '图书管理详情页',
        component: Book,
        beforeEnter: ifAuthenticated,
      },
      {
        path: 'users',
        name: '用户管理',
        component: Users,
        beforeEnter: ifAuthenticated,
      },
      {
        path: 'user',
        name: '个人资料',
        component: UserProfile,
        beforeEnter: ifAuthenticated,
      },
      {
        path: 'tickets',
        name: '问题报告',
        component: LeaveForm,
        beforeEnter: ifAuthenticated,
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
