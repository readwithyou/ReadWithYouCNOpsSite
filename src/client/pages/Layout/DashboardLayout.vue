<template>
  <div class="wrapper">
    <notifications></notifications>

    <side-bar>
      <mobile-menu slot="content"></mobile-menu>
      <sidebar-link to="/dashboard">
        <md-icon>dashboard</md-icon>
        <p>{{ $t("message.home_page") }}</p>
      </sidebar-link>
      <sidebar-link to="/registrations" v-if="$can('read', 'registration')">
        <md-icon>ballot</md-icon>
        <p>{{ $t("message.registrations") }}</p>
      </sidebar-link>
      <sidebar-link to="/teachers" v-if="$can('read', 'teacher')">
        <md-icon>supervisor_account</md-icon>
        <p>{{ $t("message.tearchers") }}</p>
      </sidebar-link>
      <sidebar-link to="/students" v-if="$can('read', 'studentList')">
        <md-icon>person_outline</md-icon>
        <p>{{ $t("message.students") }}</p>
      </sidebar-link>
      <sidebar-link to="/my-course-plans" v-if="$can('read', 'myCoursePlan')">
        <md-icon>calendar_today</md-icon>
        <p>{{ $t("message.my_course_plans") }}</p>
      </sidebar-link>
      <sidebar-link to="/books" v-if="$can('read', 'book')">
        <md-icon>collections_bookmark</md-icon>
        <p>{{ $t("message.books") }}</p>
      </sidebar-link>
      <sidebar-link to="/users" v-if="$can('read', 'user')">
        <md-icon>person</md-icon>
        <p>{{ $t("message.users") }}</p>
      </sidebar-link>
      <sidebar-link to="/tickets" v-if="$can('read', 'ticket')">
        <md-icon>receipt</md-icon>
        <p>{{ $t("message.tickets") }}</p>
      </sidebar-link>
      <sidebar-link to="/toolbox" v-if="$can('use', 'toolbox')">
        <md-icon>build</md-icon>
        <p>{{ $t("message.toolbox") }}</p>
      </sidebar-link>
      <sidebar-link to="/users/me" v-if="$can('read', 'profile')">
        <md-icon>assignment_ind</md-icon>
        <p>{{ $t("message.my_profile") }}</p>
      </sidebar-link>
      <sidebar-link to="/about" v-if="$can('read', 'about')">
        <md-icon>info</md-icon>
        <p>{{ $t("message.about_site") }}</p>
      </sidebar-link>
      <!--sidebar-link to="/table">
        <md-icon>content_paste</md-icon>
        <p>Table list</p>
      </sidebar-link>
      <sidebar-link to="/typography">
        <md-icon>library_books</md-icon>
        <p>Typography</p>
      </sidebar-link>
      <sidebar-link to="/notifications">
        <md-icon>notifications</md-icon>
        <p>Notifications</p>
      </sidebar-link-->
    </side-bar>

    <div class="main-panel">
      <top-navbar></top-navbar>

      <dashboard-content>

      </dashboard-content>

      <content-footer v-if="!$route.meta.hideFooter"></content-footer>
    </div>
  </div>
</template>
<style lang="scss">

</style>
<script>
import TopNavbar from './TopNavbar.vue'
import ContentFooter from './ContentFooter.vue'
import DashboardContent from './Content.vue'
import MobileMenu from 'pages/Layout/MobileMenu.vue'

export default {
  components: {
    TopNavbar,
    DashboardContent,
    ContentFooter,
    MobileMenu
  }
}
</script>
