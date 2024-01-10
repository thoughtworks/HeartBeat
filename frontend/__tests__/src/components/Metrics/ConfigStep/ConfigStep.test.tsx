import { act, fireEvent, Matcher, render, waitFor, within } from '@testing-library/react';
import ConfigStep from '@src/components/Metrics/ConfigStep';
import {
  CHINA_CALENDAR,
  CONFIG_TITLE,
  CYCLE_TIME,
  ERROR_MESSAGE_TIME_DURATION,
  PROJECT_NAME_LABEL,
  REGULAR_CALENDAR,
  REQUIRED_DATA,
  RESET,
  TEST_PROJECT_NAME,
  VELOCITY,
  VERIFY,
} from '../../../fixtures';
import { Provider } from 'react-redux';
import { setupStore } from '../../../utils/setupStoreUtil';
import dayjs from 'dayjs';
import { fillBoardFieldsInformation } from './Board.test';

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
      </Provider>
    );
  };

  beforeEach(() => {
    jest.useFakeTimers();
  });

  afterEach(() => {
    store = null;
    jest.clearAllMocks();
    jest.useRealTimers();
  });

  it('should show project name when render configStep', () => {
    const { getByText } = setup();

    expect(getByText(PROJECT_NAME_LABEL)).toBeInTheDocument();
  });

  it('should show project name when input some letters', () => {
    const { getByRole, getByDisplayValue } = setup();
    const hasInputValue = (e: HTMLElement, inputValue: Matcher) => {
      return getByDisplayValue(inputValue) === e;
    };
    const input = getByRole('textbox', { name: PROJECT_NAME_LABEL });

    expect(input).toBeInTheDocument();

    fireEvent.change(input, { target: { value: TEST_PROJECT_NAME } });

    expect(hasInputValue(input, TEST_PROJECT_NAME)).toBe(true);
  });

  it('should show error message when project name is Empty', () => {
    const { getByRole, getByText } = setup();
    const input = getByRole('textbox', { name: PROJECT_NAME_LABEL });

    fireEvent.change(input, { target: { value: TEST_PROJECT_NAME } });
    fireEvent.change(input, { target: { value: '' } });

    expect(getByText('Project name is required')).toBeInTheDocument();
  });

  it('should show error message when click project name input with no letter', () => {
    const { getByRole, getByText } = setup();
    const input = getByRole('textbox', { name: PROJECT_NAME_LABEL });

    fireEvent.focus(input);

    expect(getByText('Project name is required')).toBeInTheDocument();
  });

  it('should select Regular calendar by default when rendering the radioGroup', () => {
    const { getByRole } = setup();
    const defaultValue = getByRole('radio', { name: REGULAR_CALENDAR });
    const chinaCalendar = getByRole('radio', { name: CHINA_CALENDAR });

    expect(defaultValue).toBeChecked();
    expect(chinaCalendar).not.toBeChecked();
  });

  it('should switch the radio when any radioLabel is selected', () => {
    const { getByRole } = setup();
    const chinaCalendar = getByRole('radio', { name: CHINA_CALENDAR });
    const regularCalendar = getByRole('radio', { name: REGULAR_CALENDAR });
    fireEvent.click(chinaCalendar);

    expect(chinaCalendar).toBeChecked();
    expect(regularCalendar).not.toBeChecked();

    fireEvent.click(regularCalendar);

    expect(regularCalendar).toBeChecked();
    expect(chinaCalendar).not.toBeChecked();
  });

  it('should not show board component when init ConfigStep component ', async () => {
    const { queryByText } = setup();

    await waitFor(() => {
      expect(queryByText(CONFIG_TITLE.BOARD)).toBeNull();
    });
  });

  it('should show board component when MetricsTypeCheckbox select Velocity,Cycle time', () => {
    const { getByRole, getAllByText } = setup();

    fireEvent.mouseDown(getByRole('button', { name: REQUIRED_DATA }));
    const requireDateSelection = within(getByRole('listbox'));
    fireEvent.click(requireDateSelection.getByRole('option', { name: VELOCITY }));
    fireEvent.click(requireDateSelection.getByRole('option', { name: CYCLE_TIME }));

    expect(getAllByText(CONFIG_TITLE.BOARD)[0]).toBeInTheDocument();
  });

  it('should show board component when MetricsTypeCheckbox select  Classification, ', () => {
    const { getByRole, getAllByText } = setup();

    fireEvent.mouseDown(getByRole('button', { name: REQUIRED_DATA }));
    const requireDateSelection = within(getByRole('listbox'));
    fireEvent.click(requireDateSelection.getByRole('option', { name: 'Classification' }));

    expect(getAllByText(CONFIG_TITLE.BOARD)[0]).toBeInTheDocument();
  });

  it('should verify again when calendar type is changed given board fields are filled and verified', () => {
    const { getByRole, getByText, queryByText } = setup();

    fireEvent.mouseDown(getByRole('button', { name: REQUIRED_DATA }));
    const requireDateSelection = within(getByRole('listbox'));
    fireEvent.click(requireDateSelection.getByRole('option', { name: VELOCITY }));
    fillBoardFieldsInformation();
    fireEvent.click(getByText(VERIFY));
    fireEvent.click(getByText(CHINA_CALENDAR));

    expect(queryByText(VERIFY)).toBeVisible();
    expect(queryByText('Verified')).toBeNull();
    expect(queryByText(RESET)).toBeNull();
  });

  it('should verify again when date picker is changed given board fields are filled and verified', () => {
    const { getByRole, getByText, queryByText, getByLabelText } = setup();
    const today = dayjs().format('MM/DD/YYYY');
    const startDateInput = getByLabelText('From *');

    fireEvent.mouseDown(getByRole('button', { name: REQUIRED_DATA }));
    const requireDateSelection = within(getByRole('listbox'));
    fireEvent.click(requireDateSelection.getByRole('option', { name: VELOCITY }));
    fillBoardFieldsInformation();
    fireEvent.click(getByText(VERIFY));
    fireEvent.change(startDateInput, { target: { value: today } });

    expect(queryByText(VERIFY)).toBeVisible();
    expect(queryByText('Verified')).toBeNull();
    expect(queryByText(RESET)).toBeNull();
  });

  it('should show warning message when selectWarningMessage has a value', async () => {
    const { getByText } = setup();

    expect(getByText('Test warning Message')).toBeVisible();
  });

  it('should show disable warning message When selectWarningMessage has a value after two seconds', async () => {
    const { queryByText } = setup();

    act(() => {
      jest.advanceTimersByTime(ERROR_MESSAGE_TIME_DURATION);
    });

    await waitFor(() => {
      expect(queryByText('Test warning Message')).not.toBeInTheDocument();
    });
  });
});
