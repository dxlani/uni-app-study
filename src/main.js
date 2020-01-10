import Vue from 'vue'
import App from './App'
import store from './store'
import VueI18n from 'vue-i18n'  
import messages from './language'
Vue.use(VueI18n) 
const i18n = new VueI18n({  
  locale: 'zh',  // 默认选择的语言
  messages
})  
//挂载store
Vue.prototype.$store = store;
//挂载多语言
Vue.prototype._i18n = i18n ; 
Vue.config.productionTip = false

App.mpType = 'app'

const app = new Vue({
  ...App,
	i18n
})
app.$mount()

