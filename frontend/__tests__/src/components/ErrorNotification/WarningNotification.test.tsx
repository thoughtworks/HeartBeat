import { WarningNotification } from '@src/components/Common/WarningNotification';
import { act, render, waitFor } from '@testing-library/react';
import { ERROR_MESSAGE_TIME_DURATION } from '../../fixtures';
import { setupStore } from '../../utils/setupStoreUtil';
import { Provider } from 'react-redux';
import React from 'react';

let store = null;
jest.useFakeTimers();
describe('ErrorNotificationAutoDismiss', () => {
  store = setupStore();
  const message = 'Test error message';
  const setup = () => {
    store = setupStore();
    return render(
      <Provider store={store}>
        <WarningNotification message={message} />
      </Provider>,
    );
  };
  afterEach(() => {
    jest.clearAllMocks();
  });

  test('renders error message and dismisses after 2 seconds', async () => {
    const { getByText, queryByText } = setup();

    expect(getByText(message)).toBeInTheDocument();

    act(() => {
      jest.advanceTimersByTime(ERROR_MESSAGE_TIME_DURATION);
    });

    await waitFor(() => {
      expect(queryByText(message)).not.toBeInTheDocument();
    });
  });
});
