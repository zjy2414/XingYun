import Vue from 'vue'
import Antd from 'ant-design-vue';
import 'ant-design-vue/dist/antd.css';
import App from './App.vue'
import DefaultLayout from './layouts/Default.vue'
import DashboardLayout from './layouts/Dashboard.vue'

import router from './router'
import axios from "axios" //引入

import './scss/app.scss';

import global_Flag from './global.js' //注意文件路径，实际路径以项目目录结构为准
Vue.prototype.$global_flag = global_Flag;

//引入全局状态
import store from "./store"

Vue.use(Antd);

Vue.config.productionTip = false

//映射全局Vuex状态
Vue.prototype.$store = store

// Adding template layouts to the vue components.
Vue.component("layout-default", DefaultLayout);
Vue.component("layout-dashboard", DashboardLayout);

//设置axios为form-data
axios.defaults.headers.post['Content-Type'] = 'application/x-www-form-urlencoded';
axios.defaults.headers.get['Content-Type'] = 'application/x-www-form-urlencoded';
axios.defaults.transformRequest = [function (data) {
  let ret = ''
  for (let it in data) {
    ret += encodeURIComponent(it) + '=' + encodeURIComponent(data[it]) + '&'
  }
  return ret
}]

new Vue({
  router,
  render: h => h(App)
}).$mount('#app')