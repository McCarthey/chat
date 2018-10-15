import Vue from 'vue'
import MuseUI from 'muse-ui';
import 'muse-ui/dist/muse-ui.css';
import App from './App.vue'
import router from './router'
import store from './store'

import { theme } from 'muse-ui'
import Toast from 'muse-ui-toast';

Vue.use(MuseUI)
Vue.use(Toast)
Vue.config.productionTip = false

new Vue({
    router,
    store,
    render: h => h(App)
}).$mount('#app')