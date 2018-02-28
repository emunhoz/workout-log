// The Vue build version to load with the `import` command
// (runtime-only or standalone) has been set in webpack.base.conf with an alias.
import Vue from 'vue'
import VeeValidate from 'vee-validate'
import App from './App'
import VueUp from 'vueup'
import Simplert from 'vue2-simplert-plugin'
import moment from 'moment'
import './assets/stylesheets/app.scss'

Vue.use(VeeValidate)
Vue.use(VueUp)
Vue.use(Simplert)
Vue.prototype.moment = moment

Vue.config.productionTip = false

/* eslint-disable no-new */
new Vue({
  el: '#app',
  components: { App },
  template: '<App/>'
})
