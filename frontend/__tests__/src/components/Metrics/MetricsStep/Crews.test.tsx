import { act, render, waitFor, within } from '@testing-library/react';
import { Crews } from '@src/components/Metrics/MetricsStep/Crews';
import userEvent from '@testing-library/user-event';
import { setupStore } from '../../../utils/setupStoreUtil';
import { Provider } from 'react-redux';
import { updateAssigneeFilter } from '@src/context/Metrics/metricsSlice';

const mockOptions = ['crew A', 'crew B'];
const mockTitle = 'Crews Setting';
const mockLabel = 'Included Crews';
const assigneeFilterLabels = ['Last assignee', 'Historical assignee'];
const assigneeFilterValues = ['lastAssignee', 'historicalAssignee'];

jest.mock('@src/context/Metrics/metricsSlice', () => ({
  ...jest.requireActual('@src/context/Metrics/metricsSlice'),
  selectMetricsContent: jest.fn().mockReturnValue({ users: ['crew A', 'crew B'] }),
}));

const mockedUseAppDispatch = jest.fn();
jest.mock('@src/hooks/useAppDispatch', () => ({
  useAppDispatch: () => mockedUseAppDispatch,
}));

let store = setupStore();

const setup = () => {
  return render(
    <Provider store={store}>
      <Crews title={mockTitle} label={mockLabel} options={mockOptions} />
    </Provider>
  );
};

describe('Crew', () => {
  beforeEach(() => {
    store = setupStore();
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  it('should show Crews when render Crews component', () => {
    const { getByText } = setup();

    expect(getByText(mockTitle)).toBeInTheDocument();
  });

  it('should selected all options by default when initializing', () => {
    const { getByRole } = setup();

    expect(getByRole('button', { name: 'crew A' })).toBeInTheDocument();
    expect(getByRole('button', { name: 'crew B' })).toBeInTheDocument();
  });

  it('should show detail options when click Included crews button', async () => {
    const { getByRole } = setup();

    await act(async () => {
      await userEvent.click(getByRole('combobox', { name: mockLabel }));
    });
    const listBox = within(getByRole('listbox'));

    expect(listBox.getByRole('option', { name: 'All' })).toBeVisible();
    expect(listBox.getByRole('option', { name: 'crew A' })).toBeVisible();
    expect(listBox.getByRole('option', { name: 'crew B' })).toBeVisible();
  });

  it('should show error message when crews is null', async () => {
    const { getByRole, getByText } = setup();
    await act(async () => {
      await userEvent.click(getByRole('combobox', { name: mockLabel }));
    });
    await act(async () => {
      await userEvent.click(getByText('All'));
    });

    const requiredText = getByText('required');
    expect(requiredText.tagName).toBe('STRONG');
  });

  it('should show other selections when cancel one option given default all selections in crews', async () => {
    const { getByRole, queryByRole } = setup();

    await act(async () => {
      await userEvent.click(getByRole('combobox', { name: mockLabel }));
    });

    const listBox = within(getByRole('listbox'));
    await act(async () => {
      await userEvent.click(listBox.getByRole('option', { name: mockOptions[0] }));
    });

    expect(queryByRole('button', { name: mockOptions[0] })).not.toBeInTheDocument();
    expect(queryByRole('button', { name: mockOptions[1] })).toBeInTheDocument();
  });

  it('should clear crews data when check all option', async () => {
    const { getByRole, queryByRole } = setup();

    await act(async () => {
      await userEvent.click(getByRole('combobox', { name: mockLabel }));
    });

    const listBox = within(getByRole('listbox'));
    const allOption = listBox.getByRole('option', { name: 'All' });
    await act(async () => {
      await userEvent.click(allOption);
    });

    expect(queryByRole('button', { name: mockOptions[0] })).not.toBeInTheDocument();
    expect(queryByRole('button', { name: mockOptions[1] })).not.toBeInTheDocument();

    await act(async () => {
      await userEvent.click(allOption);
    });

    expect(queryByRole('button', { name: mockOptions[0] })).toBeInTheDocument();
    expect(queryByRole('button', { name: mockOptions[1] })).toBeInTheDocument();
  }, 50000);

  it('should show radio group when render Crews component', async () => {
    const { getByRole, getByText } = setup();

    expect(getByText(assigneeFilterLabels[0])).toBeInTheDocument();
    expect(getByText(assigneeFilterLabels[1])).toBeInTheDocument();
    expect(getByRole('radiogroup', { name: 'assigneeFilter' })).toBeVisible();
  });

  it('should show radio group with init value when render Crews component', async () => {
    const { getAllByRole } = setup();

    const radioGroups = getAllByRole('radio');
    const optionValues = radioGroups.map((option) => option.getAttribute('value'));
    const checkedValues = radioGroups.map((option) => option.getAttribute('checked'));

    const expectedCheckedValues = ['', null];
    expect(optionValues).toEqual(assigneeFilterValues);
    expect(checkedValues).toEqual(expectedCheckedValues);
  });

  it('should call update function when change radio option', async () => {
    const { getByRole } = setup();

    await act(async () => {
      await userEvent.click(getByRole('radio', { name: assigneeFilterLabels[1] }));
    });

    await waitFor(() => {
      expect(mockedUseAppDispatch).toHaveBeenCalledTimes(2);
      expect(mockedUseAppDispatch).toHaveBeenCalledWith(updateAssigneeFilter(assigneeFilterValues[1]));
    });
  });
});
