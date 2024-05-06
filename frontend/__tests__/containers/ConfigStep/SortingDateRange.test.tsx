import { AscendingIcon, DescendingIcon } from '@src/containers/ConfigStep/DateRangePicker/style';
import { SortingDateRange } from '@src/containers/ConfigStep/DateRangePicker/SortingDateRange';
import { setupStore } from '@test/utils/setupStoreUtil';
import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { ThemeProvider } from '@mui/material';
import { Provider } from 'react-redux';
import { theme } from '@src/theme';
import React from 'react';

let store = setupStore();
const setup = () => {
  store = setupStore();
  return render(
    <Provider store={store}>
      <ThemeProvider theme={theme}>
        <SortingDateRange disabled={false} />
      </ThemeProvider>
    </Provider>,
  );
};

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

  it('should change sort order iterately given SortButton is clicked', async () => {
    setup();
    const sortButton = screen.getByLabelText('sort button');
    await userEvent.click(sortButton);
    const arrowDropDown = screen.getByRole('button', { name: 'Descending' });
    expect(arrowDropDown).toBeInTheDocument();
    await userEvent.click(sortButton);
    const arrowDropUp = screen.getByRole('button', { name: 'Ascending' });
    expect(arrowDropUp).toBeInTheDocument();
  });

  it('should render AscendingIcon with correct styles', () => {
    render(<AscendingIcon theme={theme} disabled={true} />);

    const ascendingIcon = screen.getByTestId('ArrowDropUpIcon');
    expect(ascendingIcon).toBeInTheDocument();
    expect(ascendingIcon).toHaveStyle(`color: ${theme.main.button.disabled.color}`);
  });

  it('should render DescendingIcon with correct styles', () => {
    render(<DescendingIcon theme={theme} disabled={true} />);

    const descendingIcon = screen.getByTestId('ArrowDropDownIcon');
    expect(descendingIcon).toBeInTheDocument();
    expect(descendingIcon).toHaveStyle(`color: ${theme.main.button.disabled.color}`);
  });
});
