import Vue from 'vue';
import Vuex from 'vuex';
import VueRouter from 'vue-router';
import App from './App';
import ElementUi from 'element-ui';
import iView from 'iview';

import i18n from '@/locale'

import 'element-ui/lib/theme-chalk/index.css';
import 'iview/dist/styles/iview.css';

import './styles/default.less';

// import utils from './utils';
import { AppComponents } from './app-register';
import { PageComponents } from './page-register';
import { UserComponent } from './user-register';
import store from './store';
import router from './router';

Vue.config.errorHandler = function (err, vm, info) {
  console.log(err);
}
Vue.config.productionTip = false;

Vue.use(Vuex);
Vue.use(VueRouter);;
Vue.use(ElementUi, {
  i18n: (key: any, value: any) => i18n.t(key, value)
});
Vue.use(iView, {
  i18n: (key: any, value: any) => i18n.t(key, value)
});

// Vue.use(utils);
Vue.use(AppComponents);
Vue.use(PageComponents);
Vue.use(UserComponent);

router.beforeEach((to: any, from: any, next: any) => {
  //router.app.$store.commit('removeAllPage');
  router.app.$store.commit('removeOtherPage');
  if (to.meta && !to.meta.ignoreAddPage) {
    router.app.$store.commit('addPage', to);
  }
  next();
});

new Vue({
  i18n,
  store,
  router,
  render: (h: any) => h(App),
}).$mount('#app');
