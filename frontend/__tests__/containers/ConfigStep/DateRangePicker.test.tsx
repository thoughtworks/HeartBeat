import { updateShouldGetBoardConfig, updateShouldGetPipelineConfig } from '@src/context/Metrics/metricsSlice';
import { SortedDateRangeType, sortFn, SortType } from '@src/containers/ConfigStep/DateRangePicker/types';
import { basicInfoDefaultValues } from '@src/containers/ConfigStep/Form/useDefaultValues';
import { DateRangePickerSection } from '@src/containers/ConfigStep/DateRangePicker';
import { basicInfoSchema } from '@src/containers/ConfigStep/Form/schema';
import { ERROR_DATE, TIME_RANGE_ERROR_MESSAGE } from '../../fixtures';
import { render, screen, within } from '@testing-library/react';
import { setupStore } from '../../utils/setupStoreUtil';
import { FormProvider } from '@test/utils/FormProvider';
import userEvent from '@testing-library/user-event';
import { ThemeProvider } from '@mui/material';
import { Provider } from 'react-redux';
import sortBy from 'lodash/sortBy';
import { theme } from '@src/theme';
import get from 'lodash/get';
import React from 'react';
import dayjs from 'dayjs';

const START_DATE_LABEL = 'From';
const END_DATE_LABEL = 'To';
const TODAY = dayjs('2024-03-20');
const INPUT_DATE_VALUE = TODAY.format('MM/DD/YYYY');
let store = setupStore();

jest.mock('@src/context/Metrics/metricsSlice', () => ({
  ...jest.requireActual('@src/context/Metrics/metricsSlice'),
  updateShouldGetBoardConfig: jest.fn().mockReturnValue({ type: 'SHOULD_UPDATE_BOARD_CONFIG' }),
  updateShouldGetPipelineConfig: jest.fn().mockReturnValue({ type: 'SHOULD_UPDATE_PIPELINE_CONFIG' }),
  initDeploymentFrequencySettings: jest.fn().mockReturnValue({ type: 'INIT_DEPLOYMENT_SETTINGS' }),
  saveUsers: jest.fn().mockReturnValue({ type: 'SAVE_USERS' }),
}));

const setup = () => {
  store = setupStore();
  return render(
    <Provider store={store}>
      <ThemeProvider theme={theme}>
        <FormProvider schema={basicInfoSchema} defaultValues={basicInfoDefaultValues}>
          <DateRangePickerSection />
        </FormProvider>
      </ThemeProvider>
    </Provider>,
  );
};

describe('DateRangePickerSection', () => {
  beforeEach(() => {
    setup();
  });
  describe('Single range behaviors', () => {
    const expectDate = (inputDate: HTMLInputElement) => {
      expect(inputDate.value).toEqual(expect.stringContaining(TODAY.date().toString()));
      expect(inputDate.value).toEqual(expect.stringContaining((TODAY.month() + 1).toString()));
      expect(inputDate.value).toEqual(expect.stringContaining(TODAY.year().toString()));
    };

    it('should render DateRangePicker', () => {
      expect(screen.queryAllByText(START_DATE_LABEL)).toHaveLength(1);
      expect(screen.queryAllByText(END_DATE_LABEL)).toHaveLength(1);
    });

    it('should show right start date when input a valid date given init start date is null ', async () => {
      const startDateInput = screen.getByRole('textbox', { name: START_DATE_LABEL }) as HTMLInputElement;
      await userEvent.type(startDateInput, INPUT_DATE_VALUE);

      expectDate(startDateInput);
    });

    it('should show right end date when input a valid date given init end date is null ', async () => {
      const endDateInput = screen.getByRole('textbox', { name: END_DATE_LABEL }) as HTMLInputElement;

      await userEvent.type(endDateInput, INPUT_DATE_VALUE);
      expectDate(endDateInput);
    });

    it('should Auto-fill endDate which is after startDate 13 days when fill right startDate ', async () => {
      const endDate = TODAY.add(13, 'day');
      const startDateInput = screen.getByRole('textbox', { name: START_DATE_LABEL }) as HTMLInputElement;
      const endDateInput = screen.getByRole('textbox', { name: END_DATE_LABEL }) as HTMLInputElement;
      await userEvent.type(startDateInput, INPUT_DATE_VALUE);

      expect(endDateInput.value).toEqual(expect.stringContaining(endDate.date().toString()));
      expect(endDateInput.value).toEqual(expect.stringContaining((endDate.month() + 1).toString()));
      expect(endDateInput.value).toEqual(expect.stringContaining(endDate.year().toString()));
    });

    it('should Auto-clear endDate when its corresponding startDate is cleared ', async () => {
      const addButton = screen.getByLabelText('Button for adding date range');
      await userEvent.click(addButton);
      const rangeDate1 = ['03/01/2024', '03/10/2024'];
      const ranges = screen.getAllByLabelText('Range picker row');
      const startDateInput = within(ranges[1]).getByRole('textbox', { name: START_DATE_LABEL }) as HTMLInputElement;
      const endDateInput = within(ranges[1]).getByRole('textbox', { name: END_DATE_LABEL }) as HTMLInputElement;
      await userEvent.type(startDateInput, rangeDate1[0]);
      await userEvent.type(endDateInput, rangeDate1[1]);
      await userEvent.clear(startDateInput);

      expect(endDateInput.value).toEqual('');
    });

    it('should not auto change startDate when its corresponding endDate changes ', async () => {
      const startDateInput = screen.getByRole('textbox', { name: START_DATE_LABEL }) as HTMLInputElement;
      const endDateInput = screen.getByRole('textbox', { name: END_DATE_LABEL }) as HTMLInputElement;
      const startDate = dayjs('2024-03-20').format('MM/DD/YYYY');
      const endDate = dayjs('2024-03-21').format('MM/DD/YYYY');

      await userEvent.type(startDateInput, startDate);
      await userEvent.type(endDateInput, endDate);
      await userEvent.clear(endDateInput);

      expect(startDateInput.value).toEqual('03/20/2024');
    });

    it('should not Auto-fill endDate which is after startDate 14 days when fill wrong format startDate ', async () => {
      const startDateInput = screen.getByRole('textbox', { name: START_DATE_LABEL }) as HTMLInputElement;
      const endDateInput = screen.getByRole('textbox', { name: END_DATE_LABEL }) as HTMLInputElement;
      await userEvent.type(startDateInput, ERROR_DATE);

      expect(startDateInput.valueAsDate).toEqual(null);
      expect(endDateInput.valueAsDate).toEqual(null);
    });

    it('should dispatch update configuration when change startDate', async () => {
      const startDateInput = screen.getByRole('textbox', { name: START_DATE_LABEL }) as HTMLInputElement;
      await userEvent.type(startDateInput, INPUT_DATE_VALUE);

      expect(updateShouldGetBoardConfig).toHaveBeenCalledWith(true);
      expect(updateShouldGetPipelineConfig).toHaveBeenCalledWith(true);
    });

    it('should dispatch update configuration when change endDate', async () => {
      const endDateInput = screen.getByRole('textbox', { name: END_DATE_LABEL }) as HTMLInputElement;
      await userEvent.type(endDateInput, INPUT_DATE_VALUE);

      expect(updateShouldGetBoardConfig).toHaveBeenCalledWith(true);
      expect(updateShouldGetPipelineConfig).toHaveBeenCalledWith(true);
    });
  });

  describe('Multiple range amount behaviors', () => {
    it('should not show remove button given there is only one range by default', () => {
      const removeButton = screen.queryByRole('button', { name: 'Remove' });
      const ranges = screen.getAllByLabelText('Range picker row');

      expect(removeButton).not.toBeInTheDocument();
      expect(ranges).toHaveLength(1);
    });

    it('should allow user to add up to 6 ranges', async () => {
      const addButton = screen.getByLabelText('Button for adding date range');
      const defaultRanges = screen.getAllByLabelText('Range picker row');

      expect(defaultRanges).toHaveLength(1);

      await Promise.all(new Array(5).fill(true).map(async () => await userEvent.click(addButton)));
      const ranges = screen.getAllByLabelText('Range picker row');

      expect(ranges).toHaveLength(6);
      expect(addButton).toBeDisabled();
    });

    it('should show remove button when ranges are more than 1 and user is able to remove the range itself by clicking the remove button within that row', async () => {
      const addButton = screen.getByLabelText('Button for adding date range');
      await userEvent.click(addButton);
      const ranges = screen.getAllByLabelText('Range picker row');

      expect(ranges).toHaveLength(2);

      ranges.forEach((range) => {
        const removeButtonForThisRange = within(range).queryByRole('button', { name: 'Remove' });
        expect(removeButtonForThisRange).toBeVisible();
      });

      const firstRemoveButton = within(ranges[0]).queryByRole('button', { name: 'Remove' }) as HTMLButtonElement;
      await userEvent.click(firstRemoveButton);
      const currentRanges = screen.getAllByLabelText('Range picker row');

      expect(currentRanges).toHaveLength(1);
    });

    it('should dispatch update configuration when remove the range', async () => {
      const addButton = screen.getByLabelText('Button for adding date range');
      await userEvent.click(addButton);
      const ranges = screen.getAllByLabelText('Range picker row');

      expect(ranges).toHaveLength(2);

      const firstRemoveButton = within(ranges[0]).queryByRole('button', { name: 'Remove' }) as HTMLButtonElement;
      await userEvent.click(firstRemoveButton);
      const currentRanges = screen.getAllByLabelText('Range picker row');

      expect(currentRanges).toHaveLength(1);

      expect(updateShouldGetBoardConfig).toHaveBeenCalledWith(true);
      expect(updateShouldGetPipelineConfig).toHaveBeenCalledWith(true);
    });
  });

  describe('Multiple ranges date interactions', () => {
    it('should auto fill end date when change star date by cloeset earliest date of other ranges', async () => {
      const rangeDate1 = ['03/12/2024', '03/25/2024'];
      const rangeDate2 = ['03/08/2024'];

      const addButton = screen.getByLabelText('Button for adding date range');
      await userEvent.click(addButton);
      const ranges = screen.getAllByLabelText('Range picker row');
      const startDate1Input = within(ranges[0]).getByRole('textbox', { name: START_DATE_LABEL }) as HTMLInputElement;
      const endDate1Input = within(ranges[0]).getByRole('textbox', { name: END_DATE_LABEL }) as HTMLInputElement;
      await userEvent.type(startDate1Input, rangeDate1[0]);
      await userEvent.type(endDate1Input, rangeDate1[1]);
      await userEvent.click(addButton);
      const range2 = screen.getAllByLabelText('Range picker row')[1];
      const startDate2Input = within(range2).getByRole('textbox', { name: START_DATE_LABEL }) as HTMLInputElement;
      await userEvent.type(startDate2Input, rangeDate2[0]);
      const endDate2Input = within(range2).getByRole('textbox', { name: END_DATE_LABEL }) as HTMLInputElement;

      expect(endDate2Input.value).toEqual('03/11/2024');
    });

    it('should display error message for start-date and end-date respectively when time ranges conflict', async () => {
      const rangeDate1 = ['03/12/2024', '03/25/2024'];
      const rangeDate2 = ['03/08/2024', '03/26/2024'];

      const addButton = screen.getByLabelText('Button for adding date range');
      await userEvent.click(addButton);
      await userEvent.click(addButton);
      const ranges = screen.getAllByLabelText('Range picker row');
      const startDate1Input = within(ranges[0]).getByRole('textbox', { name: START_DATE_LABEL }) as HTMLInputElement;
      const endDate1Input = within(ranges[0]).getByRole('textbox', { name: END_DATE_LABEL }) as HTMLInputElement;
      const startDate2Input = within(ranges[1]).getByRole('textbox', { name: START_DATE_LABEL }) as HTMLInputElement;
      const endDate12nput = within(ranges[1]).getByRole('textbox', { name: END_DATE_LABEL }) as HTMLInputElement;
      await userEvent.type(startDate1Input, rangeDate1[0]);
      await userEvent.type(endDate1Input, rangeDate1[1]);
      await userEvent.type(startDate2Input, rangeDate2[0]);
      await userEvent.type(endDate12nput, rangeDate2[1]);

      expect(screen.getByText(TIME_RANGE_ERROR_MESSAGE.START_DATE_INVALID_TEXT)).toBeVisible();
      expect(screen.getByText(TIME_RANGE_ERROR_MESSAGE.END_DATE_INVALID_TEXT)).toBeVisible();
    });

    it('should provide unified error message when given all invalid time input', async () => {
      const correctRange = ['03/15/2024', '03/25/2024'];
      const rangeOfTooEarly = ['03/15/1899', '03/25/1898'];
      const rangeOfInvalidFormat = ['XXxYY/2024', 'ZZ/11/2024'];
      const startDateRequiredErrorMessage = 'Start date is required';
      const endDateRequiredErrorMessage = 'End date is required';
      const unifiedStartDateErrorMessage = 'Start date is invalid';
      const unifiedEndDateErrorMessage = 'End date is invalid';

      const ranges = screen.getAllByLabelText('Range picker row');
      const startDateInput = within(ranges[0]).getByRole('textbox', { name: START_DATE_LABEL }) as HTMLInputElement;
      const endDateInput = within(ranges[0]).getByRole('textbox', { name: END_DATE_LABEL }) as HTMLInputElement;
      await userEvent.type(startDateInput, rangeOfTooEarly[0]);
      await userEvent.type(endDateInput, rangeOfTooEarly[1]);

      expect(await screen.findByText(unifiedStartDateErrorMessage)).toBeVisible();
      expect(await screen.findByText(unifiedEndDateErrorMessage)).toBeVisible();

      await userEvent.clear(startDateInput);
      await userEvent.clear(endDateInput);
      await userEvent.keyboard('{Tab}');

      expect(await screen.findByText(startDateRequiredErrorMessage)).toBeVisible();
      expect(await screen.findByText(endDateRequiredErrorMessage)).toBeVisible();

      await userEvent.type(startDateInput, correctRange[0]);
      await userEvent.type(endDateInput, correctRange[1]);

      expect(screen.queryByText(startDateRequiredErrorMessage)).toBeNull();
      expect(screen.queryByText(endDateRequiredErrorMessage)).toBeNull();
      expect(screen.queryByText(unifiedStartDateErrorMessage)).toBeNull();
      expect(screen.queryByText(unifiedEndDateErrorMessage)).toBeNull();

      await userEvent.type(startDateInput, rangeOfInvalidFormat[0]);
      await userEvent.type(endDateInput, rangeOfInvalidFormat[1]);

      expect(screen.queryByText(startDateRequiredErrorMessage)).toBeNull();
      expect(screen.queryByText(endDateRequiredErrorMessage)).toBeNull();
      expect(screen.queryByText(unifiedStartDateErrorMessage)).toBeVisible();
      expect(screen.queryByText(unifiedEndDateErrorMessage)).toBeVisible();
    });
  });

  describe('Sort date range behaviors', () => {
    it('should not show sort button given only one date range', async () => {
      const rangeDate1 = ['03/15/2024', '03/25/2024'];
      const ranges = screen.getAllByLabelText('Range picker row');
      const startDate1Input = within(ranges[0]).getByRole('textbox', { name: START_DATE_LABEL }) as HTMLInputElement;
      const endDate1Input = within(ranges[0]).getByRole('textbox', { name: END_DATE_LABEL }) as HTMLInputElement;
      await userEvent.type(startDate1Input, rangeDate1[0]);
      await userEvent.type(endDate1Input, rangeDate1[1]);
      const sortButtonContainer = screen.queryByLabelText('Sorting date range');
      expect(sortButtonContainer).toBeNull();
    });

    it('should show sort button given more than one time range', async () => {
      const rangeDate1 = ['03/15/2024', '03/25/2024'];
      const rangeDate2 = ['03/08/2024', '03/11/2024'];

      const addButton = screen.getByLabelText('Button for adding date range');
      await userEvent.click(addButton);
      const ranges = screen.getAllByLabelText('Range picker row');
      const startDate1Input = within(ranges[0]).getByRole('textbox', { name: START_DATE_LABEL }) as HTMLInputElement;
      const endDate1Input = within(ranges[0]).getByRole('textbox', { name: END_DATE_LABEL }) as HTMLInputElement;
      const startDate2Input = within(ranges[1]).getByRole('textbox', { name: START_DATE_LABEL }) as HTMLInputElement;
      const endDate12nput = within(ranges[1]).getByRole('textbox', { name: END_DATE_LABEL }) as HTMLInputElement;
      await userEvent.type(startDate1Input, rangeDate1[0]);
      await userEvent.type(endDate1Input, rangeDate1[1]);
      await userEvent.type(startDate2Input, rangeDate2[0]);
      await userEvent.type(endDate12nput, rangeDate2[1]);
      const sortButton = screen.getByLabelText('Sorting date range');
      expect(sortButton).toBeInTheDocument();
    });

    it('should disabled sort button given exist errors in date range', async () => {
      const rangeDate1 = ['03/12/2024', '03/25/2024'];
      const rangeDate2 = ['03/08/2024', '03/26/2024'];

      const addButton = screen.getByLabelText('Button for adding date range');
      await userEvent.click(addButton);
      await userEvent.click(addButton);
      const ranges = screen.getAllByLabelText('Range picker row');
      const startDate1Input = within(ranges[0]).getByRole('textbox', { name: START_DATE_LABEL }) as HTMLInputElement;
      const endDate1Input = within(ranges[0]).getByRole('textbox', { name: END_DATE_LABEL }) as HTMLInputElement;
      const startDate2Input = within(ranges[1]).getByRole('textbox', { name: START_DATE_LABEL }) as HTMLInputElement;
      const endDate12nput = within(ranges[1]).getByRole('textbox', { name: END_DATE_LABEL }) as HTMLInputElement;
      await userEvent.type(startDate1Input, rangeDate1[0]);
      await userEvent.type(endDate1Input, rangeDate1[1]);
      await userEvent.type(startDate2Input, rangeDate2[0]);
      await userEvent.type(endDate12nput, rangeDate2[1]);
      const sortButtonContainer = screen.queryByLabelText('sort button');
      expect(sortButtonContainer).toBeDisabled();
    });

    it('should update sort status when handleSortTypeChange is called', async () => {
      const rangeDate1 = ['03/15/2024', '03/25/2024'];
      const rangeDate2 = ['03/08/2024', '03/11/2024'];

      const addButton = screen.getByLabelText('Button for adding date range');
      await userEvent.click(addButton);
      const ranges = screen.getAllByLabelText('Range picker row');
      const startDate1Input = within(ranges[0]).getByRole('textbox', { name: START_DATE_LABEL }) as HTMLInputElement;
      const endDate1Input = within(ranges[0]).getByRole('textbox', { name: END_DATE_LABEL }) as HTMLInputElement;
      const startDate2Input = within(ranges[1]).getByRole('textbox', { name: START_DATE_LABEL }) as HTMLInputElement;
      const endDate12nput = within(ranges[1]).getByRole('textbox', { name: END_DATE_LABEL }) as HTMLInputElement;
      await userEvent.type(startDate1Input, rangeDate1[0]);
      await userEvent.type(endDate1Input, rangeDate1[1]);
      await userEvent.type(startDate2Input, rangeDate2[0]);
      await userEvent.type(endDate12nput, rangeDate2[1]);
      const sortButton = screen.getByLabelText('sort button');
      await userEvent.click(sortButton);
      expect(screen.getByRole('button', { name: 'Descending' })).toBeInTheDocument();
      await userEvent.click(sortButton);
      expect(screen.getByRole('button', { name: 'Ascending' })).toBeInTheDocument();
    });
    const dateRange1: SortedDateRangeType = {
      startDate: '2024-03-10',
      endDate: '2024-03-15',
      sortIndex: 1,
      startDateError: null,
      endDateError: null,
    };

    const dateRange2: SortedDateRangeType = {
      startDate: '2024-03-05',
      endDate: '2024-03-08',
      sortIndex: 2,
      startDateError: null,
      endDateError: null,
    };

    const dateRange3: SortedDateRangeType = {
      startDate: '2024-03-20',
      endDate: '2024-03-25',
      sortIndex: 3,
      startDateError: null,
      endDateError: null,
    };

    it('should correctly sort by default sortIndex', () => {
      const sorted = [dateRange1, dateRange2, dateRange3].sort(sortFn[SortType.DEFAULT]);
      expect(sorted).toEqual([dateRange1, dateRange2, dateRange3]);
    });

    it('should correctly sort by startDate in descending order', () => {
      const sorted = sortBy([dateRange1, dateRange2, dateRange3], get(sortFn, SortType.DESCENDING));
      expect(sorted).toEqual([dateRange3, dateRange1, dateRange2]);
    });

    it('should correctly sort by startDate in ascending order', () => {
      const sorted = sortBy([dateRange1, dateRange2, dateRange3], get(sortFn, SortType.ASCENDING));
      expect(sorted).toEqual([dateRange2, dateRange1, dateRange3]);
    });
  });
});
