import Vue from 'vue';
import VueRouter from 'vue-router';
import Handbook from '@/views/Handbook.vue';

Vue.use(VueRouter);

const routes = [
  { path: '', redirect: '/handbook/' },
  {
    path: '/handbook/:chapter?/:paragraph?',
    name: 'home',
    component: Handbook,
  },
];

const router = new VueRouter({
  mode: 'history',
  base: process.env.BASE_URL,
  routes,
});

export default router;
