import { nextStep, updateFailedTimeRange } from '@src/context/stepper/StepperSlice';
import DateRangeViewer from '@src/components/Common/DateRangeViewer';
import { formatDateToTimestampString } from '@src/utils/util';
import { DateRange } from '@src/context/config/configSlice';
import { setupStore } from '@test/utils/setupStoreUtil';
import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { Provider } from 'react-redux';
import React from 'react';

describe('DateRangeViewer', () => {
  let store = setupStore();
  const setup = (dateRanges: DateRange) => {
    return render(
      <Provider store={store}>
        <DateRangeViewer dateRangeList={dateRanges} />
      </Provider>,
    );
  };

  beforeEach(() => {
    store = setupStore();
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  const mockDateRanges = [
    {
      startDate: '2024-03-19T00:00:00.000+08:00',
      endDate: '2024-03-21T23:59:59.999+08:00',
    },
    {
      startDate: '2024-02-01T00:00:00.000+08:00',
      endDate: '2024-02-14T23:59:59.999+08:00',
    },
    {
      startDate: '2024-04-01T00:00:00.000+08:00',
      endDate: '2024-04-08T23:59:59.999+08:00',
    },
  ];
  it('should show date when render component given startDate and endDate', () => {
    const { getByText } = setup(mockDateRanges);
    expect(getByText(/2024\/03\/19/)).toBeInTheDocument();
    expect(getByText(/2024\/03\/21/)).toBeInTheDocument();
  });

  it('should show more date when click expand button', async () => {
    const { getByLabelText, getByText, getAllByText, container } = setup(mockDateRanges);
    await userEvent.click(getByLabelText('expandMore'));
    expect(getAllByText(/2024\/03\/19/)[0]).toBeInTheDocument();
    expect(getAllByText(/2024\/03\/19/)[1]).toBeInTheDocument();
    expect(getAllByText(/2024\/03\/21/)[0]).toBeInTheDocument();
    expect(getAllByText(/2024\/03\/21/)[1]).toBeInTheDocument();
    expect(getByText(/2024\/02\/01/)).toBeInTheDocument();
    expect(getByText(/2024\/02\/14/)).toBeInTheDocument();
    expect(getByText(/2024\/04\/01/)).toBeInTheDocument();
    expect(getByText(/2024\/04\/08/)).toBeInTheDocument();
    await userEvent.click(container);
    expect(getByText(/2024\/03\/19/)).toBeInTheDocument();
    expect(getByText(/2024\/03\/21/)).toBeInTheDocument();
  });

  it('should show priority high icon when click expand button and step number is 1', async () => {
    const failedTimeRangeList = [formatDateToTimestampString('2024-02-01T00:00:00.000+08:00')];
    store.dispatch(nextStep());
    store.dispatch(updateFailedTimeRange(failedTimeRangeList));
    const { getByLabelText } = setup(mockDateRanges);

    await userEvent.click(getByLabelText('expandMore'));

    expect(screen.getByTestId('PriorityHighIcon')).toBeInTheDocument();
  });

  it('should not show priority high icon when click expand button and step number is 0', async () => {
    const { getByLabelText } = setup(mockDateRanges);

    await userEvent.click(getByLabelText('expandMore'));

    expect(screen.queryByTestId('PriorityHighIcon')).not.toBeInTheDocument();
  });
});
