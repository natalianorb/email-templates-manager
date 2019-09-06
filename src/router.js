import VueRouter from 'vue-router';
import Vue from 'vue';
import Categories from './pages/Categories.vue';
import Messages from './pages/Messages.vue';

Vue.use(VueRouter);

export default new VueRouter({
  routes: [
    { path: '/categories', name: 'categories', component: Categories },
    { path: '/messages', name: 'messages', component: Messages },
  ],
});
