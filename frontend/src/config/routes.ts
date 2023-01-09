import { lazy } from 'react';

const routes = [
  {
    path: '/',
    exact: true,
    component: lazy(() => import('../views/Home')),
    name: 'Home',
  },
  {
    path: '/home',
    component: lazy(() => import('../views/Home')),
    name: 'Home',
  },
  {
    path: '/about',
    component: lazy(() => import('../views/About')),
    name: 'About',
  },
];
export default routes;
