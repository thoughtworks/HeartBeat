import { render, waitFor, within, screen } from '@testing-library/react';
import { setupStore } from '../../utils/setupStoreUtil';
import MetricsStep from '@src/containers/MetricsStep';
import { HttpResponse, http } from 'msw';
import { Provider } from 'react-redux';
import { setupServer } from 'msw/node';

import {
  CLASSIFICATION_SETTING,
  CREWS_SETTING,
  BOARD_MAPPING,
  CYCLE_TIME_SETTINGS_SECTION,
  DEPLOYMENT_FREQUENCY_SETTINGS,
  LIST_OPEN,
  MOCK_BUILD_KITE_GET_INFO_RESPONSE,
  MOCK_JIRA_VERIFY_RESPONSE,
  MOCK_PIPELINE_GET_INFO_URL,
  MOCK_BOARD_INFO_URL,
  REAL_DONE,
  REAL_DONE_SETTING_SECTION,
  REQUIRED_DATA_LIST,
  SELECT_CONSIDER_AS_DONE_MESSAGE,
} from '../../fixtures';
import {
  updateCycleTimeSettings,
  saveDoneColumn,
  setCycleTimeSettingsType,
  updateShouldGetBoardConfig,
} from '@src/context/Metrics/metricsSlice';
import { updateJiraVerifyResponse, updateMetrics } from '@src/context/config/configSlice';
import { closeAllNotifications } from '@src/context/notification/NotificationSlice';
import { backStep, nextStep } from '@src/context/stepper/StepperSlice';
import { CYCLE_TIME_SETTINGS_TYPES } from '@src/constants/resources';
import userEvent from '@testing-library/user-event';
import { HttpStatusCode } from 'axios';

jest.mock('@src/context/notification/NotificationSlice', () => ({
  ...jest.requireActual('@src/context/notification/NotificationSlice'),
  closeAllNotifications: jest.fn().mockReturnValue({ type: 'CLOSE_ALL_NOTIFICATIONS' }),
}));

let store = setupStore();
const server = setupServer(
  http.post(MOCK_PIPELINE_GET_INFO_URL, () => {
    return new HttpResponse(JSON.stringify(MOCK_BUILD_KITE_GET_INFO_RESPONSE), {
      status: HttpStatusCode.Ok,
    });
  }),
);

const setup = () =>
  render(
    <Provider store={store}>
      <MetricsStep />
    </Provider>,
  );

describe('MetricsStep', () => {
  beforeAll(() => server.listen());
  afterAll(() => server.close());

  beforeEach(() => {
    store = setupStore();
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  it('should render Crews when select velocity, and show Real done when have done column in Cycle time', async () => {
    store.dispatch(updateMetrics([REQUIRED_DATA_LIST[1]]));
    store.dispatch(
      updateCycleTimeSettings([
        { column: 'Testing', status: 'testing', value: 'Done' },
        { column: 'Testing', status: 'test', value: 'Done' },
      ]),
    );

    setup();

    expect(screen.getByText(CREWS_SETTING)).toBeInTheDocument();
    expect(screen.queryByText(BOARD_MAPPING)).toBeInTheDocument();
    expect(screen.queryByText(CLASSIFICATION_SETTING)).not.toBeInTheDocument();
    expect(screen.getByText(REAL_DONE)).toBeInTheDocument();
  });

  it('should not show Real done when only one value is done for cycle time', async () => {
    store.dispatch(updateMetrics([REQUIRED_DATA_LIST[1]]));
    store.dispatch(updateCycleTimeSettings([{ column: 'Testing', status: 'testing', value: 'Done' }]));
    setup();

    expect(screen.getByText(CREWS_SETTING)).toBeInTheDocument();
    expect(screen.queryByText(BOARD_MAPPING)).toBeInTheDocument();
    expect(screen.queryByText(CLASSIFICATION_SETTING)).not.toBeInTheDocument();
    expect(screen.queryByText(REAL_DONE)).not.toBeInTheDocument();
  });

  it('should show Cycle Time Settings when select cycle time in config page', async () => {
    await store.dispatch(updateMetrics([REQUIRED_DATA_LIST[2]]));
    setup();

    expect(screen.getByText(BOARD_MAPPING)).toBeInTheDocument();
  });

  it('should hide Real Done when no done column in cycleTime settings', async () => {
    await store.dispatch(updateCycleTimeSettings([{ column: 'Testing', status: 'testing', value: 'Block' }]));
    setup();

    expect(screen.queryByText(REAL_DONE)).not.toBeInTheDocument();
  });

  it('should show Classification Setting when select classification in config page', async () => {
    await store.dispatch(updateMetrics([REQUIRED_DATA_LIST[3]]));
    setup();

    expect(screen.getByText(CLASSIFICATION_SETTING)).toBeInTheDocument();
  });

  it('should show DeploymentFrequencySettings component when select deployment frequency in config page', async () => {
    await store.dispatch(updateMetrics([REQUIRED_DATA_LIST[5]]));
    setup();

    expect(screen.getByText(DEPLOYMENT_FREQUENCY_SETTINGS)).toBeInTheDocument();
  });

  it('should call closeAllNotifications', async () => {
    setup();

    expect(closeAllNotifications).toHaveBeenCalledTimes(1);
  });

  describe('with pre-filled cycle time data', () => {
    beforeEach(() => {
      const cycleTimeSettingsWithTwoDoneValue = [
        {
          column: 'To Do',
          status: 'BACKLOG',
          value: 'To Do',
        },
        {
          column: 'To Do',
          status: 'TO DO',
          value: 'To Do',
        },
        {
          column: 'To Do',
          status: 'GOING TO DO',
          value: 'To Do',
        },
        {
          column: 'In Progress',
          status: 'IN PROGRESS',
          value: 'Done',
        },
        {
          column: 'In Progress',
          status: 'IN DEV',
          value: 'Done',
        },
        {
          column: 'Block',
          status: 'BLOCK',
          value: 'Block',
        },
        {
          column: 'Test',
          status: 'TESTING',
          value: 'To do',
        },
        {
          column: 'Test',
          status: 'TO BE TESTED',
          value: 'To do',
        },
        {
          column: 'Done',
          status: 'PRE-DONE,',
          value: 'Done',
        },
        {
          column: 'Done',
          status: 'DONE',
          value: 'Done',
        },
        {
          column: 'Done',
          status: 'CANCEL',
          value: 'Done',
        },
      ];
      const doneColumn = ['IN PROGRESS', 'IN DEV', 'PRE-DONE', 'DONE', 'CANCEL'];
      const jiraColumns = [
        { key: 'indeterminate', value: { name: 'To Do', statuses: ['BACKLOG', 'TO DO', 'GOING TO DO'] } },
        { key: 'indeterminate', value: { name: 'In Progress', statuses: ['IN PROGRESS', 'IN DEV'] } },
        { key: 'indeterminate', value: { name: 'Block', statuses: ['BLOCK'] } },
        { key: 'indeterminate', value: { name: 'Test', statuses: ['TESTING', 'TO BE TESTED'] } },
        { key: 'done', value: { name: 'Done', statuses: ['PRE-DONE,', 'DONE', 'CANCEL'] } },
      ];

      store.dispatch(updateMetrics(REQUIRED_DATA_LIST));
      store.dispatch(updateCycleTimeSettings(cycleTimeSettingsWithTwoDoneValue));
      store.dispatch(saveDoneColumn(doneColumn));
      store.dispatch(
        updateJiraVerifyResponse({
          jiraColumns,
          users: MOCK_JIRA_VERIFY_RESPONSE.users,
        }),
      );
    });

    it('should reset real done when change Cycle time settings DONE to other status', async () => {
      server.use(
        http.post(MOCK_BOARD_INFO_URL, () => {
          return new HttpResponse(null, {
            status: HttpStatusCode.InternalServerError,
          });
        }),
      );
      setup();
      const realDoneSettingSection = screen.getByLabelText(REAL_DONE_SETTING_SECTION);

      expect(realDoneSettingSection).not.toHaveTextContent(SELECT_CONSIDER_AS_DONE_MESSAGE);
      const doneSelectTrigger = within(screen.getByLabelText('Cycle time select for Done')).getByRole('combobox');

      await userEvent.click(doneSelectTrigger as HTMLInputElement);

      const noneOption = within(screen.getAllByRole('presentation')[1]).getByText('----');
      await userEvent.click(noneOption);

      expect(realDoneSettingSection).toHaveTextContent(SELECT_CONSIDER_AS_DONE_MESSAGE);
    });

    it('should reset real done when change Cycle time settings other status to DONE', async () => {
      server.use(
        http.post(MOCK_BOARD_INFO_URL, () => {
          return new HttpResponse(null, {
            status: HttpStatusCode.InternalServerError,
          });
        }),
      );
      setup();
      const cycleTimeSettingsSection = screen.getByLabelText(CYCLE_TIME_SETTINGS_SECTION);
      const realDoneSettingSection = screen.getByLabelText(REAL_DONE_SETTING_SECTION);

      expect(realDoneSettingSection).not.toHaveTextContent(SELECT_CONSIDER_AS_DONE_MESSAGE);
      const columnsArray = within(cycleTimeSettingsSection).getAllByRole('button', { name: LIST_OPEN });

      await userEvent.click(columnsArray[2]);
      const options = within(screen.getByRole('listbox')).getAllByRole('option');
      await userEvent.click(options[options.length - 1]);

      await waitFor(() => expect(realDoneSettingSection).toHaveTextContent(SELECT_CONSIDER_AS_DONE_MESSAGE));
    });

    it('should hide real done when change all Cycle time settings to other status', async () => {
      setup();
      const cycleTimeSettingsSection = screen.getByLabelText(CYCLE_TIME_SETTINGS_SECTION);
      const realDoneSettingSection = screen.getByLabelText(REAL_DONE_SETTING_SECTION);

      expect(realDoneSettingSection).not.toHaveTextContent(SELECT_CONSIDER_AS_DONE_MESSAGE);
      const columnsArray = within(cycleTimeSettingsSection).getAllByRole('button', { name: LIST_OPEN });

      await userEvent.click(columnsArray[1]);

      const options1 = within(screen.getByRole('listbox')).getAllByRole('option');
      await userEvent.click(options1[1]);

      await userEvent.click(columnsArray[4]);

      const options2 = within(screen.getByRole('listbox')).getAllByRole('option');
      await userEvent.click(options2[1]);

      await waitFor(() => expect(realDoneSettingSection).not.toBeInTheDocument());
    });

    it('should hide Real Done when cycleTime settings type is by status', async () => {
      await store.dispatch(setCycleTimeSettingsType(CYCLE_TIME_SETTINGS_TYPES.BY_STATUS));
      const { queryByText } = setup();

      expect(queryByText(REAL_DONE)).not.toBeInTheDocument();
    });

    it('should not call closeAllNotifications given back step and shouldRefreshData is false', async () => {
      store.dispatch(backStep());
      setup();

      await waitFor(() => {
        expect(closeAllNotifications).not.toHaveBeenCalled();
      });
    });

    it('should call closeAllNotifications given next step and shouldRefreshData is false', async () => {
      store.dispatch(nextStep());
      setup();

      await waitFor(() => {
        expect(closeAllNotifications).toHaveBeenCalled();
      });
    });

    it('should be render no card container when get board card when no data', async () => {
      store.dispatch(updateShouldGetBoardConfig(true));
      server.use(
        http.post(MOCK_BOARD_INFO_URL, () => {
          return new HttpResponse(null, {
            status: HttpStatusCode.Ok,
          });
        }),
      );

      setup();

      await waitFor(() => {
        expect(screen.getByText('No card within selected date range!')).toBeInTheDocument();
      });
      expect(
        screen.getByText(
          'Please go back to the previous page and change your collection date, or check your board info!',
        ),
      ).toBeInTheDocument();
    });

    it('should be render failed message container when get 4xx error', async () => {
      store.dispatch(updateShouldGetBoardConfig(true));
      server.use(
        http.post(MOCK_BOARD_INFO_URL, () => {
          return new HttpResponse(null, {
            status: HttpStatusCode.BadRequest,
          });
        }),
      );

      setup();

      await waitFor(() => {
        expect(screen.getByText('Failed to get Board configuration!')).toBeInTheDocument();
      });
      expect(screen.getByText('Please go back to the previous page and check your board info!')).toBeInTheDocument();
    });

    it('should be render popup when get partial 4xx error', async () => {
      store.dispatch(updateShouldGetBoardConfig(true));

      setup();

      await waitFor(() => {
        expect(screen.getByText('Failed to get Board configuration!')).toBeInTheDocument();
      });
      expect(screen.getByText('Please go back to the previous page and check your board info!')).toBeInTheDocument();
    });

    it('should be render form container when got board card success', async () => {
      store.dispatch(updateShouldGetBoardConfig(true));
      const mockResponse = {
        ignoredTargetFields: [
          {
            key: 'description',
            name: 'Description',
            flag: false,
          },
          {
            key: 'customfield_10015',
            name: 'Start date',
            flag: false,
          },
        ],
        jiraColumns: [
          {
            key: 'To Do',
            value: {
              name: 'TODO',
              statuses: ['TODO'],
            },
          },
          {
            key: 'In Progress',
            value: {
              name: 'Doing',
              statuses: ['DOING'],
            },
          },
        ],
        targetFields: [
          {
            key: 'issuetype',
            name: 'Issue Type',
            flag: false,
          },
          {
            key: 'parent',
            name: 'Parent',
            flag: false,
          },
        ],
        users: [
          'heartbeat user',
          'Yunsong Yang',
          'Yufan Wang',
          'Weiran Sun',
          'Xuebing Li',
          'Junbo Dai',
          'Wenting Yan',
          'Xingmeng Tao',
        ],
      };
      server.use(
        http.post(MOCK_BOARD_INFO_URL, () => {
          return new HttpResponse(JSON.stringify(mockResponse), {
            status: HttpStatusCode.Ok,
          });
        }),
      );

      setup();

      await waitFor(() => {
        expect(screen.getByText(/crew settings/i)).toBeInTheDocument();
      });
      expect(screen.getByText(/board mappings/i)).toBeInTheDocument();
    });

    it('should show retry button when call get info timeout', async () => {
      store.dispatch(updateShouldGetBoardConfig(true));
      server.use(
        http.post(MOCK_BOARD_INFO_URL, () => {
          return HttpResponse.error();
        }),
      );
      setup();

      await waitFor(() => {
        expect(screen.getByText(/try again/i)).toBeInTheDocument();
      });
    });
  });
});
