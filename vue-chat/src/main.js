import Vue from 'vue'
import MuseUI from 'muse-ui';
import 'muse-ui/dist/muse-ui.css';
import App from './App.vue'
import router from './router'
import store from './store'
import axios from 'axios'

import Toast from 'muse-ui-toast';

import VueMaterial from 'vue-material'
import 'vue-material/dist/vue-material.min.css'

import ElementUI from 'element-ui'
import 'element-ui/lib/theme-chalk/index.css'

Vue.use(MuseUI)
Vue.use(VueMaterial)
Vue.use(ElementUI)
Vue.use(Toast, {position: 'top', time: 10000})

Vue.config.productionTip = false
Vue.prototype.$ajax = axios

new Vue({
    router,
    store,
    render: h => h(App)
}).$mount('#app')