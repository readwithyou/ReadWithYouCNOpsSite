// The Vue build version to load with the `import` command
// (runtime-only or standalone) has been set in webpack.base.conf with an alias.
import Vue from 'vue'
import VueI18n from 'vue-i18n'
import VueMoment from 'vue-moment'
import moment from 'moment-timezone'
import VueFilter from 'vue-filter';
import VueRouter from 'vue-router'
import VueResource from 'vue-resource'
import ElementUI from 'element-ui'
import 'element-ui/lib/theme-chalk/index.css'
import DataTables from 'vue-data-tables'
import App from './App.vue'

// router setup
import routes from './routes/routes'

// vuex
import store from './store'

// Plugins
import GlobalComponents from './globalComponents'
import GlobalDirectives from './globalDirectives'
import Notifications from './components/NotificationPlugin'

// MaterialDashboard plugin
import MaterialDashboard from './material-dashboard'

import Chartist from 'chartist'

// configure router
const router = new VueRouter({
  routes, // short for routes: routes
  linkExactActiveClass: 'nav-item active'
})

Vue.use(VueI18n);
Vue.use(VueMoment, {
  moment,
});
Vue.use(VueFilter)
Vue.use(VueRouter)
Vue.use(VueResource)
Vue.use(ElementUI)
Vue.use(DataTables)
Vue.use(MaterialDashboard)
Vue.use(GlobalComponents)
Vue.use(GlobalDirectives)
Vue.use(Notifications)

//set up auto logout if auth failed in backend
import { AUTH_LOGOUT } from "store/actions/auth";
Vue.http.interceptors.push(function (request, next) {
  // continue to next interceptor
  next(function (response) {
    if (response.status == 401 || response.status == 403) {
      store.dispatch(AUTH_LOGOUT).then(() => this.$router.push("/login"));
    }
  });
});

// global library setup
Object.defineProperty(Vue.prototype, '$Chartist', {
  get() {
    return this.$root.Chartist
  }
})

//set i18n
const i18n = new VueI18n({
  locale: localStorage.getItem('rwy-locale') || 'CN',
  messages: {
    'CN': require('./assets/lang/cn'),
    'EN': require('./assets/lang/en')
  },
})

/* eslint-disable no-new */
new Vue({
  el: '#app',
  render: h => h(App),
  i18n,
  router,
  store,
  data: {
    Chartist: Chartist
  }
})
