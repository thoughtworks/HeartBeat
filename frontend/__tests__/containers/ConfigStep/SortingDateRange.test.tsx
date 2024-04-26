import { SortingDateRange } from '@src/containers/ConfigStep/DateRangePicker/SortingDateRange';
import { SortType } from '@src/containers/ConfigStep/DateRangePicker/types';
import { updateDateRangeSortType } from '@src/context/config/configSlice';
import { setupStore } from '@test/utils/setupStoreUtil';
import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { Provider } from 'react-redux';
import React from 'react';

let store = setupStore();
const setup = () => {
  store = setupStore();
  return render(
    <Provider store={store}>
      <SortingDateRange onChange={() => {}} sortType={SortType.DEFAULT} />
    </Provider>,
  );
};
jest.mock('@src/context/config/configSlice', () => ({
  ...jest.requireActual('@src/context/config/configSlice'),
  updateDateRangeSortType: jest.fn().mockReturnValue({ type: 'SHOULD_UPDATE_SORT_STATUS' }),
}));

describe('SortDateRange button behaviors', () => {
  it('should show sort time rang button', () => {
    setup();
    const sortButtonContainer = screen.getByLabelText('Sorting date range');
    expect(sortButtonContainer).toBeInTheDocument();

    const sortTextButton = screen.getByText('Default sort');
    expect(sortTextButton).toBeInTheDocument();

    const sortButton = screen.getByLabelText('sort button');
    expect(sortButton).toBeInTheDocument();
  });

  it('should change sort order given SortButton is clicked', async () => {
    setup();
    const sortButtonContainer = screen.getByLabelText('Sorting date range');
    expect(sortButtonContainer).toBeInTheDocument();

    const sortTextButton = screen.getByText('Default sort');

    expect(sortTextButton).toBeInTheDocument();

    const sortButton = screen.getByLabelText('sort button');
    await userEvent.click(sortButton);

    expect(updateDateRangeSortType).toHaveBeenCalledTimes(1);
    expect(updateDateRangeSortType).toHaveBeenCalledWith(SortType.DESCENDING);
  });

  it('should render right icon with sort status', async () => {
    setup();
    const sortButton = screen.getByLabelText('sort button');
    await userEvent.click(sortButton);
    const arrowDropDown = screen.getByRole('button', { name: 'Descending' });
    expect(arrowDropDown).toBeInTheDocument();
    await userEvent.click(sortButton);
    const arrowDropUp = screen.getByRole('button', { name: 'Ascending' });
    expect(arrowDropUp).toBeInTheDocument();
  });
});
