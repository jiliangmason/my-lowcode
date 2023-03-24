import { createRouter, createWebHistory, type RouteRecordRaw } from 'vue-router';

const routes: RouteRecordRaw[] = [
  {
    path: '/',
    name: 'home',
  },
];

const router = createRouter({
  history: createWebHistory('/'),
  routes,
});

export default router;
