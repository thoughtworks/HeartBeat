import {
  initDeploymentFrequencySettings,
  updateShouldGetBoardConfig,
  updateShouldGetPipelineConfig,
} from '@src/context/Metrics/metricsSlice';
import { DateRangePicker } from '@src/containers/ConfigStep/DateRangePicker';
import { fireEvent, render, screen } from '@testing-library/react';
import { setupStore } from '../../utils/setupStoreUtil';
import { ERROR_DATE } from '../../fixtures';
import { Provider } from 'react-redux';
import React from 'react';
import dayjs from 'dayjs';

const START_DATE_LABEL = 'From *';
const END_DATE_LABEL = 'To *';
const TODAY = dayjs();
const INPUT_DATE_VALUE = TODAY.format('MM/DD/YYYY');
let store = setupStore();

jest.mock('@src/context/Metrics/metricsSlice', () => ({
  ...jest.requireActual('@src/context/Metrics/metricsSlice'),
  updateShouldGetBoardConfig: jest.fn().mockReturnValue({ type: 'SHOULD_UPDATE_BOARD_CONFIG' }),
  updateShouldGetPipelineConfig: jest.fn().mockReturnValue({ type: 'SHOULD_UPDATE_PIPELINE_CONFIG' }),
  initDeploymentFrequencySettings: jest.fn().mockReturnValue({ type: 'INIT_DEPLOYMENT_SETTINGS' }),
}));

const setup = () => {
  store = setupStore();
  return render(
    <Provider store={store}>
      <DateRangePicker />
    </Provider>,
  );
};

describe('DateRangePicker', () => {
  const expectDate = (inputDate: HTMLInputElement) => {
    expect(inputDate.value).toEqual(expect.stringContaining(TODAY.date().toString()));
    expect(inputDate.value).toEqual(expect.stringContaining((TODAY.month() + 1).toString()));
    expect(inputDate.value).toEqual(expect.stringContaining(TODAY.year().toString()));
  };

  it('should render DateRangePicker', () => {
    setup();

    expect(screen.queryAllByText(START_DATE_LABEL)).toHaveLength(1);
    expect(screen.queryAllByText(END_DATE_LABEL)).toHaveLength(1);
  });

  it('should show right start date when input a valid date given init start date is null ', () => {
    setup();
    const startDateInput = screen.getByRole('textbox', { name: START_DATE_LABEL }) as HTMLInputElement;
    fireEvent.change(startDateInput, { target: { value: INPUT_DATE_VALUE } });

    expectDate(startDateInput);
  });

  it('should show right end date when input a valid date given init end date is null ', () => {
    setup();
    const endDateInput = screen.getByRole('textbox', { name: END_DATE_LABEL }) as HTMLInputElement;

    fireEvent.change(endDateInput, { target: { value: INPUT_DATE_VALUE } });
    expectDate(endDateInput);
  });

  it('should Auto-fill endDate which is after startDate 13 days when fill right startDate ', () => {
    setup();
    const endDate = TODAY.add(13, 'day');
    const startDateInput = screen.getByRole('textbox', { name: START_DATE_LABEL }) as HTMLInputElement;
    const endDateInput = screen.getByRole('textbox', { name: END_DATE_LABEL }) as HTMLInputElement;

    fireEvent.change(startDateInput, { target: { value: INPUT_DATE_VALUE } });

    expect(endDateInput.value).toEqual(expect.stringContaining(endDate.date().toString()));
    expect(endDateInput.value).toEqual(expect.stringContaining((endDate.month() + 1).toString()));
    expect(endDateInput.value).toEqual(expect.stringContaining(endDate.year().toString()));
  });

  it('should not Auto-fill endDate which is after startDate 14 days when fill wrong format startDate ', () => {
    setup();
    const startDateInput = screen.getByRole('textbox', { name: START_DATE_LABEL }) as HTMLInputElement;
    const endDateInput = screen.getByRole('textbox', { name: END_DATE_LABEL }) as HTMLInputElement;

    fireEvent.change(startDateInput, { target: { value: ERROR_DATE } });

    expect(startDateInput.valueAsDate).toEqual(null);
    expect(endDateInput.valueAsDate).toEqual(null);
  });

  it('should dispatch update configuration when change startDate', () => {
    setup();
    const startDateInput = screen.getByRole('textbox', { name: START_DATE_LABEL }) as HTMLInputElement;
    fireEvent.change(startDateInput, { target: { value: INPUT_DATE_VALUE } });
    expect(updateShouldGetBoardConfig).toHaveBeenCalledWith(true);
    expect(updateShouldGetPipelineConfig).toHaveBeenCalledWith(true);
    expect(initDeploymentFrequencySettings).toHaveBeenCalled();
  });

  it('should dispatch update configuration when change endDate', () => {
    setup();
    const endDateInput = screen.getByRole('textbox', { name: END_DATE_LABEL }) as HTMLInputElement;
    fireEvent.change(endDateInput, { target: { value: INPUT_DATE_VALUE } });
    expect(updateShouldGetBoardConfig).toHaveBeenCalledWith(true);
    expect(updateShouldGetPipelineConfig).toHaveBeenCalledWith(true);
    expect(initDeploymentFrequencySettings).toHaveBeenCalled();
  });
});
