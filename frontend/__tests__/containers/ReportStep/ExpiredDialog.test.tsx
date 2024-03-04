import { ExpiredDialog } from '@src/containers/ReportStep/ExpiredDialog';
import { render, screen, waitFor } from '@testing-library/react';
import { EXPORT_EXPIRED_CSV_MESSAGE } from '../../fixtures';
import { setupStore } from '../../utils/setupStoreUtil';
import userEvent from '@testing-library/user-event';
import { Provider } from 'react-redux';

describe('ExpiredDialog', () => {
  it('should show expired dialog when csv file expired and close expired dialog when click No button', async () => {
    const handleOkFn = jest.fn();

    const { getByText, queryByText } = render(
      <Provider store={setupStore()}>
        <ExpiredDialog isExpired={true} handleOk={handleOkFn}></ExpiredDialog>
      </Provider>,
    );

    expect(getByText(EXPORT_EXPIRED_CSV_MESSAGE)).toBeInTheDocument();

    await userEvent.click(screen.getByText('No'));
    await waitFor(() => {
      expect(queryByText(EXPORT_EXPIRED_CSV_MESSAGE)).not.toBeInTheDocument();
    });
  });

  it('should not show expired dialog when isExpired is false ', async () => {
    const handleOkFn = jest.fn();

    const { queryByText } = render(
      <Provider store={setupStore()}>
        <ExpiredDialog isExpired={false} handleOk={handleOkFn}></ExpiredDialog>
      </Provider>,
    );

    expect(queryByText(EXPORT_EXPIRED_CSV_MESSAGE)).not.toBeInTheDocument();
  });

  it('should close expired dialog given an expired dialog when click the Ok button', async () => {
    const handleOkFn = jest.fn();

    const { getByText } = render(
      <Provider store={setupStore()}>
        <ExpiredDialog isExpired={true} handleOk={handleOkFn}></ExpiredDialog>
      </Provider>,
    );

    expect(getByText(EXPORT_EXPIRED_CSV_MESSAGE)).toBeInTheDocument();

    await userEvent.click(screen.getByText('Yes'));
    expect(handleOkFn).toBeCalledTimes(1);
  });
});
