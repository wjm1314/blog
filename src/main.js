// The Vue build version to load with the `import` command
// (runtime-only or standalone) has been set in webpack.base.conf with an alias.
import Vue from 'vue'
import App from './App'
import store from './store'
import router from './router'
import axios from 'axios'
import './assets/css/index.css'



Vue.config.productionTip = false
Vue.prototype.axios = axios
//Vue.use(VueRouter)

Vue.filter('toDate', (date) => {                    // 2017年5月10日15：35
  if (date) {
    const d = new Date(date)
    const minutes = d.getMinutes() < 10 ? '0' + d.getMinutes() : d.getMinutes()
    const hours = d.getHours() < 10 ? '0' + d.getHours() : d.getHours()
    return d.getFullYear() + '年' + (d.getMonth() + 1) + '月' +
      d.getDate() + '日 ' + hours + ' : ' + minutes
  }
})
Vue.filter('to_date', (date) => {                   // 2017-5-10 at 15：35
  if (date) {
    const d = new Date(date)
    const minutes = d.getMinutes() < 10 ? '0' + d.getMinutes() : d.getMinutes()
    const hours = d.getHours() < 10 ? '0' + d.getHours() : d.getHours()
    return d.getFullYear() + '-' + (d.getMonth() + 1) + '-' +
      d.getDate() + ' ' + hours + ': ' + minutes
  }
})
Vue.filter('toTag', (arr) => {
  if (arr) {
    return arr.join('，')
  }
})

//请求拦截器
axios.interceptors.request.use(function (request) {
  if(window.localStorage.getItem('token')){
    request.headers['authorization'] = 'Bearer ' + window.localStorage.getItem('token');
    //没有request.headers.set()函数
    /*request.headers.set('authorization','Bearer ' + window.localStorage.getItem('token'));*/
  }
  return request;
})
//响应拦截器
axios.interceptors.response.use(function (response) {
  if(response.status === 401) {
    store.commit('unset_user');
    router.push({name: 'login'});
  }
  return response;
})
/* eslint-disable no-new */
new Vue({
  el: '#app',
  router,
  store,
  components: { App },
  template: '<App/>'
})
