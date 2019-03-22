// The Vue build version to load with the `import` command
// (runtime-only or standalone) has been set in webpack.base.conf with an alias.
import Vue from 'vue'
import App from './App'
import router from './router/routes'
import axios from 'axios'
import 'bootstrap-css-only/css/bootstrap.min.css'
import 'mdbvue/build/css/mdb.css'
import {store} from './store'
import 'font-awesome/css/font-awesome.min.css'
import VueSweetalert2 from 'vue-sweetalert2'
import ToggleButton from 'vue-js-toggle-button'
import VueTables from 'vue-tables-2'
import jQuery from 'jquery'

window.jQuery = jQuery
window.$ = jQuery
window.axios = axios.create({
  baseURL: process.env.URL,
  timeout: 1000
})
window.$ = require('jquery')
Vue.use(VueSweetalert2)
Vue.use(ToggleButton)
Vue.use(VueTables.ClientTable)
Vue.config.productionTip = false

require('bootstrap')
require('bootstrap-toggle')
/* eslint-disable no-new */
new Vue({
  el: '#app',
  router,
  components: { App },
  template: '<App/>',
  store: store
})
