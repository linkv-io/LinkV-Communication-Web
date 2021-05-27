import Vue from 'vue'
import App from './App.vue'
import router from './router'
import { Message } from 'element-ui';
import 'element-ui/lib/theme-chalk/index.css';
import store from './store'
import './util/setComponent';
import './assets/common.css'
Vue.config.productionTip = false
Vue.prototype.$message = Message

new Vue({
  router,
  store,
  render: h => h(App)
}).$mount('#app')
