import { ReportButtonGroup } from '@src/components/Metrics/ReportButtonGroup';
import { render, screen } from '@testing-library/react';
import { EXPORT_METRIC_DATA, MOCK_REPORT_RESPONSE } from '../../fixtures';

describe('test', () => {
  const mockHandler = jest.fn();
  const mockData = {
    ...MOCK_REPORT_RESPONSE,
    exportValidityTime: 30,

    reportError: {
      boardError: {
        status: 401,
        message: 'Unauthorized',
      },
      pipelineError: {
        status: 401,
        message: 'Unauthorized',
      },
      sourceControlError: {
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
      />
    );

    expect(screen.queryByRole('button', { name: EXPORT_METRIC_DATA })).toBeDisabled();
  });
});
