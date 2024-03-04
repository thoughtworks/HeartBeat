import { render, waitFor } from '@testing-library/react';
import { MemoryRouter } from 'react-router-dom';
import { METRICS_PAGE_ROUTE } from './fixtures';
import { Provider } from 'react-redux';
import React, { lazy } from 'react';
import { store } from '@src/store';
import Router from '@src/router';

jest.spyOn(React, 'lazy').mockImplementationOnce(() => {
  throw new Error('error');
});
jest.mock('@src/config/routes', () => [
  {
    path: '/metrics',
    exact: true,
    component: lazy(() => {
      throw new Error();
    }),
    name: 'metrics',
  },
]);

jest.useFakeTimers();
describe('router', () => {
  const setup = (routeUrl: string) =>
    render(
      <Provider store={store}>
        <MemoryRouter initialEntries={[routeUrl]}>
          <Router />
        </MemoryRouter>
      </Provider>,
    );

  it('should redirect to home page', async () => {
    setup(METRICS_PAGE_ROUTE);

    await waitFor(() => {
      expect(window.location.pathname).toEqual('/');
    });
  });
});
