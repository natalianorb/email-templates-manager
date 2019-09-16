import Vue from 'vue';
import Vuelidate from 'vuelidate';
import App from './App.vue';
import store from './store';
import router from './router';

Vue.config.productionTip = false;
Vue.use(Vuelidate);

new Vue({
  store,
  router,
  render(h) { return h(App); },
}).$mount('#app');
