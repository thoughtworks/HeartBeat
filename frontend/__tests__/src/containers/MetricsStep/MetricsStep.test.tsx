import { act, render, renderHook, waitFor, within } from '@testing-library/react';
import { setupStore } from '../../utils/setupStoreUtil';
import MetricsStep from '@src/containers/MetricsStep';
import { Provider } from 'react-redux';
import { setupServer } from 'msw/node';
import { rest } from 'msw';

import {
  CLASSIFICATION_SETTING,
  CREWS_SETTING,
  CYCLE_TIME_SETTINGS,
  CYCLE_TIME_SETTINGS_SECTION,
  DEPLOYMENT_FREQUENCY_SETTINGS,
  LIST_OPEN,
  MOCK_JIRA_VERIFY_RESPONSE,
  REAL_DONE,
  REAL_DONE_SETTING_SECTION,
  REQUIRED_DATA_LIST,
  SELECT_CONSIDER_AS_DONE_MESSAGE,
  MOCK_PIPELINE_GET_INFO_URL,
  MOCK_BUILD_KITE_GET_INFO_RESPONSE,
} from '../../fixtures';
import { saveCycleTimeSettings, saveDoneColumn } from '@src/context/Metrics/metricsSlice';
import { updateJiraVerifyResponse, updateMetrics } from '@src/context/config/configSlice';
import { useNotificationLayoutEffect } from '@src/hooks/useNotificationLayoutEffect';
import userEvent from '@testing-library/user-event';

let store = setupStore();
const server = setupServer(
  rest.post(MOCK_PIPELINE_GET_INFO_URL, (req, res, ctx) =>
    res(ctx.status(200), ctx.body(JSON.stringify(MOCK_BUILD_KITE_GET_INFO_RESPONSE))),
  ),
);

beforeAll(() => server.listen());
afterAll(() => server.close());

const { result } = renderHook(() => useNotificationLayoutEffect());
const setup = () =>
  render(
    <Provider store={store}>
      <MetricsStep {...result.current} />
    </Provider>,
  );

describe('MetricsStep', () => {
  beforeEach(() => {
    store = setupStore();
  });

  const { result } = renderHook(() => useNotificationLayoutEffect());

  it('should render Crews when select velocity, and show Real done when have done column in Cycle time', async () => {
    store.dispatch(updateMetrics([REQUIRED_DATA_LIST[1]]));
    const { getByText, queryByText } = setup();

    expect(getByText(CREWS_SETTING)).toBeInTheDocument();
    expect(queryByText(CYCLE_TIME_SETTINGS)).not.toBeInTheDocument();
    expect(queryByText(CLASSIFICATION_SETTING)).not.toBeInTheDocument();

    act(() => {
      store.dispatch(saveCycleTimeSettings([{ name: 'Testing', value: 'Done' }]));
    });

    expect(getByText(REAL_DONE)).toBeInTheDocument();
  });

  it('should show Cycle Time Settings when select cycle time in config page', async () => {
    await store.dispatch(updateMetrics([REQUIRED_DATA_LIST[2]]));
    const { getByText } = setup();

    expect(getByText(CYCLE_TIME_SETTINGS)).toBeInTheDocument();
  });

  it('should hide Real Done when no done column in cycleTime settings', async () => {
    await store.dispatch(saveCycleTimeSettings([{ name: 'Testing', value: 'Block' }]));
    const { queryByText } = setup();

    expect(queryByText(REAL_DONE)).not.toBeInTheDocument();
  });

  it('should show Classification Setting when select classification in config page', async () => {
    await store.dispatch(updateMetrics([REQUIRED_DATA_LIST[3]]));
    const { getByText } = setup();

    expect(getByText(CLASSIFICATION_SETTING)).toBeInTheDocument();
  });

  it('should show DeploymentFrequencySettings component when select deployment frequency in config page', async () => {
    await store.dispatch(updateMetrics([REQUIRED_DATA_LIST[5]]));
    const { getByText } = setup();

    expect(getByText(DEPLOYMENT_FREQUENCY_SETTINGS)).toBeInTheDocument();
  });

  it('should call resetProps when resetProps is not undefined', async () => {
    act(() => {
      result.current.resetProps = jest.fn();
    });

    await waitFor(() =>
      render(
        <Provider store={store}>
          <MetricsStep {...result.current} />
        </Provider>,
      ),
    );

    expect(result.current.resetProps).toBeCalled();
  });

  describe('with pre-filled cycle time data', () => {
    beforeEach(() => {
      const cycleTimeSettingsWithTwoDoneValue = [
        {
          name: 'To Do',
          value: 'To Do',
        },
        {
          name: 'In Progress',
          value: 'Done',
        },
        {
          name: 'Block',
          value: 'Block',
        },
        {
          name: 'Test',
          value: 'To do',
        },
        {
          name: 'Done',
          value: 'Done',
        },
      ];
      const doneColumn = ['IN PROGRESS', 'IN DEV', 'PRE-DONE', 'DONE', 'CANCLE'];
      const jiraColumns = [
        { key: 'indeterminate', value: { name: 'To Do', statuses: ['BACKLOG', 'TO DO', 'GOING TO DO'] } },
        { key: 'indeterminate', value: { name: 'In Progress', statuses: ['IN PROGRESS', 'IN DEV'] } },
        { key: 'indeterminate', value: { name: 'Block', statuses: ['BLOCK'] } },
        { key: 'indeterminate', value: { name: 'Test', statuses: ['TESTING', 'TO BE TESTED'] } },
        { key: 'done', value: { name: 'Done', statuses: ['PRE-DONE,', 'DONE', 'CANCLE'] } },
      ];

      store.dispatch(updateMetrics(REQUIRED_DATA_LIST));
      store.dispatch(saveCycleTimeSettings(cycleTimeSettingsWithTwoDoneValue));
      store.dispatch(saveDoneColumn(doneColumn));
      store.dispatch(
        updateJiraVerifyResponse({
          jiraColumns,
          users: MOCK_JIRA_VERIFY_RESPONSE.users,
        }),
      );
    });

    it('should reset real done when change Cycle time settings DONE to other status', async () => {
      const { getByLabelText, getByRole } = setup();
      const realDoneSettingSection = getByLabelText(REAL_DONE_SETTING_SECTION);

      expect(realDoneSettingSection).not.toHaveTextContent(SELECT_CONSIDER_AS_DONE_MESSAGE);
      const doneSelectTrigger = within(getByLabelText('Cycle time select for Done')).getByRole('combobox');

      await userEvent.click(doneSelectTrigger as HTMLInputElement);

      const noneOption = within(getByRole('presentation')).getByText('----');
      await userEvent.click(noneOption);

      expect(realDoneSettingSection).toHaveTextContent(SELECT_CONSIDER_AS_DONE_MESSAGE);
    });

    it('should reset real done when change Cycle time settings other status to DONE', async () => {
      const { getByLabelText, getByRole } = setup();
      const cycleTimeSettingsSection = getByLabelText(CYCLE_TIME_SETTINGS_SECTION);
      const realDoneSettingSection = getByLabelText(REAL_DONE_SETTING_SECTION);

      expect(realDoneSettingSection).not.toHaveTextContent(SELECT_CONSIDER_AS_DONE_MESSAGE);
      const columnsArray = within(cycleTimeSettingsSection).getAllByRole('button', { name: LIST_OPEN });

      await userEvent.click(columnsArray[2]);
      const options = within(getByRole('listbox')).getAllByRole('option');
      await userEvent.click(options[options.length - 1]);

      await waitFor(() => expect(realDoneSettingSection).toHaveTextContent(SELECT_CONSIDER_AS_DONE_MESSAGE));
    });

    it('should hide real done when change all Cycle time settings to other status', async () => {
      const { getByLabelText, getByRole } = setup();
      const cycleTimeSettingsSection = getByLabelText(CYCLE_TIME_SETTINGS_SECTION);
      const realDoneSettingSection = getByLabelText(REAL_DONE_SETTING_SECTION);

      expect(realDoneSettingSection).not.toHaveTextContent(SELECT_CONSIDER_AS_DONE_MESSAGE);
      const columnsArray = within(cycleTimeSettingsSection).getAllByRole('button', { name: LIST_OPEN });

      await userEvent.click(columnsArray[1]);

      const options1 = within(getByRole('listbox')).getAllByRole('option');
      await userEvent.click(options1[1]);

      await userEvent.click(columnsArray[4]);

      const options2 = within(getByRole('listbox')).getAllByRole('option');
      await userEvent.click(options2[1]);

      await waitFor(() => expect(realDoneSettingSection).not.toBeInTheDocument());
    });
  });
});
