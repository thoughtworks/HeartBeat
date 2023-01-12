import { render, waitFor } from '@testing-library/react';
import { MemoryRouter } from 'react-router-dom';
import React from 'react';
import Router from '@src/router';
import '@testing-library/jest-dom';

describe('router', () => {
  const setup = (routeUrl: string) =>
    render(
      <MemoryRouter initialEntries={[routeUrl]}>
        <Router />
      </MemoryRouter>
    );

  it('should show home page when loading on a bad page', async () => {
    const badRoute = '/some/bad/route';

    const { getByText } = setup(badRoute);

    await waitFor(() => {
      expect(getByText('This is Home Page')).toBeInTheDocument();
    });
  });

  it('should show home page when go home page', async () => {
    const homeRoute = '/home';

    const { getByText } = setup(homeRoute);

    await waitFor(() => {
      expect(getByText('This is Home Page')).toBeInTheDocument();
    });
  });

  it('should show about page when go about page', async () => {
    const aboutRoute = '/about';

    const { getByText } = setup(aboutRoute);

    await waitFor(() => {
      expect(getByText('This is About Page')).toBeInTheDocument();
    });
  });
});
