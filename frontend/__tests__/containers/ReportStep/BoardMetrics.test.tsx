import { CLASSIFICATION, LEAD_TIME_FOR_CHANGES, MOCK_REPORT_RESPONSE } from '../../fixtures';
import BoardMetrics from '@src/containers/ReportStep/BoardMetrics';
import { updateMetrics } from '@src/context/config/configSlice';
import { setupStore } from '../../utils/setupStoreUtil';
import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { RETRY } from '@src/constants/resources';
import { Provider } from 'react-redux';
import React from 'react';
import clearAllMocks = jest.clearAllMocks;

describe('Report Card', () => {
  afterEach(() => {
    clearAllMocks();
  });

  let store = setupStore();

  const mockData = {
    ...MOCK_REPORT_RESPONSE,
    reportMetricsError: {
      pipelineMetricsError: null,
      sourceControlMetricsError: null,
      boardMetricsError: {
        status: 404,
        message: 'Not Found',
      },
    },
  };

  const mockHandleRetry = jest.fn();
  const onShowDetail = jest.fn();

  const setup = () => {
    store = setupStore();
    return render(
      <Provider store={store}>
        <BoardMetrics
          isBackFromDetail={false}
          startDate={''}
          endDate={''}
          startToRequestBoardData={mockHandleRetry}
          onShowDetail={onShowDetail}
          boardReport={mockData}
          csvTimeStamp={1705014731}
          errorMessage={''}
        />
      </Provider>,
    );
  };

  it('should show retry button when have reportMetricsError and click retry will triger api call', async () => {
    const { getByText } = setup();

    expect(getByText(RETRY)).toBeInTheDocument();

    await userEvent.click(getByText(RETRY));

    expect(mockHandleRetry).toHaveBeenCalled();
  });

  it('should show loading button when board metrics select classification and dora metrics has value too ', async () => {
    const store = setupStore();
    store.dispatch(updateMetrics([CLASSIFICATION, LEAD_TIME_FOR_CHANGES]));
    const mockData = {
      ...MOCK_REPORT_RESPONSE,
      boardMetricsCompleted: false,
    };

    render(
      <Provider store={store}>
        <BoardMetrics
          isBackFromDetail={false}
          startDate={''}
          endDate={''}
          startToRequestBoardData={mockHandleRetry}
          onShowDetail={onShowDetail}
          boardReport={mockData}
          csvTimeStamp={1705014731}
          errorMessage={''}
        />
      </Provider>,
    );

    expect(screen.getByTestId('loading')).toBeInTheDocument();
  });
});
