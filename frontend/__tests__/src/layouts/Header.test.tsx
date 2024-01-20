import { headerClient } from '@src/clients/header/HeaderClient';
import { act, fireEvent, render } from '@testing-library/react';
import { BrowserRouter, MemoryRouter } from 'react-router-dom';
import { setupStore } from '../utils/setupStoreUtil';
import { navigateMock } from '../../setupTests';
import { PROJECT_NAME } from '../fixtures';
import Header from '@src/layouts/Header';
import { Provider } from 'react-redux';

describe('Header', () => {
  let store = setupStore();
  beforeEach(() => {
    headerClient.getVersion = jest.fn().mockResolvedValue('');
    store = setupStore();
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  const setup = () =>
    render(
      <Provider store={store}>
        <BrowserRouter>
          <Header />
        </BrowserRouter>
      </Provider>,
    );

  it('should show project name', () => {
    const { getByText } = setup();

    expect(getByText(PROJECT_NAME)).toBeInTheDocument();
  });

  it('should show version info when request succeed', async () => {
    headerClient.getVersion = jest.fn().mockResolvedValueOnce('1.11');
    const { getByText } = await act(async () => setup());

    expect(getByText(/v1.11/)).toBeInTheDocument();
  });

  it('should show version info when request failed', async () => {
    headerClient.getVersion = jest.fn().mockResolvedValueOnce('');
    const { queryByText } = await act(async () => setup());

    expect(queryByText(/v/)).not.toBeInTheDocument();
  });

  it('should show project logo', () => {
    const { getByRole } = setup();

    const logoInstance = getByRole('img');
    expect(logoInstance).toBeInTheDocument();
    expect(logoInstance.getAttribute('alt')).toContain('logo');
  });

  it('should go to home page when click logo', () => {
    const { getByText } = setup();

    fireEvent.click(getByText(PROJECT_NAME));

    expect(window.location.pathname).toEqual('/');
  });

  describe('HomeIcon', () => {
    const homeBtnText = 'Home';
    const setup = (pathname: string) =>
      render(
        <Provider store={store}>
          <MemoryRouter initialEntries={[{ pathname }]}>
            <Header />
          </MemoryRouter>
        </Provider>,
      );

    afterEach(() => {
      jest.clearAllMocks();
    });

    it('should not show home icon when pathname is others', () => {
      const { queryByTitle } = setup('/not/home/page');

      expect(queryByTitle(homeBtnText)).not.toBeInTheDocument();
    });

    it('should not show home icon when pathname is index.html', () => {
      const { queryByTitle } = setup('/index.html');

      expect(queryByTitle(homeBtnText)).not.toBeInTheDocument();
    });

    it('should navigate to home page', () => {
      const { getByTitle } = setup('/error-page');

      fireEvent.click(getByTitle(homeBtnText));

      expect(navigateMock).toBeCalledTimes(1);
      expect(navigateMock).toBeCalledWith('/');
    });

    it('should navigate to home page', () => {
      const { getByTitle } = setup('/metrics');

      fireEvent.click(getByTitle(homeBtnText));

      expect(navigateMock).toBeCalledTimes(1);
      expect(navigateMock).toBeCalledWith('/');
    });

    it('should go to home page when click logo given a not home page path', () => {
      const { getByText } = setup('/not/home/page');

      fireEvent.click(getByText(PROJECT_NAME));

      expect(window.location.pathname).toEqual('/');
    });

    it('should go to home page when click logo given a not home page path', () => {
      const { getByText } = setup('/index.html');

      fireEvent.click(getByText(PROJECT_NAME));

      expect(window.location.pathname).toEqual('/');
    });
  });
});
