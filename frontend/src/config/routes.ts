import { lazy } from 'react'

export const routes = [
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
    path: '/Metrics',
    component: lazy(() => import('../pages/Metrics')),
    name: 'Metrics',
  },
  {
    path: '*',
    component: lazy(() => import('../pages/Home')),
    name: 'Home',
  },
]
