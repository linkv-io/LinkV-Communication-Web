import Vue from 'vue'
import App from './App.vue'
import router from './router'
import { Message, Loading } from 'element-ui';
import 'element-ui/lib/theme-chalk/index.css';
import store from './store'
import Toast from "./components/toast/index";
import getI18n from "./locales/index"
import axios from 'axios'
import VueAxios from 'vue-axios'
import './utils/setComponent';
import './assets/common.css'
Vue.use(VueAxios, axios)
Vue.config.productionTip = false;
Vue.prototype.$message = Message;
Vue.prototype.$loading = Loading;
Vue.prototype.$toast = Toast;
new Vue({
  router,
  store,
  i18n: getI18n(),
  render: h => h(App)
}).$mount('#app')
