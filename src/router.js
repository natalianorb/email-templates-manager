import VueRouter from 'vue-router';
import Vue from 'vue';
import Categories from '@/pages/Categories.vue';
import CategoryEdit from '@/pages/CategoryEdit.vue';
import Messages from '@/pages/Messages.vue';

Vue.use(VueRouter);

export default new VueRouter({
  routes: [
    { path: '/', name: 'home', component: Categories },
    { path: '/categories', name: 'categories', component: Categories },
    {
      path: '/categoryMessages/:id', name: 'categoryMessages', component: Messages, props: true,
    },
    {
      path: '/categoryEdit/:id', name: 'categoryEdit', component: CategoryEdit, props: true,
    },
    { path: '/messages', name: 'messages', component: Messages },
  ],
});
