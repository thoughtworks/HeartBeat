import React, { lazy } from 'react';
import { render, waitFor } from '@testing-library/react';
import { MemoryRouter } from 'react-router-dom';
import Router from '@src/router';
import { Provider } from 'react-redux';
import { store } from '@src/store';
import { ERROR_PAGE_MESSAGE, ERROR_PAGE_ROUTE, BASE_PAGE_ROUTE, METRICS_PAGE_ROUTE } from './fixtures';

jest.mock('@src/pages/Metrics', () => ({
  __esModule: true,
  default: () => <div>Mocked Metrics Page</div>,
}));
jest.useFakeTimers();
describe('router', () => {
  const setup = (routeUrl: string) =>
    render(
      <Provider store={store}>
        <MemoryRouter initialEntries={[routeUrl]}>
          <Router />
        </MemoryRouter>
      </Provider>
    );

  it('should show home page when loading on a bad page', async () => {
    const badRoute = '/some/bad/route';

    setup(badRoute);

    await waitFor(() => {
      expect(window.location.pathname).toEqual('/');
    });
  });

  it('should show home page when go through base route', async () => {
    setup(BASE_PAGE_ROUTE);

    await waitFor(() => {
      expect(window.location.pathname).toEqual('/');
    });
  });

  it('should show Metrics page when go Metrics page', async () => {
    const { getByText } = setup(METRICS_PAGE_ROUTE);

    await waitFor(() => {
      expect(getByText('Mocked Metrics Page')).toBeInTheDocument();
    });
  });

  it('should show error page when go error page', async () => {
    const { getByText } = setup(ERROR_PAGE_ROUTE);

    await waitFor(() => {
      expect(getByText(ERROR_PAGE_MESSAGE)).toBeInTheDocument();
    });
  });

  it('should redirect to home page', async () => {
    jest.spyOn(React, 'lazy').mockImplementationOnce(() => {
      throw new Error('error');
    });
    jest.mock('@src/config/routes', () => ({
      path: METRICS_PAGE_ROUTE,
      exact: true,
      component: lazy(() => {
        throw new Error();
      }),
      name: 'Home',
    }));

    setup(METRICS_PAGE_ROUTE);

    await waitFor(() => {
      expect(window.location.pathname).toEqual('/');
    });
  });
});
