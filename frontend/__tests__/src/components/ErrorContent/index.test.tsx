import { BASE_PAGE_ROUTE, ERROR_PAGE_MESSAGE, RETRY_BUTTON } from '../../fixtures';
import { headerClient } from '@src/clients/header/HeaderClient';
import { ErrorContent } from '@src/components/ErrorContent';
import { setupStore } from '../../utils/setupStoreUtil';
import userEvent from '@testing-library/user-event';
import { navigateMock } from '../../../setupTests';
import { BrowserRouter } from 'react-router-dom';
import { render } from '@testing-library/react';
import ErrorPage from '@src/pages/ErrorPage';
import { Provider } from 'react-redux';
import React from 'react';

describe('error content', () => {
  it('should show error message when render error page', () => {
    const { getByText } = render(
      <BrowserRouter>
        <ErrorContent />
      </BrowserRouter>,
    );

    expect(getByText(ERROR_PAGE_MESSAGE)).toBeInTheDocument();
    expect(getByText(RETRY_BUTTON)).toBeInTheDocument();
  });

  it('should go to home page when click button', async () => {
    headerClient.getVersion = jest.fn().mockResolvedValue('');
    const { getByText } = render(
      <Provider store={setupStore()}>
        <BrowserRouter>
          <ErrorPage />
        </BrowserRouter>
      </Provider>,
    );
    await userEvent.click(getByText(RETRY_BUTTON));

    expect(navigateMock).toHaveBeenCalledWith(BASE_PAGE_ROUTE);
  });
});
