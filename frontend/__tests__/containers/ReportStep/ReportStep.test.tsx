import {
  BACK,
  BOARD_METRICS_TITLE,
  CLASSIFICATION,
  EMPTY_REPORT_VALUES,
  EXPORT_BOARD_DATA,
  EXPORT_METRIC_DATA,
  EXPORT_PIPELINE_DATA,
  LEAD_TIME_FOR_CHANGES,
  MOCK_DATE_RANGE,
  MOCK_JIRA_VERIFY_RESPONSE,
  MOCK_REPORT_RESPONSE,
  PREVIOUS,
  REQUIRED_DATA_LIST,
  RETRY,
  SAVE,
  SHOW_MORE,
} from '../../fixtures';
import {
  DateRange,
  updateDateRange,
  updateJiraVerifyResponse,
  updateMetrics,
  updatePipelineToolVerifyResponse,
} from '@src/context/config/configSlice';
import { addADeploymentFrequencySetting, updateDeploymentFrequencySettings } from '@src/context/Metrics/metricsSlice';
import { addNotification } from '@src/context/notification/NotificationSlice';
import { useGenerateReportEffect } from '@src/hooks/useGenerateReportEffect';
import { render, renderHook, screen, waitFor } from '@testing-library/react';
import { useExportCsvEffect } from '@src/hooks/useExportCsvEffect';
import { backStep } from '@src/context/stepper/StepperSlice';
import { setupStore } from '../../utils/setupStoreUtil';
import userEvent from '@testing-library/user-event';
import ReportStep from '@src/containers/ReportStep';
import { MESSAGE } from '@src/constants/resources';
import { Provider } from 'react-redux';
import React from 'react';

jest.mock('@src/context/notification/NotificationSlice', () => ({
  ...jest.requireActual('@src/context/notification/NotificationSlice'),
  addNotification: jest.fn().mockReturnValue({ type: 'ADD_NOTIFICATION' }),
}));

jest.mock('@src/context/stepper/StepperSlice', () => ({
  ...jest.requireActual('@src/context/stepper/StepperSlice'),
  backStep: jest.fn().mockReturnValue({ type: 'BACK_STEP' }),
}));

jest.mock('@src/hooks/useExportCsvEffect', () => ({
  useExportCsvEffect: jest.fn().mockReturnValue({
    fetchExportData: jest.fn(),
    isExpired: false,
  }),
}));

jest.mock('@src/hooks/useGenerateReportEffect', () => ({
  useGenerateReportEffect: jest.fn().mockReturnValue({
    startToRequestData: jest.fn(),
    startToRequestDoraData: jest.fn(),
    stopPollingReports: jest.fn(),
    isServerError: false,
    errorMessage: '',
  }),
}));

jest.mock('@src/constants/emojis/emoji', () => ({
  getEmojiUrls: jest.fn().mockReturnValue(['']),
  removeExtraEmojiName: jest.fn(),
}));

jest.mock('@src/utils/util', () => ({
  ...jest.requireActual('@src/utils/util'),
  transformToCleanedBuildKiteEmoji: jest.fn(),
  getJiraBoardToken: jest.fn(),
  filterAndMapCycleTimeSettings: jest.fn(),
  formatMinToHours: jest.fn().mockImplementation((time) => time / 60),
  formatMillisecondsToHours: jest.fn().mockImplementation((time) => time / 60 / 60 / 1000),
}));

let store = null;
describe('Report Step', () => {
  const { result: reportHook } = renderHook(() => useGenerateReportEffect());
  beforeEach(() => {
    resetReportHook();
  });
  const resetReportHook = async () => {
    reportHook.current.startToRequestData = jest.fn();
    reportHook.current.stopPollingReports = jest.fn();
    reportHook.current.reportData = { ...MOCK_REPORT_RESPONSE, exportValidityTime: 30 };
  };
  const handleSaveMock = jest.fn();
  const setup = (params: string[], dateRange?: DateRange) => {
    store = setupStore();
    dateRange && store.dispatch(updateDateRange(dateRange));
    store.dispatch(
      updateJiraVerifyResponse({
        jiraColumns: MOCK_JIRA_VERIFY_RESPONSE.jiraColumns,
        targetFields: MOCK_JIRA_VERIFY_RESPONSE.targetFields,
        users: MOCK_JIRA_VERIFY_RESPONSE.users,
      }),
    );
    store.dispatch(updateMetrics(params));
    store.dispatch(addADeploymentFrequencySetting());
    store.dispatch(
      updateDeploymentFrequencySettings({ updateId: 1, label: 'organization', value: 'mock organization' }),
    );
    store.dispatch(
      updateDeploymentFrequencySettings({ updateId: 1, label: 'pipelineName', value: 'mock pipeline name' }),
    );
    store.dispatch(updateDeploymentFrequencySettings({ updateId: 1, label: 'step', value: 'mock step1' }));
    store.dispatch(
      updatePipelineToolVerifyResponse({
        pipelineList: [
          {
            orgId: 'mock organization id',
            orgName: 'mock organization',
            id: 'mock pipeline id',
            name: 'mock pipeline name',
            steps: ['mock step1', 'mock step2'],
            repository: 'mock url',
          },
        ],
      }),
    );
    return render(
      <Provider store={store}>
        <ReportStep handleSave={handleSaveMock} />
      </Provider>,
    );
  };
  afterEach(() => {
    store = null;
    jest.clearAllMocks();
  });

  describe('render correctly', () => {
    it('should render report page', () => {
      setup(REQUIRED_DATA_LIST);

      expect(screen.getByText('Board Metrics')).toBeInTheDocument();
      expect(screen.getByText('Velocity')).toBeInTheDocument();
      expect(screen.getByText('Cycle Time')).toBeInTheDocument();
      expect(screen.getByText('DORA Metrics')).toBeInTheDocument();
      expect(screen.getByText('Lead Time For Changes')).toBeInTheDocument();
      expect(screen.getByText('Deployment Frequency')).toBeInTheDocument();
      expect(screen.getByText('Dev Change Failure Rate')).toBeInTheDocument();
      expect(screen.getByText('Dev Mean Time To Recovery')).toBeInTheDocument();
    });

    it('should render loading page when report data is empty', () => {
      reportHook.current.reportData = EMPTY_REPORT_VALUES;

      setup(REQUIRED_DATA_LIST);

      expect(screen.getAllByTestId('loading-page')).toHaveLength(7);
    });

    it('should render detail page when metrics only select classification', () => {
      setup([CLASSIFICATION]);

      expect(screen.getByText(BACK)).toBeInTheDocument();
    });

    it('should render report page when board metrics select classification and dora metrics has value too', () => {
      setup([CLASSIFICATION, LEAD_TIME_FOR_CHANGES]);

      expect(screen.getByText(BOARD_METRICS_TITLE)).toBeInTheDocument();
    });

    it('should render the velocity component with correct props', async () => {
      setup([REQUIRED_DATA_LIST[1]]);

      expect(screen.getByText('20')).toBeInTheDocument();
      expect(screen.getByText('14')).toBeInTheDocument();
    });

    it('should render the CycleTime component with correct props', () => {
      setup([REQUIRED_DATA_LIST[2]]);

      expect(screen.getByText('30.26')).toBeInTheDocument();
      expect(screen.getByText('21.18')).toBeInTheDocument();
    });

    it('should render the Lead Time For Change component with correct props', () => {
      setup([REQUIRED_DATA_LIST[5]]);

      expect(screen.getByText('60.79')).toBeInTheDocument();
      expect(screen.getByText('39.03')).toBeInTheDocument();
      expect(screen.getByText('99.82')).toBeInTheDocument();
    });

    it('should render the Deployment frequency component with correct props', () => {
      setup([REQUIRED_DATA_LIST[6]]);

      expect(screen.getByText('0.40')).toBeInTheDocument();
    });

    it('should render the Dev change failure rate component with correct props', () => {
      setup([REQUIRED_DATA_LIST[7]]);

      expect(screen.getByText('0.00')).toBeInTheDocument();
      expect(screen.getByText('% (0/6)')).toBeInTheDocument();
    });

    it('should render the Dev mean time to recovery component with correct props', () => {
      setup([REQUIRED_DATA_LIST[8]]);

      expect(screen.getByText('4.00')).toBeInTheDocument();
    });
  });

  describe('behavior', () => {
    it('should call handleBack method when clicking back button given back button enabled', async () => {
      setup(['']);

      const back = screen.getByText(PREVIOUS);
      await userEvent.click(back);

      expect(backStep).toHaveBeenCalledTimes(1);
    });

    it('should call handleSaveMock method when clicking save button', async () => {
      setup(['']);

      const save = screen.getByText(SAVE);
      await userEvent.click(save);

      expect(handleSaveMock).toHaveBeenCalledTimes(1);
    });

    it('should call addNotification when remaining time is less than or equal to 5 minutes', () => {
      jest.useFakeTimers();

      setup(['']);

      expect(addNotification).not.toBeCalledWith({
        title: MESSAGE.EXPIRE_INFORMATION(5),
      });

      jest.advanceTimersByTime(500000);

      expect(addNotification).not.toBeCalledWith({
        title: MESSAGE.EXPIRE_INFORMATION(5),
      });

      jest.advanceTimersByTime(1000000);

      expect(addNotification).toBeCalledWith({
        message: MESSAGE.EXPIRE_INFORMATION(5),
      });

      jest.useRealTimers();
    });

    it.each([[REQUIRED_DATA_LIST[2]], [REQUIRED_DATA_LIST[5]]])(
      'should render detail page when clicking show more button given metric %s',
      async (requiredData) => {
        setup([requiredData], MOCK_DATE_RANGE);

        await userEvent.click(screen.getByText(SHOW_MORE));

        await waitFor(() => {
          expect(screen.queryByText(SHOW_MORE)).not.toBeInTheDocument();
        });
        expect(screen.getByText(BACK)).toBeInTheDocument();
      },
    );

    it.each([[REQUIRED_DATA_LIST[2]], [REQUIRED_DATA_LIST[5]]])(
      'should return report page when clicking back button in Breadcrumb in detail page given metric %s',
      async (requiredData) => {
        setup([requiredData]);

        await userEvent.click(screen.getByText(SHOW_MORE));

        await waitFor(() => {
          expect(screen.queryByText(SHOW_MORE)).not.toBeInTheDocument();
        });

        await userEvent.click(screen.getByText(BACK));

        await waitFor(() => {
          expect(screen.queryByText(BACK)).not.toBeInTheDocument();
        });
        expect(screen.getByText(SHOW_MORE)).toBeInTheDocument();
      },
    );

    it.each([[REQUIRED_DATA_LIST[2]], [REQUIRED_DATA_LIST[5]]])(
      'should return report page when clicking previous button in detail page given metric %s',
      async (requiredData) => {
        setup([requiredData]);

        const showMore = screen.getByText(SHOW_MORE);

        await userEvent.click(showMore);

        await waitFor(() => {
          expect(screen.queryByText(SHOW_MORE)).not.toBeInTheDocument();
        });
        const previous = screen.getByText(PREVIOUS);

        await userEvent.click(previous);

        await waitFor(() => {
          expect(screen.getByText(SHOW_MORE)).toBeInTheDocument();
        });
      },
    );
  });

  describe('export pipeline data', () => {
    it('should not show export pipeline button when not selecting deployment frequency', () => {
      const { queryByText } = setup([REQUIRED_DATA_LIST[1]]);

      const exportPipelineButton = queryByText(EXPORT_PIPELINE_DATA);

      expect(exportPipelineButton).not.toBeInTheDocument();
    });

    it.each([[REQUIRED_DATA_LIST[5]], [REQUIRED_DATA_LIST[6]], [REQUIRED_DATA_LIST[7]], [REQUIRED_DATA_LIST[8]]])(
      'should show export pipeline button when selecting %s',
      (requiredData) => {
        setup([requiredData]);

        const exportPipelineButton = screen.getByText(EXPORT_PIPELINE_DATA);

        expect(exportPipelineButton).toBeInTheDocument();
      },
    );

    it('should call fetchExportData when clicking "Export pipeline data"', async () => {
      const { result } = renderHook(() => useExportCsvEffect());
      setup([REQUIRED_DATA_LIST[6]]);

      const exportButton = screen.getByText(EXPORT_PIPELINE_DATA);
      expect(exportButton).toBeInTheDocument();
      await userEvent.click(exportButton);

      expect(result.current.fetchExportData).toBeCalledWith({
        csvTimeStamp: 0,
        dataType: 'pipeline',
        endDate: '',
        startDate: '',
      });
    });
  });

  describe('export board data', () => {
    it('should not show export board button when not selecting board metrics', () => {
      const { queryByText } = setup([REQUIRED_DATA_LIST[5]]);

      const exportPipelineButton = queryByText(EXPORT_BOARD_DATA);

      expect(exportPipelineButton).not.toBeInTheDocument();
    });

    it.each([[REQUIRED_DATA_LIST[1]], [REQUIRED_DATA_LIST[2]]])(
      'should show export board button when selecting %s',
      (requiredData) => {
        setup([requiredData]);

        const exportPipelineButton = screen.getByText(EXPORT_BOARD_DATA);

        expect(exportPipelineButton).toBeInTheDocument();
      },
    );

    it('should call fetchExportData when clicking "Export board data"', async () => {
      const { result } = renderHook(() => useExportCsvEffect());
      setup([REQUIRED_DATA_LIST[2]]);

      const exportButton = screen.getByText(EXPORT_BOARD_DATA);
      expect(exportButton).toBeInTheDocument();
      await userEvent.click(exportButton);

      expect(result.current.fetchExportData).toBeCalledWith({
        csvTimeStamp: 0,
        dataType: 'board',
        endDate: '',
        startDate: '',
      });
    });
  });

  describe('export metric data', () => {
    it('should show export metric button when visiting this page', () => {
      setup(['']);

      const exportMetricButton = screen.getByText(EXPORT_METRIC_DATA);

      expect(exportMetricButton).toBeInTheDocument();
    });

    it('should call fetchExportData when clicking "Export metric data"', async () => {
      const { result } = renderHook(() => useExportCsvEffect());
      setup(['']);

      const exportButton = screen.getByText(EXPORT_METRIC_DATA);
      expect(exportButton).toBeInTheDocument();
      await userEvent.click(exportButton);

      expect(result.current.fetchExportData).toBeCalledWith({
        csvTimeStamp: 0,
        dataType: 'metric',
        endDate: '',
        startDate: '',
      });
    });

    it('should show errorMessage when clicking export metric button given csv not exist', async () => {
      setup(['']);
      await userEvent.click(screen.getByText(EXPORT_METRIC_DATA));
      expect(screen.getByText('Export metric data')).toBeInTheDocument();
    });
  });

  describe('error notification', () => {
    const error = 'error';

    it('should call addNotification when having timeout4Board error', () => {
      reportHook.current.timeout4Board = error;

      setup(REQUIRED_DATA_LIST);

      expect(addNotification).toBeCalledWith({
        message: MESSAGE.LOADING_TIMEOUT('Board metrics'),
        type: 'error',
      });
    });

    it('should call addNotification when having timeout4Dora error', () => {
      reportHook.current.timeout4Dora = error;

      setup(REQUIRED_DATA_LIST);

      expect(addNotification).toBeCalledWith({
        message: MESSAGE.LOADING_TIMEOUT('DORA metrics'),
        type: 'error',
      });
    });

    it('should call addNotification when having timeout4Report error', () => {
      reportHook.current.timeout4Report = error;

      setup(REQUIRED_DATA_LIST);

      expect(addNotification).toBeCalledWith({
        message: MESSAGE.LOADING_TIMEOUT('Report'),
        type: 'error',
      });
    });

    it('should call addNotification when having boardMetricsError', () => {
      reportHook.current.reportData = {
        ...MOCK_REPORT_RESPONSE,
        reportMetricsError: {
          boardMetricsError: {
            status: 400,
            message: 'Board metrics error',
          },
          pipelineMetricsError: null,
          sourceControlMetricsError: null,
        },
      };

      setup(REQUIRED_DATA_LIST);

      expect(addNotification).toBeCalledWith({
        message: MESSAGE.FAILED_TO_GET_DATA('Board Metrics'),
        type: 'error',
      });
    });

    it('should call addNotification when having pipelineMetricsError', () => {
      reportHook.current.reportData = {
        ...MOCK_REPORT_RESPONSE,
        reportMetricsError: {
          boardMetricsError: null,
          pipelineMetricsError: {
            status: 400,
            message: 'Pipeline metrics error',
          },
          sourceControlMetricsError: null,
        },
      };

      setup(REQUIRED_DATA_LIST);

      expect(addNotification).toBeCalledWith({
        message: MESSAGE.FAILED_TO_GET_DATA('Buildkite'),
        type: 'error',
      });
    });

    it('should call addNotification when having sourceControlMetricsError', () => {
      reportHook.current.reportData = {
        ...MOCK_REPORT_RESPONSE,
        reportMetricsError: {
          boardMetricsError: null,
          pipelineMetricsError: null,
          sourceControlMetricsError: {
            status: 400,
            message: 'source control metrics error',
          },
        },
      };

      setup(REQUIRED_DATA_LIST);

      expect(addNotification).toBeCalledWith({
        message: MESSAGE.FAILED_TO_GET_DATA('GitHub'),
        type: 'error',
      });
    });

    it('should call addNotification when having generalError4Board error', () => {
      reportHook.current.generalError4Board = error;

      setup(REQUIRED_DATA_LIST);

      expect(addNotification).toBeCalledWith({
        message: MESSAGE.FAILED_TO_REQUEST,
        type: 'error',
      });
    });

    it('should call addNotification when having generalError4Dora error', () => {
      reportHook.current.generalError4Dora = error;

      setup(REQUIRED_DATA_LIST);

      expect(addNotification).toBeCalledWith({
        message: MESSAGE.FAILED_TO_REQUEST,
        type: 'error',
      });
    });

    it('should call addNotification when having generalError4Report error', () => {
      reportHook.current.generalError4Report = error;

      setup(REQUIRED_DATA_LIST);

      expect(addNotification).toBeCalledWith({
        message: MESSAGE.FAILED_TO_REQUEST,
        type: 'error',
      });
    });

    it('should retry startToRequestData when click the retry button in Board Metrics', async () => {
      reportHook.current.generalError4Report = error;
      setup(REQUIRED_DATA_LIST);

      await userEvent.click(screen.getAllByText(RETRY)[0]);

      await waitFor(() => {
        expect(useGenerateReportEffect().startToRequestData).toHaveBeenCalledTimes(2);
      });
    });

    it('should retry startToRequestData when click the retry button in Dora Metrics', async () => {
      reportHook.current.generalError4Report = error;
      setup(REQUIRED_DATA_LIST);

      await userEvent.click(screen.getAllByText(RETRY)[1]);

      await waitFor(() => {
        expect(useGenerateReportEffect().startToRequestData).toHaveBeenCalledTimes(2);
      });
    });
  });
});
