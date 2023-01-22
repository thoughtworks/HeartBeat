import { fireEvent, render } from '@testing-library/react';
import '@testing-library/jest-dom';
import Header from '@src/layouts/Header';
import { BrowserRouter, MemoryRouter } from 'react-router-dom';
import { PROJECT_NAME } from '../fixtures';
import { navigateMock } from '../../setupTests';

describe('Header', () => {
  it('should show project name', () => {
    const { getByText } = render(
      <BrowserRouter>
        <Header />
      </BrowserRouter>
    );

    expect(getByText(PROJECT_NAME)).toBeInTheDocument();
  });

  it('should show project logo', () => {
    const { getByRole } = render(
      <BrowserRouter>
        <Header />
      </BrowserRouter>
    );

    const logoInstance = getByRole('img');
    expect(logoInstance).toBeInTheDocument();
    expect(logoInstance.getAttribute('alt')).toContain('logo');
  });

  describe('HomeIcon', () => {
    const homeBtnText = 'Home';
    const notHomePageRender = () =>
      render(
        <MemoryRouter initialEntries={[{ pathname: '/not/home/page' }]}>
          <Header />
        </MemoryRouter>
      );

    it('should show home icon', () => {
      const { getByTitle } = notHomePageRender();

      expect(getByTitle(homeBtnText)).toBeVisible();
    });

    it('should navigate to home page', () => {
      const { getByTitle } = notHomePageRender();

      fireEvent.click(getByTitle(homeBtnText));
      expect(navigateMock).toBeCalledTimes(1);
      expect(navigateMock).toBeCalledWith('/');
    });
  });
});
