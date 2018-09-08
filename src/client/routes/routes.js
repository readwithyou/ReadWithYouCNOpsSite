import Vue from 'vue'
import DashboardLayout from 'pages/Layout/DashboardLayout.vue'
import Login from 'pages/Login/Login.vue'
import Dashboard from 'pages/Layout/Dashboard.vue'
import About from 'pages/Layout/About.vue'
import Registrations from 'pages/Registrations/Registrations.vue'
import CreateRegistration from 'pages/Registrations/CreateRegistration.vue'
import Registration from 'pages/Registrations/Registration.vue'
import Teachers from 'pages/Teachers/Teachers.vue'
import CreateTeacher from 'pages/Teachers/CreateTeacher.vue'
import Teacher from 'pages/Teachers/Teacher.vue'
import Students from 'pages/Students/Students.vue'
import CreateStudent from 'pages/Students/CreateStudent.vue'
import Student from 'pages/Students/Student.vue'
import CreateCoursePlan from 'pages/CoursePlan/CreateCoursePlan.vue'
import MyCourseTable from 'pages/CoursePlan/MyCourseTable.vue'
import Books from 'pages/Books/Books.vue'
import CreateBook from 'pages/Books/CreateBook.vue'
import Book from 'pages/Books/Book.vue'
import BookInbound from 'pages/Books/BookInbound.vue'
import BookOutbound from 'pages/Books/BookOutbound.vue'
import CreateBookList from 'pages/BookList/CreateBookList.vue'
import BookList from 'pages/BookList/BookList.vue'
import Users from 'pages/UserProfile/Users.vue'
import UserProfile from 'pages/UserProfile/UserProfile.vue'
import Tickets from 'pages/tickets/Tickets.vue'
import Ticket from 'pages/tickets/Ticket.vue'
import CreateTicket from 'pages/tickets/CreateTicket.vue'
import Toolbox from 'pages/Toolbox/Toolbox.vue'
import TableList from 'pages/TableList.vue'
import Typography from 'pages/Typography.vue'
import Notifications from 'pages/Notifications.vue'
import { store } from 'store'

const ifNotAuthenticated = (to, from, next) => {
  if (!store.getters.isAuthenticated) {
    next()
    return
  }
  next('/')
}

const ifAuthenticated = (to, from, next) => {
  if (store.getters.isAuthenticated) {
    Vue.http.headers.common['x-access-token'] = store.getters.authToken;
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
        name: 'Login',
        component: Login,
        beforeEnter: ifNotAuthenticated,
      },
      {
        path: 'dashboard',
        name: 'Dashboard',
        component: Dashboard,
        beforeEnter: ifAuthenticated,
      },
      {
        path: 'about',
        name: 'About Site',
        component: About,
        beforeEnter: ifAuthenticated,
      },
      {
        path: 'registrations',
        name: 'Trail Course Registrations',
        component: Registrations,
        beforeEnter: ifAuthenticated,
      },
      {
        path: 'registrations/new',
        name: 'New Trail Course Registration',
        component: CreateRegistration,
        beforeEnter: ifAuthenticated,
      },
      {
        path: 'registrations/:id',
        name: 'Trail Course Registration Detail',
        component: Registration,
        beforeEnter: ifAuthenticated,
      },
      {
        path: 'teachers',
        name: 'Teachers',
        component: Teachers,
        beforeEnter: ifAuthenticated,
      },
      {
        path: 'teachers/new',
        name: 'New Teacher',
        component: CreateTeacher,
        beforeEnter: ifAuthenticated,
      },
      {
        path: 'teachers/:id',
        name: 'Teacher Detail',
        component: Teacher,
        beforeEnter: ifAuthenticated,
      },
      {
        path: 'students',
        name: 'Students',
        component: Students,
        beforeEnter: ifAuthenticated,
      },
      {
        path: 'students/new',
        name: 'New Students',
        component: CreateStudent,
        beforeEnter: ifAuthenticated,
      },
      {
        path: 'students/:id',
        name: 'Students Detail',
        component: Student,
        beforeEnter: ifAuthenticated,
      },
      {
        path: 'students/:id/course-plans/new',
        name: 'New Course Plan',
        component: CreateCoursePlan,
        beforeEnter: ifAuthenticated,
      },
      {
        path: 'my-course-plans',
        name: 'My Course Plan',
        component: MyCourseTable,
        beforeEnter: ifAuthenticated,
      },
      {
        path: 'books',
        name: 'Books',
        component: Books,
        beforeEnter: ifAuthenticated,
      },
      {
        path: 'books/new',
        name: 'New Book',
        component: CreateBook,
        beforeEnter: ifAuthenticated,
      },
      {
        path: 'books/inbound',
        name: 'Book Inbound',
        component: BookInbound,
        beforeEnter: ifAuthenticated,
      },
      {
        path: 'books/outbound',
        name: 'Book Outbound',
        component: BookOutbound,
        beforeEnter: ifAuthenticated,
      },
      {
        path: 'books/:id',
        name: 'Book Detail',
        component: Book,
        beforeEnter: ifAuthenticated,
      },
      {
        path: 'students/:id/booklists/new',
        name: 'New Book List',
        component: CreateBookList,
        beforeEnter: ifAuthenticated,
      },
      {
        path: 'students/:id/booklists/:bookListId',
        name: 'Book List Detail',
        component: BookList,
        beforeEnter: ifAuthenticated,
      },
      {
        path: 'users',
        name: 'User Management',
        component: Users,
        beforeEnter: ifAuthenticated,
      },
      {
        path: 'users/me',
        name: 'My Profile',
        component: UserProfile,
        beforeEnter: ifAuthenticated,
      },
      {
        path: 'tickets',
        name: 'Tickets',
        component: Tickets,
        beforeEnter: ifAuthenticated,
      },
      {
        path: 'tickets/new',
        name: 'New Ticket',
        component: CreateTicket,
        beforeEnter: ifAuthenticated,
      },
      {
        path: 'tickets/:id',
        name: 'Ticket Detail',
        component: Ticket,
        beforeEnter: ifAuthenticated,
      },
      {
        path: 'toolbox',
        name: 'Toolbox',
        component: Toolbox,
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
