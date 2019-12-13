// The Vue build version to load with the `import` command
// (runtime-only or standalone) has been set in webpack.base.conf with an alias.
import Vue from 'vue'
import App from './App'
import router from './router'
import ElementUI from 'element-ui'
import 'element-ui/lib/theme-chalk/index.css'
import './assets/css/common.css'
import moment from 'moment'
import echarts from 'echarts'
import axios from 'axios'
import qs from 'qs'
import config from './assets/js/config'
import functions from './assets/js/functions'
import global from './assets/js/global'

axios.defaults.timeout = 3000

Vue.config.productionTip = false
Vue.config.productionTip = false
// Vue.config.devtools = false
Vue.prototype.axios = axios
Vue.prototype.$moment = moment
Vue.prototype.$echarts = echarts
Vue.prototype.GLOBAL = global
Vue.prototype.CONFIG = config
Vue.prototype.FUNCTIONS = functions
Vue.prototype.qs = qs
Vue.use(ElementUI)

/* eslint-disable no-new */
new Vue({
  el: '#app',
  router,
  components: {App},
  template: '<App/>'
})
