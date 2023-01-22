import { render } from '@testing-library/react';
import '@testing-library/jest-dom';
import Header from '@src/layouts/Header';
import { BrowserRouter } from 'react-router-dom';
import { PROJECT_NAME } from '../fixtures';

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
    it('should show home icon', () => {
      jest.mock('react-router-dom', () => {
        return {
          ...jest.requireActual('react-router-dom'),
          useLocation: () => {
            return {
              pathname: '/any_path_except_home_path',
              search: '',
              hash: '',
              state: null,
              key: 'default',
            };
          },
        };
      });

      const { getByText } = render(
        <BrowserRouter>
          <Header />
        </BrowserRouter>
      );

      expect(getByText(PROJECT_NAME)).toBeInTheDocument();

      jest.resetAllMocks();
    });
  });
});
