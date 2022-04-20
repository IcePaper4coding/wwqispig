import Vue from 'vue'
import App from './App.vue'

import base from 'npmpaas_base'
Vue.use(base);

new Vue({
    render: h => h(App)
}).$mount('#app');