import React from 'react';
import { render, screen } from '@testing-library/react';
import clearAllMocks = jest.clearAllMocks;
import DoraMetrics from '@src/containers/ReportStep/DoraMetrics';
import { MOCK_REPORT_RESPONSE, REQUIRED_DATA_LIST } from '../../../src/fixtures';
import { setupStore } from '../../../src/utils/setupStoreUtil';
import { Provider } from 'react-redux';
import { RETRY } from '@src/constants/resources';
import userEvent from '@testing-library/user-event';
import { updateMetrics } from '@src/context/config/configSlice';

describe('Report Card', () => {
  afterEach(() => {
    clearAllMocks();
  });

  let store = setupStore();

  const mockData = {
    ...MOCK_REPORT_RESPONSE,
    reportMetricsError: {
      boardMetricsError: null,
      sourceControlMetricsError: {
        status: 404,
        message: 'Not Found',
      },
      pipelineMetricsError: {
        status: 404,
        message: 'Not Found',
      },
    },
  };

  const mockHandleRetry = jest.fn();
  const onShowDetail = jest.fn();

  const setup = () => {
    store = setupStore();
    store.dispatch(updateMetrics(REQUIRED_DATA_LIST));
    return render(
      <Provider store={store}>
        <DoraMetrics
          isBackFromDetail={false}
          startDate={''}
          endDate={''}
          startToRequestDoraData={mockHandleRetry}
          onShowDetail={onShowDetail}
          doraReport={mockData}
          csvTimeStamp={1705014731}
          timeoutError={''}
        />
      </Provider>
    );
  };

  it('should show retry button when have reportMetricsError and click retry will triger api call', async () => {
    setup();

    expect(screen.getByText(RETRY)).toBeInTheDocument();
    expect(screen.getByText('Failed to get Github info_status: 404')).toBeInTheDocument();

    await userEvent.click(screen.getByText(RETRY));

    expect(mockHandleRetry).toHaveBeenCalled();
  });
});
