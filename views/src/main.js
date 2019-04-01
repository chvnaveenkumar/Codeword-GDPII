// The Vue build version to load with the `import` command
// (runtime-only or standalone) has been set in webpack.base.conf with an alias.
import Vue from 'vue'
import App from './App'
import router from './router/routes'
import axios from 'axios'
import 'bootstrap/dist/css/bootstrap.css'
import 'bootstrap-vue/dist/bootstrap-vue.css'
import 'mdbvue/build/css/mdb.css'
import {store} from './store'
import VueSweetalert2 from 'vue-sweetalert2'
import VueTables from 'vue-tables-2'
import jQuery from 'jquery'
import BootstrapVue from 'bootstrap-vue'
Vue.use(BootstrapVue)
window.jQuery = jQuery
window.$ = jQuery
window.axios = axios.create({
  baseURL: process.env.URL,
  timeout: 1000
})
window.$ = require('jquery')
Vue.use(VueSweetalert2)
Vue.use(VueTables.ClientTable)
Vue.config.productionTip = false

require('bootstrap')
/* eslint-disable no-new */
new Vue({
  el: '#app',
  router,
  components: { App },
  template: '<App/>',
  store: store
})
