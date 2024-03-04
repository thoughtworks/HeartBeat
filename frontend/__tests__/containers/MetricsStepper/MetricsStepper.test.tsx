import {
  BASE_PAGE_ROUTE,
  BOARD_TYPES,
  CONFIRM_DIALOG_DESCRIPTION,
  MOCK_REPORT_URL,
  NEXT,
  PIPELINE_TOOL_TYPES,
  PREVIOUS,
  PROJECT_NAME_LABEL,
  SAVE,
  STEPPER,
  TEST_PROJECT_NAME,
  VELOCITY,
} from '../../fixtures';
import {
  updateBoard,
  updateBoardVerifyState,
  updateMetrics,
  updatePipelineTool,
  updatePipelineToolVerifyState,
  updateSourceControl,
  updateSourceControlVerifyState,
} from '@src/context/config/configSlice';
import {
  updateCycleTimeSettings,
  saveDoneColumn,
  saveTargetFields,
  saveUsers,
  updateDeploymentFrequencySettings,
  updateTreatFlagCardAsBlock,
} from '@src/context/Metrics/metricsSlice';
import { ASSIGNEE_FILTER_TYPES, SOURCE_CONTROL_TYPES } from '@src/constants/resources';
import { act, fireEvent, render, screen, waitFor } from '@testing-library/react';
import MetricsStepper from '@src/containers/MetricsStepper';
import { setupStore } from '../../utils/setupStoreUtil';
import userEvent from '@testing-library/user-event';
import { exportToJsonFile } from '@src/utils/util';
import { navigateMock } from '../../setupTests';
import { Provider } from 'react-redux';
import { setupServer } from 'msw/node';
import { HttpStatusCode } from 'axios';
import { rest } from 'msw';
import dayjs from 'dayjs';
import React from 'react';

const START_DATE_LABEL = 'From *';
const TODAY = dayjs();
const INPUT_DATE_VALUE = TODAY.format('MM/DD/YYYY');
const END_DATE_LABEL = 'To *';
const YES = 'Yes';
const CANCEL = 'Cancel';
const METRICS = 'Metrics';
const REPORT = 'Report';
const stepperColor = 'rgba(0, 0, 0, 0.87)';

const mockValidationCheckContext = {
  deploymentFrequencySettingsErrorMessages: [],
  leadTimeForChangesErrorMessages: [],
  clearErrorMessage: jest.fn(),
  checkDuplicatedPipeline: jest.fn(),
  getDuplicatedPipeLineIds: jest.fn().mockReturnValue([]),
};

jest.mock('@src/hooks/useMetricsStepValidationCheckContext', () => ({
  useMetricsStepValidationCheckContext: () => mockValidationCheckContext,
}));

jest.mock('@src/context/config/configSlice', () => ({
  ...jest.requireActual('@src/context/config/configSlice'),
  selectPipelineOrganizations: jest.fn().mockReturnValue(['mock new organization']),
  selectPipelineNames: jest.fn().mockReturnValue(['mock new pipelineName']),
  selectSteps: jest.fn().mockReturnValue(['mock new step']),
  selectBranches: jest.fn().mockReturnValue(['mock new branch']),
  updateSourceControl: jest.fn().mockReturnValue({ type: 'UPDATE_SOURCE_CONTROL' }),
  updatePipelineTool: jest.fn().mockReturnValue({ type: 'UPDATE_PIPELINE_TOOL' }),
  updateBoard: jest.fn().mockReturnValue({ type: 'UPDATE_BOARD' }),
}));

jest.mock('@src/constants/emojis/emoji', () => ({
  getEmojiUrls: jest.fn().mockReturnValue(['https://buildkiteassets.com/emojis/img-buildkite-64/charger64.png']),
  removeExtraEmojiName: jest.fn(),
}));

jest.mock('@src/utils/util', () => ({
  ...jest.requireActual('@src/utils/util'),
  exportToJsonFile: jest.fn(),
  getJiraBoardToken: jest.fn(),
  transformToCleanedBuildKiteEmoji: jest.fn(),
  findCaseInsensitiveType: jest.fn(),
  filterAndMapCycleTimeSettings: jest.fn(),
  getRealDoneStatus: jest.fn(),
  formatDate: jest.fn(),
}));

jest.mock('@src/hooks/useGenerateReportEffect', () => ({
  useGenerateReportEffect: jest.fn().mockReturnValue({
    startToRequestBoardData: jest.fn(),
    startToRequestDoraData: jest.fn(),
    stopPollingReports: jest.fn(),
    isServerError: false,
    errorMessage: '',
  }),
}));

const server = setupServer(rest.post(MOCK_REPORT_URL, (_, res, ctx) => res(ctx.status(HttpStatusCode.Ok))));

const mockLocation = { reload: jest.fn() };
Object.defineProperty(window, 'location', { value: mockLocation });

let store = setupStore();
const fillConfigPageData = async () => {
  const projectNameInput = await screen.findByRole('textbox', { name: PROJECT_NAME_LABEL });
  fireEvent.change(projectNameInput, { target: { value: TEST_PROJECT_NAME } });
  const startDateInput = (await screen.findByRole('textbox', { name: START_DATE_LABEL })) as HTMLInputElement;
  fireEvent.change(startDateInput, { target: { value: INPUT_DATE_VALUE } });

  act(() => {
    store.dispatch(updateMetrics([VELOCITY]));
    store.dispatch(updateBoardVerifyState(true));
    store.dispatch(updatePipelineToolVerifyState(true));
    store.dispatch(updateSourceControlVerifyState(true));
  });
};

const fillMetricsData = () => {
  act(() => {
    store.dispatch(updateMetrics([VELOCITY]));
  });
};

const fillMetricsPageDate = async () => {
  act(() => {
    store.dispatch(saveTargetFields([{ name: 'mockClassification', key: 'mockClassification', flag: true }]));
    store.dispatch(saveUsers(['mockUsers']));
    store.dispatch(saveDoneColumn(['Done', 'Canceled'])),
      store.dispatch(updateCycleTimeSettings([{ name: 'TODO', value: 'To do' }]));
    store.dispatch(updateTreatFlagCardAsBlock(false)),
      store.dispatch(
        updateDeploymentFrequencySettings({ updateId: 0, label: 'organization', value: 'mock new organization' }),
      );
    store.dispatch(
      updateDeploymentFrequencySettings({ updateId: 0, label: 'pipelineName', value: 'mock new pipelineName' }),
    );
    store.dispatch(updateDeploymentFrequencySettings({ updateId: 0, label: 'step', value: 'mock new step' }));
  });
};

describe('MetricsStepper', () => {
  beforeAll(() => server.listen());
  afterAll(() => server.close());
  beforeEach(() => {
    store = setupStore();
  });
  afterEach(() => {
    navigateMock.mockClear();
  });

  const setup = () =>
    render(
      <Provider store={store}>
        <MetricsStepper />
      </Provider>,
    );
  it('should show metrics stepper', () => {
    setup();

    STEPPER.map((label) => {
      expect(screen.getByText(label)).toBeInTheDocument();
    });

    expect(screen.getByText(NEXT)).toBeInTheDocument();
    expect(screen.getByText(PREVIOUS)).toBeInTheDocument();
  });

  it('should show metrics config step when click back button given config step ', async () => {
    setup();

    await userEvent.click(screen.getByText(PREVIOUS));

    expect(screen.getByText(PROJECT_NAME_LABEL)).toBeInTheDocument();
  });

  it('should show confirm dialog when click back button in config page', async () => {
    setup();

    await userEvent.click(screen.getByText(PREVIOUS));

    expect(screen.getByText(CONFIRM_DIALOG_DESCRIPTION)).toBeInTheDocument();
  });

  it('should close confirm dialog when click cancel button', async () => {
    setup();

    await userEvent.click(screen.getByText(PREVIOUS));
    await userEvent.click(screen.getByText(CANCEL));

    expect(screen.queryByText(CONFIRM_DIALOG_DESCRIPTION)).not.toBeInTheDocument();
  });

  it('should go to home page when click Yes button', async () => {
    setup();

    await userEvent.click(screen.getByText(PREVIOUS));

    expect(screen.getByText(YES)).toBeVisible();

    await userEvent.click(screen.getByText(YES));

    expect(navigateMock).toHaveBeenCalledTimes(1);
    expect(navigateMock).toHaveBeenCalledWith(BASE_PAGE_ROUTE);
  });

  it('should disable next when required data is empty ', async () => {
    setup();
    act(() => {
      store.dispatch(updateMetrics([]));
    });

    expect(screen.getByText(NEXT)).toBeDisabled();
  });

  it('should disable next when dataRange is empty ', async () => {
    setup();
    await fillConfigPageData();

    const startDateInput = screen.getByRole('textbox', { name: START_DATE_LABEL }) as HTMLInputElement;
    const endDateInput = screen.getByRole('textbox', { name: END_DATE_LABEL }) as HTMLInputElement;

    await userEvent.clear(startDateInput);
    await userEvent.clear(endDateInput);

    expect(screen.getByText(NEXT)).toBeDisabled();
  }, 50000);

  it('should disable next when endDate is empty ', async () => {
    setup();
    await fillConfigPageData();

    const endDateInput = screen.getByRole('textbox', { name: END_DATE_LABEL }) as HTMLInputElement;

    await userEvent.clear(endDateInput);

    expect(screen.getByText(NEXT)).toBeDisabled();
  });

  it('should enable next when every selected component is show and verified', async () => {
    setup();
    await fillConfigPageData();

    expect(screen.getByText(NEXT)).toBeEnabled();
  });

  it('should disable next when board component is exist but not verified successfully', async () => {
    setup();
    act(() => {
      store.dispatch(updateMetrics([VELOCITY]));
      store.dispatch(updateBoardVerifyState(false));
    });

    expect(screen.getByText(NEXT)).toBeDisabled();
  });

  it('should go metrics page when click next button given next button enabled', async () => {
    setup();

    await fillConfigPageData();
    fireEvent.click(screen.getByText(NEXT));

    expect(screen.getByText(METRICS)).toHaveStyle(`color:${stepperColor}`);
  });

  it('should show metrics export step when click next button given export step', async () => {
    setup();
    await fillConfigPageData();
    await userEvent.click(screen.getByText(NEXT));
    await fillMetricsPageDate();
    waitFor(() => {
      expect(screen.getByText(NEXT)).toBeInTheDocument();
    });

    waitFor(() => {
      expect(screen.getByText(NEXT)).not.toBeDisabled();
    });

    await userEvent.click(screen.getByText(NEXT));

    expect(screen.getByText(REPORT)).toHaveStyle(`color:${stepperColor}`);
  });

  it('should export json when click save button', async () => {
    const expectedFileName = 'config';
    const expectedJson = {
      board: undefined,
      calendarType: 'Regular Calendar(Weekend Considered)',
      dateRange: {
        endDate: null,
        startDate: null,
      },
      metrics: [],
      pipelineTool: undefined,
      projectName: '',
      sourceControl: undefined,
    };
    setup();

    await userEvent.click(screen.getByText(SAVE));

    expect(exportToJsonFile).toHaveBeenCalledWith(expectedFileName, expectedJson);
  });

  it('should export json when click save button when pipelineTool, sourceControl, and board is not empty', async () => {
    const expectedFileName = 'config';
    const expectedJson = {
      board: { boardId: '', email: '', site: '', token: '', type: 'Jira' },
      calendarType: 'Regular Calendar(Weekend Considered)',
      dateRange: {
        endDate: null,
        startDate: null,
      },
      metrics: ['Velocity'],
      pipelineTool: undefined,
      projectName: '',
      sourceControl: undefined,
    };

    setup();
    await fillMetricsData();

    await userEvent.click(screen.getByText(SAVE));

    expect(exportToJsonFile).toHaveBeenCalledWith(expectedFileName, expectedJson);
  });

  it('should export json file when click save button in metrics page given all content is empty', async () => {
    const expectedFileName = 'config';
    const expectedJson = {
      advancedSettings: null,
      assigneeFilter: ASSIGNEE_FILTER_TYPES.LAST_ASSIGNEE,
      board: { boardId: '', email: '', site: '', token: '', type: 'Jira' },
      calendarType: 'Regular Calendar(Weekend Considered)',
      dateRange: {
        endDate: dayjs().endOf('date').add(13, 'day').format('YYYY-MM-DDTHH:mm:ss.SSSZ'),
        startDate: dayjs().startOf('date').format('YYYY-MM-DDTHH:mm:ss.SSSZ'),
      },
      metrics: ['Velocity'],
      pipelineTool: undefined,
      projectName: 'test project Name',
      sourceControl: undefined,
      classification: undefined,
      crews: undefined,
      cycleTime: undefined,
      deployment: undefined,
      doneStatus: undefined,
      leadTime: undefined,
    };
    setup();

    await fillConfigPageData();
    await userEvent.click(screen.getByText(NEXT));
    await userEvent.click(screen.getByText(SAVE));

    expect(exportToJsonFile).toHaveBeenCalledWith(expectedFileName, expectedJson);
  }, 50000);

  it('should export json file when click save button in report page given all content is empty', async () => {
    const expectedFileName = 'config';
    const expectedJson = {
      advancedSettings: null,
      assigneeFilter: ASSIGNEE_FILTER_TYPES.LAST_ASSIGNEE,
      board: { boardId: '', email: '', site: '', token: '', type: 'Jira' },
      calendarType: 'Regular Calendar(Weekend Considered)',
      dateRange: {
        endDate: dayjs().endOf('date').add(13, 'day').format('YYYY-MM-DDTHH:mm:ss.SSSZ'),
        startDate: dayjs().startOf('date').format('YYYY-MM-DDTHH:mm:ss.SSSZ'),
      },
      metrics: ['Velocity'],
      pipelineTool: undefined,
      projectName: 'test project Name',
      sourceControl: undefined,
      classification: undefined,
      crews: undefined,
      cycleTime: undefined,
      deployment: undefined,
      doneStatus: undefined,
      leadTime: undefined,
    };

    setup();
    await fillConfigPageData();
    await userEvent.click(screen.getByText(NEXT));
    await fillMetricsPageDate();
    waitFor(() => {
      expect(screen.getByText(NEXT)).toBeInTheDocument();
    });
    await userEvent.click(screen.getByText(NEXT));

    await waitFor(() => {
      expect(screen.getByText(SAVE)).toBeInTheDocument();
    });
    await userEvent.click(screen.getByText(SAVE));

    await waitFor(() => {
      expect(exportToJsonFile).toHaveBeenCalledWith(expectedFileName, expectedJson);
    });
  }, 25000);

  it('should clean the config information that is hidden when click next button', async () => {
    setup();

    await fillConfigPageData();
    await userEvent.click(screen.getByText(NEXT));

    expect(updateBoard).not.toHaveBeenCalledWith({
      type: BOARD_TYPES.JIRA,
      boardId: '',
      email: '',
      projectKey: '',
      site: '',
      token: '',
      startTime: 0,
      endTime: 0,
    });
    expect(updateSourceControl).toHaveBeenCalledWith({ type: SOURCE_CONTROL_TYPES.GITHUB, token: '' });
    expect(updatePipelineTool).toHaveBeenCalledWith({ type: PIPELINE_TOOL_TYPES.BUILD_KITE, token: '' });
  }, 50000);
});
