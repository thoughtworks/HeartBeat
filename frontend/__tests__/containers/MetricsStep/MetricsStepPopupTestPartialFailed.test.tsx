import { render, waitFor } from '@testing-library/react';
import { setupStore } from '../../utils/setupStoreUtil';
import MetricsStep from '@src/containers/MetricsStep';
import { Provider } from 'react-redux';

import { addNotification } from '@src/context/notification/NotificationSlice';
import { METRICS_DATA_FAIL_STATUS } from '@src/constants/commons';

let store = setupStore();
const setup = () =>
  render(
    <Provider store={store}>
      <MetricsStep />
    </Provider>,
  );

jest.mock('@src/context/notification/NotificationSlice', () => ({
  ...jest.requireActual('@src/context/notification/NotificationSlice'),
  addNotification: jest.fn().mockReturnValue({ type: 'ADD_NEW_NOTIFICATION' }),
}));

let boardInfoFailStatus = METRICS_DATA_FAIL_STATUS.NOT_FAILED;

jest.mock('@src/hooks/useGetBoardInfo', () => ({
  ...jest.requireActual('@src/hooks/useGetBoardInfo'),

  useGetBoardInfoEffect: jest.fn().mockImplementation(() => {
    return {
      boardInfoFailedStatus: boardInfoFailStatus,
    };
  }),
}));

describe('MetricsStep', () => {
  beforeEach(() => {
    store = setupStore();
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  it('should show 4xx popup when call get partial 4xx error', async () => {
    boardInfoFailStatus = METRICS_DATA_FAIL_STATUS.PARTIAL_FAILED_4XX;
    setup();

    await waitFor(() => {
      expect(addNotification).toHaveBeenCalled();
    });
  });

  it('should show no cards popup when call get partial no cards error', async () => {
    boardInfoFailStatus = METRICS_DATA_FAIL_STATUS.PARTIAL_FAILED_NO_CARDS;
    setup();

    await waitFor(() => {
      expect(addNotification).toHaveBeenCalled();
    });
  });
});
