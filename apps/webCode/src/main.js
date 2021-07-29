// The Vue build version to load with the `import` command
// (runtime-only or standalone) has been set in webpack.base.conf with an alias.
import Vue from 'vue'
import App from './App'
import router from './router'
import 'element-ui/lib/theme-chalk/index.css';
import ElementUI from 'element-ui';
import utils from './plugins/utils.js';
import VueDND from 'awe-dnd'

Vue.prototype.$toast=utils;  //其中$xx为新命的名。
Vue.use(ElementUI);
Vue.use(VueDND);

import Bus from './plugins/Bus.js';
Vue.prototype.$Bus=Bus
Vue.config.productionTip = false

import axios from 'axios'
import qs from 'qs'
Vue.prototype.$axios = axios 
Vue.prototype.qs = qs
import https from './plugins/http'
Vue.prototype.$http = https
/* eslint-disable no-new */
new Vue({
  el: '#app',
  router,
  components: { App },
  template: '<App/>'
})
