import VueRouter from 'vue-router';
import Vue from 'vue';
import Categories from '@/pages/Categories.vue';
import CategoryPage from '@/pages/CategoryPage.vue';
import Messages from '@/pages/Messages.vue';

Vue.use(VueRouter);

export default new VueRouter({
  routes: [
    { path: '/', name: 'home', component: Categories },
    { path: '/categories', name: 'categories', component: Categories },
    { path: '/categories/:id', name: 'category', component: CategoryPage },
    { path: '/messages', name: 'messages', component: Messages },
  ],
});
