import { DateRangeItem, DownloadDialog } from '@src/containers/ReportStep/DownloadDialog';
import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';

describe('DownloadDialog', () => {
  afterEach(() => {
    jest.clearAllMocks();
  });

  const handleCloseFn = jest.fn();
  const downloadCSVFileFn = jest.fn();
  const mockData = [
    {
      startDate: '2024-01-01',
      endDate: '2024-01-14',
      disabled: false,
    },
    {
      startDate: '2024-01-15',
      endDate: '2024-01-31',
      disabled: false,
    },
  ];

  const setup = (dateRangeList: DateRangeItem[]) => {
    render(
      <DownloadDialog
        isShowDialog={true}
        handleClose={handleCloseFn}
        dateRangeList={dateRangeList}
        downloadCSVFile={downloadCSVFileFn}
      />,
    );
  };

  it('should show all dateRanges in DownloadDialog', () => {
    setup(mockData);

    expect(screen.getByText('2024/01/01 - 2024/01/14')).toBeInTheDocument();
    expect(screen.getByText('2024/01/15 - 2024/01/31')).toBeInTheDocument();
    expect(screen.getAllByRole('checkbox')[0]).not.toBeDisabled();
    expect(screen.getAllByRole('checkbox')[1]).not.toBeDisabled();
    expect(screen.getByText('Confirm')).toBeDisabled();
  });

  it('should not be clickable given there is an error fetching data for this dataRange', () => {
    const mockDataWithDisabledDateRange = [
      ...mockData,
      {
        startDate: '2024-02-01',
        endDate: '2024-02-14',
        disabled: true,
      },
    ];
    setup(mockDataWithDisabledDateRange);
    const checkbox = screen.getAllByRole('checkbox')[2];

    expect(checkbox).toBeDisabled();
  });

  it('should confirm button be clickable when choosing one dateRange', async () => {
    setup(mockData);
    const checkbox = screen.getAllByRole('checkbox')[0];
    expect(checkbox).not.toBeDisabled();
    expect(screen.getByText('Confirm')).toBeDisabled();

    await userEvent.click(checkbox);

    expect(screen.getByText('Confirm')).not.toBeDisabled();
  });

  it('should close download dialog when clicking the close button', async () => {
    setup(mockData);

    const closeButton = screen.getByTestId('CloseIcon');
    await userEvent.click(closeButton);

    expect(handleCloseFn).toBeCalledTimes(1);
  });

  it('should close download dialog and download csv file when clicking the confirm button given that a dataRange is checked', async () => {
    setup(mockData);
    const checkbox = screen.getAllByRole('checkbox')[0];
    expect(checkbox).not.toBeDisabled();
    await userEvent.click(checkbox);
    const confirmButton = screen.getByText('Confirm');
    expect(confirmButton).not.toBeDisabled();

    await userEvent.click(confirmButton);

    expect(handleCloseFn).toBeCalledTimes(1);
    expect(downloadCSVFileFn).toBeCalledTimes(1);
  });

  it('should not check the dataRange when clicking on the checkbox given that the dataRange is already checked', async () => {
    setup(mockData);
    const checkbox = screen.getAllByRole('checkbox')[0];
    expect(checkbox).not.toBeDisabled();
    await userEvent.click(checkbox);
    expect(checkbox).toBeChecked();

    await userEvent.click(checkbox);

    expect(checkbox).not.toBeChecked();
  });
});
