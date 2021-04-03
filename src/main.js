import Vue from 'vue'
import App from './App.vue'
import router from './router'
import './plugins/element.js'
import './assets/css/global.css'
import axios from 'axios'

// 配置请求的根路径
// fixme  接口地址
// axios.defaults.baseURL = 'http://3u769548e6.zicp.vip/admin'
axios.interceptors.request.use(config => {
  // 为请求头对象添加 token 验证的 Authorization 字段
  config.headers.Authorization = window.sessionStorage.getItem('token')
  return config
})
Vue.prototype.$http = axios
Vue.config.devtools = true


Vue.config.productionTip = false

new Vue({
  router,
  render: h => h(App)
}).$mount('#app')
