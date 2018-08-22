// The Vue build version to load with the `import` command
// (runtime-only or standalone) has been set in webpack.base.conf with an alias.
import Vue from 'vue'
import VueResource from 'vue-resource'
import Preview from './Preview.vue'

Vue.use(VueResource);
Vue.http.headers.common['x-access-token'] = localStorage.getItem('user-token') || '';

/* eslint-disable no-new */
new Vue({
    el: '#app',
    render: h => h(Preview),
})
