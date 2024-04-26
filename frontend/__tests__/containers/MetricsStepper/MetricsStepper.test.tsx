import {
  BASE_PAGE_ROUTE,
  CONFIRM_DIALOG_DESCRIPTION,
  DEFAULT_REWORK_SETTINGS,
  MOCK_REPORT_URL,
  NEXT,
  PREVIOUS,
  PROJECT_NAME_LABEL,
  SAVE,
  STEPPER,
  VERIFY,
  TEST_PROJECT_NAME,
  VELOCITY,
  COMMON_TIME_FORMAT,
  REQUIRED_DATA,
  MOCK_PIPELINE_VERIFY_URL,
  MOCK_BOARD_URL_FOR_JIRA,
} from '../../fixtures';
import {
  updateCycleTimeSettings,
  saveDoneColumn,
  saveTargetFields,
  saveUsers,
  updateDeploymentFrequencySettings,
  updateTreatFlagCardAsBlock,
} from '@src/context/Metrics/metricsSlice';
import { act, render, screen, waitFor, within } from '@testing-library/react';
import { ASSIGNEE_FILTER_TYPES } from '@src/constants/resources';
import { updateMetrics } from '@src/context/config/configSlice';
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

const START_DATE_LABEL = 'From';
const TODAY = dayjs();
const INPUT_DATE_VALUE = TODAY.format('MM/DD/YYYY');
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
    startToRequestData: jest.fn(),
    startToRequestDoraData: jest.fn(),
    stopPollingReports: jest.fn(),
    isServerError: false,
    errorMessage: '',
  }),
}));

const server = setupServer(
  rest.post(MOCK_REPORT_URL, (_, res, ctx) => res(ctx.status(HttpStatusCode.Ok))),
  rest.post(MOCK_BOARD_URL_FOR_JIRA, (_, res, ctx) => res(ctx.status(HttpStatusCode.NoContent))),
);

const mockLocation = { ...window.location, reload: jest.fn() };
Object.defineProperty(window, 'location', { value: mockLocation });

let store = setupStore();
const fillAndVerifyConfigPageData = async () => {
  const projectNameInput = await screen.findByRole('textbox', { name: PROJECT_NAME_LABEL });
  await userEvent.type(projectNameInput, TEST_PROJECT_NAME);
  const startDateInput = (await screen.findByRole('textbox', { name: START_DATE_LABEL })) as HTMLInputElement;
  await userEvent.type(startDateInput, INPUT_DATE_VALUE);
  await userEvent.click(screen.getByRole('combobox', { name: REQUIRED_DATA }));
  const requireMetricsSelection = within(screen.getByRole('listbox'));
  await userEvent.click(requireMetricsSelection.getByRole('option', { name: VELOCITY }));
  await userEvent.keyboard('{Escape}');
  const boardConfigModule = screen.getByLabelText('Board Config');

  expect(boardConfigModule).toBeInTheDocument();

  const boardIdInput = within(boardConfigModule).getByRole('textbox', { name: 'Board Id' });
  await userEvent.type(boardIdInput, '2');
  const emailInput = within(boardConfigModule).getByRole('textbox', { name: 'Email' });
  await userEvent.type(emailInput, 'user@test.com');
  const siteInput = within(boardConfigModule).getByRole('textbox', { name: 'Site' });
  await userEvent.type(siteInput, 'dorametrics');
  const tokenInput = within(boardConfigModule).getByLabelText('Token *');
  await userEvent.type(tokenInput, 'mockJiraToken');
  const verifyBoardButton = within(boardConfigModule).getByText(VERIFY);
  await userEvent.click(verifyBoardButton);

  await waitFor(() => {
    expect(screen.getByText(NEXT)).toBeEnabled();
  });
};

const fillMetricsData = () => {
  act(() => {
    store.dispatch(updateMetrics([VELOCITY]));
  });
};

const fillMetricsPageDate = async () => {
  await act(async () => {
    store.dispatch(saveTargetFields([{ name: 'mockClassification', key: 'mockClassification', flag: true }]));
    store.dispatch(saveUsers(['mockUsers']));
    store.dispatch(saveDoneColumn(['Done', 'Canceled']));
    store.dispatch(
      updateCycleTimeSettings([
        { column: 'Testing', status: 'testing', value: 'Done' },
        { column: 'Testing', status: 'test', value: 'Done' },
      ]),
    );
    store.dispatch(updateTreatFlagCardAsBlock(false));
    store.dispatch(
      updateDeploymentFrequencySettings({ updateId: 0, label: 'organization', value: 'mock new organization' }),
    );
    store.dispatch(
      updateDeploymentFrequencySettings({ updateId: 0, label: 'pipelineName', value: 'mock new pipelineName' }),
    );
    store.dispatch(updateDeploymentFrequencySettings({ updateId: 0, label: 'step', value: 'mock new step' }));
  });
};

beforeAll(() => server.listen({ onUnhandledRequest: 'error' }));
afterAll(() => server.close());
beforeEach(() => {
  store = setupStore();
});
afterEach(() => {
  server.resetHandlers();
  navigateMock.mockClear();
});

describe('MetricsStepper', () => {
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

  it('should enable next when every selected component is show and verified', async () => {
    server.use(rest.post(MOCK_PIPELINE_VERIFY_URL, (_, res, ctx) => res(ctx.status(HttpStatusCode.NoContent))));
    await act(async () => {
      setup();
    });
    await fillAndVerifyConfigPageData();
  });

  it('should disable next when board component is exist but not verified successfully', async () => {
    setup();
    act(() => {
      store.dispatch(updateMetrics([VELOCITY]));
    });

    expect(screen.getByText(NEXT)).toBeDisabled();
  });

  it('should go metrics page when click next button given next button enabled', async () => {
    await act(async () => {
      setup();
    });

    await fillAndVerifyConfigPageData();
    await userEvent.click(screen.getByText(NEXT));

    expect(screen.getByText(METRICS)).toHaveClass('Mui-active');
  });

  it('should show metrics export step when click next button given export step', async () => {
    await act(async () => {
      setup();
    });
    await fillAndVerifyConfigPageData();
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
      dateRange: [
        {
          endDate: null,
          startDate: null,
        },
      ],
      sortType: 'DEFAULT',
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
      dateRange: [
        {
          endDate: null,
          startDate: null,
        },
      ],
      sortType: 'DEFAULT',
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
      calendarType: 'Regular Calendar(Weekend Considered)',
      dateRange: [
        {
          endDate: dayjs().endOf('date').add(0, 'day').format(COMMON_TIME_FORMAT),
          startDate: dayjs().startOf('date').format(COMMON_TIME_FORMAT),
        },
      ],
      metrics: ['Velocity'],
      board: {
        type: 'Jira',
        boardId: '',
        email: '',
        site: '',
        token: '',
      },
      pipelineTool: undefined,
      sortType: 'DEFAULT',
      pipelineCrews: undefined,
      projectName: 'test project Name',
      sourceControl: undefined,
      classification: undefined,
      crews: undefined,
      cycleTime: undefined,
      deployment: undefined,
      doneStatus: undefined,
      leadTime: undefined,
      reworkTimesSettings: DEFAULT_REWORK_SETTINGS,
    };
    await act(() => {
      setup();
    });

    await fillAndVerifyConfigPageData();
    await userEvent.click(screen.getByText(NEXT));
    const saveButton = screen.getByText(SAVE);
    expect(screen.getByText(METRICS)).toHaveClass('Mui-active');

    waitFor(() => {
      expect(saveButton).toBeInTheDocument();
    });
    await userEvent.click(screen.getByText(SAVE));

    await waitFor(() => {
      expect(exportToJsonFile).toHaveBeenCalledWith(expectedFileName, expectedJson);
    });
  }, 50000);

  it('should export json file when click save button in report page given all content is empty', async () => {
    const expectedFileName = 'config';
    const expectedJson = {
      advancedSettings: null,
      assigneeFilter: ASSIGNEE_FILTER_TYPES.LAST_ASSIGNEE,
      board: { boardId: '', email: '', site: '', token: '', type: 'Jira' },
      calendarType: 'Regular Calendar(Weekend Considered)',
      dateRange: [
        {
          endDate: dayjs().endOf('date').add(0, 'day').format(COMMON_TIME_FORMAT),
          startDate: dayjs().startOf('date').format(COMMON_TIME_FORMAT),
        },
      ],
      metrics: ['Velocity'],
      pipelineCrews: undefined,
      pipelineTool: undefined,
      projectName: 'test project Name',
      sourceControl: undefined,
      classification: ['mockClassification'],
      crews: ['mockUsers'],
      sortType: 'DEFAULT',
      cycleTime: {
        jiraColumns: [
          {
            Testing: 'Done',
          },
        ],
        treatFlagCardAsBlock: false,
        type: 'byColumn',
      },
      deployment: undefined,
      doneStatus: ['Done', 'Canceled'],
      leadTime: undefined,
      reworkTimesSettings: {
        reworkState: null,
        excludeStates: [],
      },
    };

    await act(() => {
      setup();
    });
    await fillAndVerifyConfigPageData();
    await userEvent.click(screen.getByText(NEXT));

    expect(screen.getByText(METRICS)).toHaveClass('Mui-active');

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
});
