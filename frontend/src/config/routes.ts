import { lazy } from 'react';

const routes = [
  {
    path: '/',
    exact: true,
    component: lazy(() => import('../pages/Home')),
    name: 'Home',
  },
  {
    path: '/metrics',
    component: lazy(() => import('../pages/Metrics')),
    name: 'Metrics',
  },
  {
    path: '/error-page',
    component: lazy(() => import('../pages/ErrorPage')),
    name: 'ErrorPage',
  },
  {
    path: '*',
    component: lazy(() => import('../pages/Home')),
    name: 'Home',
  },
];

export default routes;
