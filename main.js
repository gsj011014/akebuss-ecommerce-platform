import Vue from 'vue'
import App from './App'
import http from './utils/https.js'
import status from './components/status.vue'
import popup from './components/uni-popup/uni-popup' //导入弹出层组件
import preview_image from 'components/hx-preview-img/hx-preview-img' //导入预览图片组件

Vue.config.productionTip = false
Vue.prototype.$request = http //已经挂载到Vue实例上面了

//全局注册组件
Vue.component('page-status',status)
Vue.component('PopUp',popup)
Vue.component('PreviewImage',preview_image)

App.mpType = 'app'

const app = new Vue({
    ...App
})
app.$mount()
