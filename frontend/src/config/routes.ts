import { lazy } from 'react';

const routes = [
  {
    path: '/',
    exact: true,
    component: lazy(() => import('../pages/Home')),
    name: 'Home',
  },
  {
    path: '/home',
    component: lazy(() => import('../pages/Home')),
    name: 'Home',
  },
  {
    path: '/about',
    component: lazy(() => import('../pages/About')),
    name: 'About',
  },
  {
    path: '*',
    component: lazy(() => import('../pages/Home')),
    name: 'Home',
  },
];
export default routes;
