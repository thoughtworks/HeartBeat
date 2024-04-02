import { EXPORT_METRIC_DATA, MOCK_REPORT_RESPONSE } from '../fixtures';
import { ReportButtonGroup } from '@src/containers/ReportButtonGroup';
import { setupStore } from '@test/utils/setupStoreUtil';
import { render, screen } from '@testing-library/react';
import { Provider } from 'react-redux';

describe('test', () => {
  const mockHandler = jest.fn();
  const mockData = {
    ...MOCK_REPORT_RESPONSE,
    exportValidityTime: 30,
    reportMetricsError: {
      boardMetricsError: {
        status: 401,
        message: 'Unauthorized',
      },
      pipelineMetricsError: {
        status: 401,
        message: 'Unauthorized',
      },
      sourceControlMetricsError: {
        status: 401,
        message: 'Unauthorized',
      },
    },
  };

  const setup = () => {
    const store = setupStore();
    render(
      <Provider store={store}>
        <ReportButtonGroup
          isShowSave={true}
          isShowExportMetrics={true}
          isShowExportBoardButton={true}
          isShowExportPipelineButton={true}
          handleBack={mockHandler}
          handleSave={mockHandler}
          reportData={mockData}
          startDate={''}
          endDate={''}
          csvTimeStamp={1239013}
        />
      </Provider>,
    );
  };

  it('test', () => {
    setup();

    expect(screen.queryByRole('button', { name: EXPORT_METRIC_DATA })).toBeDisabled();
  });
});
