import {
  updateCycleTimeSettings,
  saveDoneColumn,
  selectMetricsContent,
  setCycleTimeSettingsType,
  updateTreatFlagCardAsBlock,
} from '@src/context/Metrics/metricsSlice';
import { BOARD_MAPPING, ERROR_MESSAGE_TIME_DURATION, LIST_OPEN, NO_RESULT_DASH } from '../../fixtures';
import { CYCLE_TIME_SETTINGS_TYPES, MESSAGE, METRICS_CONSTANTS } from '@src/constants/resources';
import { act, render, screen, waitFor, within } from '@testing-library/react';
import { CycleTime } from '@src/containers/MetricsStep/CycleTime';
import { setupStore } from '../../utils/setupStoreUtil';
import userEvent from '@testing-library/user-event';
import { Provider } from 'react-redux';
import React from 'react';

const FlagAsBlock = 'Consider the "Flag" as "Block"';
const cycleTimeSettings = [
  {
    column: 'Doing',
    status: 'Analysis',
    value: 'Analysis',
  },
  {
    column: 'Doing',
    status: 'In Dev',
    value: 'Analysis',
  },
  {
    column: 'Doing',
    status: 'doing',
    value: 'Analysis',
  },
  {
    column: 'Testing',
    status: 'Test',
    value: 'Review',
  },
  {
    column: 'TODO',
    status: 'To do',
    value: '----',
  },
  {
    column: 'Done',
    status: 'done',
    value: 'Done',
  },
];
const cycleTimeTypeLabels = ['By Column', 'By Status'];
let store = setupStore();

jest.mock('@src/context/Metrics/metricsSlice', () => ({
  ...jest.requireActual('@src/context/Metrics/metricsSlice'),
  selectMetricsContent: jest.fn(),
  selectTreatFlagCardAsBlock: jest.fn().mockReturnValue(true),
  selectCycleTimeWarningMessage: jest.fn().mockReturnValue('Test warning Message'),
}));
const mockedUseAppDispatch = jest.fn();
jest.mock('@src/hooks/useAppDispatch', () => ({
  useAppDispatch: () => mockedUseAppDispatch,
}));

const setup = () =>
  render(
    <Provider store={store}>
      <CycleTime />
    </Provider>,
  );

describe('CycleTime', () => {
  beforeEach(() => {
    store = setupStore();
    (selectMetricsContent as jest.Mock).mockReturnValue({
      cycleTimeSettingsType: 'byColumn',
      cycleTimeSettings,
    });
  });

  afterEach(() => {
    jest.clearAllMocks();
    jest.useRealTimers();
  });

  describe('CycleTime Title', () => {
    it('should show Cycle Time title when render Crews component', () => {
      setup();
      expect(screen.getByText(BOARD_MAPPING)).toBeInTheDocument();
    });
    it('should show Cycle Time tooltip when render Crews component', () => {
      setup();
      expect(screen.getByTestId('InfoOutlinedIcon')).toBeInTheDocument();
    });
  });

  describe('CycleTime Selector List', () => {
    it('should show selectors title when render Crews component', () => {
      setup();

      expect(screen.getByText('ANALYSIS, IN DEV, DOING')).toBeInTheDocument();
      expect(screen.getByText('TEST')).toBeInTheDocument();
      expect(screen.getByText('TO DO')).toBeInTheDocument();
    });

    it('should always show board status column tooltip', async () => {
      setup();
      userEvent.hover(screen.getByText('ANALYSIS, IN DEV, DOING'));

      await waitFor(() => {
        expect(screen.getByRole('tooltip', { name: 'Analysis, In Dev, doing' })).toBeVisible();
      });
    });

    it('should show right input value when initializing', async () => {
      setup();
      const inputElements = screen.getAllByRole('combobox');
      const selectedInputValues = inputElements.map((input) => input.getAttribute('value'));

      expect(selectedInputValues).toEqual(['Analysis', 'Review', NO_RESULT_DASH, 'Done']);
    });

    it('should use default value when state value is null', () => {
      (selectMetricsContent as jest.Mock).mockReturnValue({
        cycleTimeSettingsType: 'byColumn',
        cycleTimeSettings: [
          {
            column: 'Doing',
            status: 'Analysis',
            value: null,
          },
        ],
      });
      setup();

      const inputElements = screen.getAllByRole('combobox');
      const selectedInputValues = inputElements.map((input) => input.getAttribute('value'));
      expect(selectedInputValues).toEqual([NO_RESULT_DASH]);
    });

    it('should show detail options when click included button', async () => {
      setup();
      const columnsArray = screen.getAllByRole('button', { name: LIST_OPEN });
      await act(async () => {
        await userEvent.click(columnsArray[0]);
      });
      const listBox = within(screen.getByRole('listbox'));
      const options = listBox.getAllByRole('option');
      const optionText = options.map((option) => option.textContent);

      const expectedOptions = [
        NO_RESULT_DASH,
        'To do',
        'Analysis',
        'In Dev',
        'Block',
        'Waiting for testing',
        'Testing',
        'Review',
        'Done',
      ];

      expectedOptions.forEach((expectedOption) => {
        expect(optionText).toContain(expectedOption);
      });
    });

    it('should show the right options when input the keyword to search', async () => {
      setup();
      const columnsArray = screen.getAllByRole('button', { name: LIST_OPEN });
      await act(async () => {
        await userEvent.type(columnsArray[0], 'Done');
      });
      const listBox = within(screen.getByRole('listbox'));
      const options = listBox.getAllByRole('option');
      const optionTexts = options.map((option) => option.textContent);

      const expectedOptions = ['Done'];

      expect(optionTexts).toEqual(expectedOptions);
    });

    it('should show no options when enter the wrong keyword', async () => {
      setup();
      const columnsArray = screen.getAllByRole('button', { name: LIST_OPEN });
      await act(async () => {
        await userEvent.type(columnsArray[0], 'wrong keyword');
      });

      expect(screen.getByText('No options')).toBeInTheDocument();
    });

    it('should show selected option when click the dropDown button ', async () => {
      setup();
      const columnsArray = screen.getAllByRole('button', { name: LIST_OPEN });
      await act(async () => {
        await userEvent.click(columnsArray[2]);
      });

      const listBox = within(screen.getByRole('listbox'));
      const options = listBox.getAllByRole('option');
      const selectedOption = options.find((option) => option.getAttribute('aria-selected') === 'true');

      const selectedOptionText = selectedOption?.textContent;

      expect(selectedOptionText).toBe(NO_RESULT_DASH);
    });

    it('should show other selections when change option and will not affect Real done', async () => {
      setup();
      const columnsArray = screen.getAllByRole('button', { name: LIST_OPEN });
      await act(async () => {
        await userEvent.click(columnsArray[2]);
      });

      const listBox = within(screen.getByRole('listbox'));
      const mockOptions = listBox.getAllByRole('option');
      await act(async () => {
        await userEvent.click(mockOptions[1]);
      });

      const inputElements = screen.getAllByRole('combobox');
      const selectedInputValue = inputElements.map((option) => option.getAttribute('value'))[2];

      expect(selectedInputValue).toBe('To do');
      await waitFor(() => expect(mockedUseAppDispatch).not.toHaveBeenCalledWith(saveDoneColumn([])));
    });

    it('should reset Real done when marked as done from other options', async () => {
      setup();
      const columnsArray = screen.getAllByRole('button', { name: LIST_OPEN });
      await act(async () => {
        await userEvent.click(columnsArray[0]);
      });

      const listBox = within(screen.getByRole('listbox'));
      await act(async () => {
        await userEvent.click(listBox.getAllByRole('option')[8]);
      });

      const inputElements = screen.getAllByRole('combobox');

      const selectedInputValue = inputElements.map((option) => option.getAttribute('value'))[0];

      expect(selectedInputValue).toBe('Done');
      await waitFor(() => expect(mockedUseAppDispatch).toHaveBeenCalledWith(saveDoneColumn([])));
    });

    it('should show the right selected value when cancel the done', async () => {
      setup();
      const columnsArray = screen.getAllByRole('button', { name: LIST_OPEN });
      await act(async () => {
        await userEvent.click(columnsArray[0]);
      });

      const listBox = within(screen.getByRole('listbox'));
      await act(async () => {
        await userEvent.click(listBox.getAllByRole('option')[8]);
      });

      await act(async () => {
        await userEvent.click(columnsArray[0]);
      });

      const newListBox = within(screen.getByRole('listbox'));
      await act(async () => {
        await userEvent.click(newListBox.getAllByRole('option')[7]);
      });

      const inputElements = screen.getAllByRole('combobox');
      const selectedInputValue = inputElements.map((option) => option.getAttribute('value'))[0];

      expect(selectedInputValue).toBe('Testing');
      await waitFor(() => expect(mockedUseAppDispatch).toHaveBeenCalledWith(saveDoneColumn([])));
    });
  });

  describe('CycleTime Flag as Block', () => {
    it('should show FlagAsBlock when render Crews component', () => {
      setup();
      expect(screen.getByText(FlagAsBlock)).toBeInTheDocument();
    });

    it('should be checked by default when initializing', () => {
      setup();
      expect(screen.getByRole('checkbox')).toHaveProperty('checked', true);
    });

    it('should change checked when click', async () => {
      setup();
      await act(async () => {
        await userEvent.click(screen.getByRole('checkbox'));
      });

      await waitFor(() => {
        expect(mockedUseAppDispatch).toHaveBeenCalledWith(updateTreatFlagCardAsBlock(false));
      });
    });
  });

  it('should show warning message when selectWarningMessage has a value in cycleTime component', () => {
    setup();

    expect(screen.getByText('Test warning Message')).toBeVisible();
  });

  it('should show disable warning message when selectWarningMessage has a value after two seconds in cycleTime component', async () => {
    jest.useFakeTimers();
    setup();

    act(() => {
      jest.advanceTimersByTime(ERROR_MESSAGE_TIME_DURATION);
    });

    await waitFor(() => {
      expect(screen.queryByText('Test warning Message')).not.toBeInTheDocument();
    });
  });

  it('should update cycle time type and clear table value when select status type', async () => {
    setup();
    await userEvent.click(screen.getByRole('radio', { name: cycleTimeTypeLabels[1] }));

    expect(mockedUseAppDispatch).toHaveBeenCalledTimes(4);
    expect(mockedUseAppDispatch).toHaveBeenCalledWith(setCycleTimeSettingsType(CYCLE_TIME_SETTINGS_TYPES.BY_STATUS));
    expect(mockedUseAppDispatch).toHaveBeenCalledWith(
      updateCycleTimeSettings(
        cycleTimeSettings.map((item) => ({
          ...item,
          value: METRICS_CONSTANTS.cycleTimeEmptyStr,
        })),
      ),
    );
    expect(mockedUseAppDispatch).toHaveBeenCalledWith(saveDoneColumn([]));
    expect(mockedUseAppDispatch).toHaveBeenCalledWith(updateTreatFlagCardAsBlock(true));
  });

  describe('cycle time by status', () => {
    beforeEach(() => {
      (selectMetricsContent as jest.Mock).mockReturnValue({
        cycleTimeSettingsType: 'byStatus',
        cycleTimeSettings,
      });
    });

    it('should show status mapping table when cycle time settings type by status', async () => {
      setup();

      expect(screen.getByText('ANALYSIS')).toBeInTheDocument();
      expect(screen.getByText('IN DEV')).toBeInTheDocument();
      expect(screen.getAllByText('DOING')[0]).toBeInTheDocument();
      expect(screen.getByText('TEST')).toBeInTheDocument();
      expect(screen.getByText('TO DO')).toBeInTheDocument();
    });

    it('should show selected option when click the dropDown button ', async () => {
      setup();
      const columnsArray = screen.getAllByRole('button', { name: LIST_OPEN });
      await userEvent.click(columnsArray[2]);

      const listBox = within(screen.getByRole('listbox'));
      const options = listBox.getAllByRole('option');
      const selectedOption = options.find((option) => option.getAttribute('aria-selected') === 'true');
      const selectedOptionText = selectedOption?.textContent;
      expect(selectedOptionText).toBe('Analysis');
    });

    it('should show other selections when change option and will not affect Real done', async () => {
      setup();
      const columnsArray = screen.getAllByRole('button', { name: LIST_OPEN });
      await userEvent.click(columnsArray[2]);
      const listBox = within(screen.getByRole('listbox'));
      const mockOptions = listBox.getAllByRole('option');
      await userEvent.click(mockOptions[1]);

      const inputElements = screen.getAllByRole('combobox');
      const selectedInputValue = inputElements.map((option) => option.getAttribute('value'))[2];
      expect(selectedInputValue).toBe('To do');
      expect(mockedUseAppDispatch).not.toHaveBeenCalledWith(saveDoneColumn([]));
    });

    it('should not reset Real done when marked as done from other options', async () => {
      setup();
      const columnsArray = screen.getAllByRole('button', { name: LIST_OPEN });
      await userEvent.click(columnsArray[0]);
      const listBox = within(screen.getByRole('listbox'));
      await userEvent.click(listBox.getAllByRole('option')[8]);

      const inputElements = screen.getAllByRole('combobox');
      const selectedInputValue = inputElements.map((option) => option.getAttribute('value'))[0];
      expect(selectedInputValue).toBe('Done');
      expect(mockedUseAppDispatch).not.toHaveBeenCalledWith(saveDoneColumn([]));
    });

    it('should show the correct selected value when cancel the done', async () => {
      setup();
      const columnsArray = screen.getAllByRole('button', { name: LIST_OPEN });
      await userEvent.click(columnsArray[0]);
      const listBox = within(screen.getByRole('listbox'));
      await userEvent.click(listBox.getAllByRole('option')[8]);
      await userEvent.click(columnsArray[0]);
      const newListBox = within(screen.getByRole('listbox'));
      await userEvent.click(newListBox.getAllByRole('option')[7]);

      const inputElements = screen.getAllByRole('combobox');
      const selectedInputValue = inputElements.map((option) => option.getAttribute('value'))[0];
      expect(selectedInputValue).toBe('Testing');
      expect(mockedUseAppDispatch).not.toHaveBeenCalledWith(saveDoneColumn([]));
    });
  });

  [CYCLE_TIME_SETTINGS_TYPES.BY_STATUS, CYCLE_TIME_SETTINGS_TYPES.BY_COLUMN].forEach((cycleTimeSettingsType) => {
    it('should show warning message given both mapping block column and add flag as block', () => {
      (selectMetricsContent as jest.Mock).mockReturnValue({
        cycleTimeSettingsType,
        cycleTimeSettings: [
          ...cycleTimeSettings,
          {
            column: 'Blocked',
            status: 'BLOCKED',
            value: 'Block',
          },
        ],
      });
      setup();

      expect(screen.getByText(MESSAGE.FLAG_CARD_DROPPED_WARNING)).toBeVisible();
    });
  });
});
