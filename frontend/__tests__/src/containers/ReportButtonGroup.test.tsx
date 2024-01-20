import { EXPORT_METRIC_DATA, MOCK_REPORT_RESPONSE } from '../fixtures';
import { ReportButtonGroup } from '@src/containers/ReportButtonGroup';
import { render, screen } from '@testing-library/react';

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
  it('test', () => {
    render(
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
        setErrorMessage={mockHandler}
      />,
    );

    expect(screen.queryByRole('button', { name: EXPORT_METRIC_DATA })).toBeDisabled();
  });
});
