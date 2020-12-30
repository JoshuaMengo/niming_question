import Vue from 'vue'
import App from './App.vue'
import router from './router'
import store from './store'
import 'lib-flexible/flexible'
import { Checkbox,Field, CheckboxGroup, Uploader, Notify, Dialog,List } from 'vant';
Vue.config.productionTip = false
Vue.use(Field);
Vue.use(Dialog);


Vue.use(Checkbox);
Vue.use(CheckboxGroup);
Vue.use(Uploader);
Vue.use(List);

Vue.prototype.$Dialog = Dialog
Vue.prototype.$Notify = Notify
Vue.config.ignoredElements = ['wx-open-launch-weapp']


new Vue({
  router,
  store,
  render: h => h(App)
}).$mount('#app')
