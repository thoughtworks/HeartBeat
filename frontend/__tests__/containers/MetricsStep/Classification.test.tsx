import { act, render, waitFor, within, screen } from '@testing-library/react';
import { TargetFieldType } from '@src/containers/MetricsStep/Classification';
import { Classification } from '@src/containers/MetricsStep/Classification';
import { saveTargetFields } from '@src/context/Metrics/metricsSlice';
import { ERROR_MESSAGE_TIME_DURATION } from '../../fixtures';
import { setupStore } from '../../utils/setupStoreUtil';
import userEvent from '@testing-library/user-event';
import { Provider, useSelector } from 'react-redux';

type State<T> = Record<string, Record<string, T>>;

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

const RenderComponent = () => {
  const targetFields = useSelector((state: State<TargetFieldType[]>) => state.metrics.targetFields);
  return <Classification title={mockTitle} label={mockLabel} targetFields={targetFields} />;
};

const setup = async (initField: TargetFieldType[]) => {
  const store = setupStore();
  await store.dispatch(saveTargetFields(initField));
  return render(
    <Provider store={store}>
      <RenderComponent />
    </Provider>,
  );
};

describe('Classification', () => {
  afterEach(() => {
    jest.clearAllMocks();
  });

  it('should show Classification when render Classification component', async () => {
    await setup(mockTargetFields);

    expect(screen.getByText(mockTitle)).toBeInTheDocument();
    expect(screen.getByText(mockLabel)).toBeInTheDocument();
  });

  it('should show default options when initialization', async () => {
    await setup(mockTargetFields);

    expect(screen.getByText('Issue')).toBeInTheDocument();
    expect(screen.queryByText('Type')).not.toBeInTheDocument();
  });

  it('should show all options when click selectBox', async () => {
    await setup(mockTargetFields);
    await userEvent.click(screen.getByRole('combobox', { name: mockLabel }));

    expect(screen.getByRole('option', { name: 'Issue' })).toBeInTheDocument();
    expect(screen.getByRole('option', { name: 'Type' })).toBeInTheDocument();
  });

  it('should show all targetField when click All option', async () => {
    await setup(mockTargetFields);
    const names = mockTargetFields.map((item) => item.name);
    await userEvent.click(screen.getByRole('combobox', { name: mockLabel }));

    await userEvent.click(screen.getByRole('option', { name: /all/i }));

    await waitFor(() => {
      expect(screen.getByRole('button', { name: names[0] })).toBeVisible();
    });
    expect(screen.getByRole('button', { name: names[1] })).toBeVisible();
  });

  it('should show toggle show all options when toggle select all option', async () => {
    await setup(mockTargetFields.map((item) => ({ ...item, flag: true })));
    const names = mockTargetFields.map((item) => item.name);

    await userEvent.click(screen.getByRole('combobox', { name: mockLabel }));
    await userEvent.click(screen.getByRole('option', { name: /all/i }));

    await waitFor(() => {
      expect(screen.queryByRole('button', { name: names[0] })).not.toBeInTheDocument();
    });
    expect(screen.queryByRole('button', { name: names[1] })).not.toBeInTheDocument();
  });

  it('should show selected targetField when click selected field', async () => {
    await setup(mockTargetFields);
    const names = mockTargetFields.map((item) => item.name);

    await userEvent.click(screen.getByRole('combobox', { name: mockLabel }));
    await userEvent.click(screen.getByText('All'));

    const listBox = within(screen.getByRole('listbox'));

    await userEvent.click(listBox.getByRole('option', { name: names[0] }));

    await waitFor(() => {
      expect(screen.queryByRole('button', { name: names[0] })).not.toBeInTheDocument();
    });
  });

  it('should show warning message when classification warning message has a value in cycleTime component', async () => {
    await setup(mockTargetFields);

    expect(screen.getByText('Test warning Message')).toBeVisible();
  });

  it('should show disable warning message when classification warning message has a value after two seconds in cycleTime component', async () => {
    jest.useFakeTimers();
    await setup(mockTargetFields);

    act(() => {
      jest.advanceTimersByTime(ERROR_MESSAGE_TIME_DURATION);
    });

    await waitFor(() => {
      expect(screen.queryByText('Test warning Message')).not.toBeInTheDocument();
    });
  });
});
