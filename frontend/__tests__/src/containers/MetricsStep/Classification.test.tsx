import { act, render, waitFor, within, screen } from '@testing-library/react';
import { Classification } from '@src/containers/MetricsStep/Classification';
import { ERROR_MESSAGE_TIME_DURATION } from '../../fixtures';
import { setupStore } from '../../utils/setupStoreUtil';
import userEvent from '@testing-library/user-event';
import { Provider } from 'react-redux';
import React from 'react';

const mockTitle = 'Classification Setting';
const mockLabel = 'Distinguished by';
const mockTargetFields = [
  { flag: true, key: 'issue', name: 'Issue' },
  { flag: false, key: 'type', name: 'Type' },
];

jest.mock('@src/context/config/configSlice', () => ({
  ...jest.requireActual('@src/context/config/configSlice'),
  selectIsProjectCreated: jest.fn().mockReturnValue(false),
}));

jest.mock('@src/context/Metrics/metricsSlice', () => ({
  ...jest.requireActual('@src/context/Metrics/metricsSlice'),
  selectClassificationWarningMessage: jest.fn().mockReturnValue('Test warning Message'),
}));

let store = setupStore();
const setup = () => {
  return render(
    <Provider store={store}>
      <Classification title={mockTitle} label={mockLabel} targetFields={mockTargetFields} />
    </Provider>,
  );
};

describe('Classification', () => {
  beforeEach(() => {
    store = setupStore();
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  it('should show Classification when render Classification component', () => {
    setup();

    expect(screen.getByText(mockTitle)).toBeInTheDocument();
    expect(screen.getByText(mockLabel)).toBeInTheDocument();
  });

  it('should show default options when initialization', () => {
    setup();

    expect(screen.getByText('Issue')).toBeInTheDocument();
    expect(screen.queryByText('Type')).not.toBeInTheDocument();
  });

  it('should show all options when click selectBox', async () => {
    setup();
    await act(async () => {
      await userEvent.click(screen.getByRole('combobox', { name: mockLabel }));
    });

    expect(screen.getByRole('option', { name: 'Issue' })).toBeInTheDocument();
    expect(screen.getByRole('option', { name: 'Type' })).toBeInTheDocument();
  });

  it('should show all targetField when click All and show nothing when cancel click', async () => {
    setup();
    await act(async () => {
      await userEvent.click(screen.getByRole('combobox', { name: mockLabel }));
    });
    await act(async () => {
      await userEvent.click(screen.getByText('All'));
    });
    const names = mockTargetFields.map((item) => item.name);

    expect(screen.getByRole('button', { name: names[0] })).toBeVisible();
    expect(screen.getByRole('button', { name: names[1] })).toBeVisible();

    await act(async () => {
      await userEvent.click(screen.getByText('All'));
    });

    expect(screen.queryByRole('button', { name: names[0] })).not.toBeInTheDocument();
    expect(screen.queryByRole('button', { name: names[1] })).not.toBeInTheDocument();
  });

  it('should show selected targetField when click selected field', async () => {
    setup();
    const names = mockTargetFields.map((item) => item.name);

    await act(async () => {
      await userEvent.click(screen.getByRole('combobox', { name: mockLabel }));
    });
    await act(async () => {
      await userEvent.click(screen.getByText('All'));
    });
    await act(async () => {
      await userEvent.click(screen.getByText('All'));
    });

    const listBox = within(screen.getByRole('listbox'));

    await act(async () => {
      await userEvent.click(listBox.getByRole('option', { name: names[0] }));
    });

    expect(screen.queryByRole('button', { name: names[0] })).toBeInTheDocument();
    expect(screen.queryByRole('button', { name: names[1] })).not.toBeInTheDocument();
  });

  it('should show warning message when classification warning message has a value in cycleTime component', () => {
    setup();

    expect(screen.getByText('Test warning Message')).toBeVisible();
  });

  it('should show disable warning message when classification warning message has a value after two seconds in cycleTime component', async () => {
    jest.useFakeTimers();
    setup();

    act(() => {
      jest.advanceTimersByTime(ERROR_MESSAGE_TIME_DURATION);
    });

    await waitFor(() => {
      expect(screen.queryByText('Test warning Message')).not.toBeInTheDocument();
    });
  });
});
