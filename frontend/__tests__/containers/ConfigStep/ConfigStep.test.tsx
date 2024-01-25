import {
  CHINA_CALENDAR,
  CONFIG_TITLE,
  CYCLE_TIME,
  DEPLOYMENT_FREQUENCY,
  ERROR_MESSAGE_TIME_DURATION,
  MOCK_BOARD_URL_FOR_JIRA,
  MOCK_JIRA_VERIFY_RESPONSE,
  MOCK_PIPELINE_VERIFY_URL,
  PROJECT_NAME_LABEL,
  REGULAR_CALENDAR,
  REQUIRED_DATA,
  RESET,
  TEST_PROJECT_NAME,
  VELOCITY,
  VERIFY,
} from '../../fixtures';
import { act, fireEvent, Matcher, render, screen, waitFor, within } from '@testing-library/react';
import { fillBoardFieldsInformation } from './Board.test';
import { setupStore } from '../../utils/setupStoreUtil';
import ConfigStep from '@src/containers/ConfigStep';
import { Provider } from 'react-redux';
import { setupServer } from 'msw/node';
import { rest } from 'msw';
import React from 'react';
import dayjs from 'dayjs';

const server = setupServer(
  rest.post(MOCK_PIPELINE_VERIFY_URL, (req, res, ctx) => res(ctx.status(204))),
  rest.post(MOCK_BOARD_URL_FOR_JIRA, (req, res, ctx) =>
    res(ctx.status(200), ctx.body(JSON.stringify(MOCK_JIRA_VERIFY_RESPONSE))),
  ),
);

let store = null;
jest.mock('@src/context/config/configSlice', () => ({
  ...jest.requireActual('@src/context/config/configSlice'),
  selectWarningMessage: jest.fn().mockReturnValue('Test warning Message'),
}));
describe('ConfigStep', () => {
  const setup = () => {
    store = setupStore();
    return render(
      <Provider store={store}>
        <ConfigStep />
      </Provider>,
    );
  };

  beforeAll(() => server.listen());

  beforeEach(() => {
    jest.useFakeTimers();
  });

  afterEach(() => {
    store = null;
    jest.clearAllMocks();
    jest.useRealTimers();
  });

  afterAll(() => server.close());

  it('should show project name when render configStep', () => {
    setup();

    expect(screen.getByText(PROJECT_NAME_LABEL)).toBeInTheDocument();
  });

  it('should show project name when input some letters', () => {
    setup();
    const hasInputValue = (e: HTMLElement, inputValue: Matcher) => {
      return screen.getByDisplayValue(inputValue) === e;
    };
    const input = screen.getByRole('textbox', { name: PROJECT_NAME_LABEL });

    expect(input).toBeInTheDocument();

    fireEvent.change(input, { target: { value: TEST_PROJECT_NAME } });

    expect(hasInputValue(input, TEST_PROJECT_NAME)).toBe(true);
  });

  it('should show error message when project name is Empty', () => {
    setup();
    const input = screen.getByRole('textbox', { name: PROJECT_NAME_LABEL });

    fireEvent.change(input, { target: { value: TEST_PROJECT_NAME } });
    fireEvent.change(input, { target: { value: '' } });

    expect(screen.getByText('Project name is required')).toBeInTheDocument();
  });

  it('should show error message when click project name input with no letter', () => {
    setup();
    const input = screen.getByRole('textbox', { name: PROJECT_NAME_LABEL });

    fireEvent.focus(input);

    expect(screen.getByText('Project name is required')).toBeInTheDocument();
  });

  it('should select Regular calendar by default when rendering the radioGroup', () => {
    setup();
    const defaultValue = screen.getByRole('radio', { name: REGULAR_CALENDAR });
    const chinaCalendar = screen.getByRole('radio', { name: CHINA_CALENDAR });

    expect(defaultValue).toBeChecked();
    expect(chinaCalendar).not.toBeChecked();
  });

  it('should switch the radio when any radioLabel is selected', () => {
    setup();
    const chinaCalendar = screen.getByRole('radio', { name: CHINA_CALENDAR });
    const regularCalendar = screen.getByRole('radio', { name: REGULAR_CALENDAR });
    fireEvent.click(chinaCalendar);

    expect(chinaCalendar).toBeChecked();
    expect(regularCalendar).not.toBeChecked();

    fireEvent.click(regularCalendar);

    expect(regularCalendar).toBeChecked();
    expect(chinaCalendar).not.toBeChecked();
  });

  it('should not show board component when init ConfigStep component ', async () => {
    setup();

    await waitFor(() => {
      expect(screen.queryByText(CONFIG_TITLE.BOARD)).toBeNull();
    });
  });

  it('should show board component when MetricsTypeCheckbox select Velocity,Cycle time', () => {
    setup();

    fireEvent.mouseDown(screen.getByRole('button', { name: REQUIRED_DATA }));
    const requireDateSelection = within(screen.getByRole('listbox'));
    fireEvent.click(requireDateSelection.getByRole('option', { name: VELOCITY }));
    fireEvent.click(requireDateSelection.getByRole('option', { name: CYCLE_TIME }));

    expect(screen.getAllByText(CONFIG_TITLE.BOARD)[0]).toBeInTheDocument();
  });

  it('should show board component when MetricsTypeCheckbox select  Classification, ', () => {
    setup();

    fireEvent.mouseDown(screen.getByRole('button', { name: REQUIRED_DATA }));
    const requireDateSelection = within(screen.getByRole('listbox'));
    fireEvent.click(requireDateSelection.getByRole('option', { name: 'Classification' }));

    expect(screen.getAllByText(CONFIG_TITLE.BOARD)[0]).toBeInTheDocument();
  });

  it('should verify again when calendar type is changed given board fields are filled and verified', () => {
    setup();

    fireEvent.mouseDown(screen.getByRole('button', { name: REQUIRED_DATA }));
    const requireDateSelection = within(screen.getByRole('listbox'));
    fireEvent.click(requireDateSelection.getByRole('option', { name: VELOCITY }));
    fillBoardFieldsInformation();
    fireEvent.click(screen.getByText(VERIFY));
    fireEvent.click(screen.getByText(CHINA_CALENDAR));

    expect(screen.queryByText(VERIFY)).toBeVisible();
    expect(screen.queryByText('Verified')).toBeNull();
    expect(screen.queryByText(RESET)).toBeNull();
  });

  it('should verify again when date picker is changed given board fields are filled and verified', () => {
    setup();
    const today = dayjs().format('MM/DD/YYYY');
    const startDateInput = screen.getByLabelText('From *');

    fireEvent.mouseDown(screen.getByRole('button', { name: REQUIRED_DATA }));
    const requireDateSelection = within(screen.getByRole('listbox'));
    fireEvent.click(requireDateSelection.getByRole('option', { name: VELOCITY }));
    fillBoardFieldsInformation();
    fireEvent.click(screen.getByText(VERIFY));
    fireEvent.change(startDateInput, { target: { value: today } });

    expect(screen.queryByText(VERIFY)).toBeVisible();
    expect(screen.queryByText('Verified')).toBeNull();
    expect(screen.queryByText(RESET)).toBeNull();
  });

  it('should show warning message when selectWarningMessage has a value', async () => {
    setup();

    expect(screen.getByText('Test warning Message')).toBeVisible();
  });

  it('should show disable warning message When selectWarningMessage has a value after two seconds', async () => {
    setup();

    act(() => {
      jest.advanceTimersByTime(ERROR_MESSAGE_TIME_DURATION);
    });

    await waitFor(() => {
      expect(screen.queryByText('Test warning Message')).not.toBeInTheDocument();
    });
  });

  it('should not verify again when collection-date or date-picker is changed given pipeline token is filled and verified', async () => {
    const wrapper = setup();
    const mockToken = 'bkua_mockTokenMockTokenMockTokenMockToken1234';
    const today = dayjs().format('MM/DD/YYYY');
    const startDateInput = wrapper.getByLabelText('From *');

    const requiredMetricsField = wrapper.getByRole('button', { name: REQUIRED_DATA });
    fireEvent.mouseDown(requiredMetricsField);
    const requireDateSelection = within(wrapper.getByRole('listbox'));
    fireEvent.click(requireDateSelection.getByRole('option', { name: DEPLOYMENT_FREQUENCY }));

    const tokenNode = within(wrapper.getByTestId('pipelineToolTextField')).getByLabelText('input Token');

    fireEvent.change(tokenNode, { target: { value: mockToken } });

    const submitButton = wrapper.getByText(VERIFY);
    fireEvent.click(submitButton);

    fireEvent.change(startDateInput, { target: { value: today } });

    await waitFor(() => {
      expect(wrapper.queryByText(VERIFY)).toBeNull();
      expect(wrapper.queryByText('Verified')).toBeVisible();
      expect(wrapper.queryByText(RESET)).toBeVisible();
    });
  });
});
