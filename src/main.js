import Vue from 'vue'
import App from './App.vue'
import router from './router'
import store from './store'
import 'lib-flexible/flexible'
import { Checkbox,Field,Loading, Button ,ImagePreview,CheckboxGroup, Uploader, Notify, Dialog,List } from 'vant';
Vue.config.productionTip = false
Vue.use(Field);
Vue.use(Dialog);

import VueClipboard from 'vue-clipboard2'
Vue.use(VueClipboard)
Vue.use(Button);
Vue.use(Checkbox);
Vue.use(CheckboxGroup);
Vue.use(Uploader);
Vue.use(List);
Vue.use(Loading);


Vue.prototype.$ImagePreview = ImagePreview
Vue.prototype.$Dialog = Dialog
Vue.prototype.$Notify = Notify
Vue.config.ignoredElements = ['wx-open-launch-weapp']


new Vue({
  router,
  store,
  render: h => h(App)
}).$mount('#app')
