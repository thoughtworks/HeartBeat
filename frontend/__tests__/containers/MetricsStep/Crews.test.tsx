import { savePipelineCrews, saveUsers, updateAssigneeFilter } from '@src/context/Metrics/metricsSlice';
import { act, render, screen, waitFor, within } from '@testing-library/react';
import { Crews } from '@src/containers/MetricsStep/Crews';
import { setupStore } from '../../utils/setupStoreUtil';
import userEvent from '@testing-library/user-event';
import { Provider } from 'react-redux';

const mockOptions = ['crew A', 'crew B'];
const mockTitle = 'Crews Setting';
const mockLabel = 'Included Crews';
const assigneeFilterLabels = ['Last assignee', 'Historical assignee'];
const assigneeFilterValues = ['lastAssignee', 'historicalAssignee'];

const mockedUseAppDispatch = jest.fn();
jest.mock('@src/hooks/useAppDispatch', () => ({
  useAppDispatch: () => mockedUseAppDispatch,
}));

let store = setupStore();

const setup = (type?: string) => {
  return render(
    <Provider store={store}>
      <Crews options={mockOptions} title={mockTitle} label={mockLabel} type={type ? type : 'board'} />
    </Provider>,
  );
};

describe('Crew', () => {
  beforeEach(() => {
    store = setupStore();
    store.dispatch(saveUsers(['crew A', 'crew B']));
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  it('should show Crews when render Crews component', () => {
    setup();

    expect(screen.getByText(mockTitle)).toBeInTheDocument();
  });

  it('should selected all options by default when initializing given type is board', () => {
    setup();

    expect(screen.getByRole('button', { name: 'crew A' })).toBeInTheDocument();
    expect(screen.getByRole('button', { name: 'crew B' })).toBeInTheDocument();
  });

  it('should show detail options when initializing given type is other and click Included crews button', async () => {
    store.dispatch(savePipelineCrews(['crew B', 'crew C']));
    setup('other');

    await act(async () => {
      await userEvent.click(screen.getByRole('combobox', { name: mockLabel }));
    });
    const listBox = within(screen.getByRole('listbox'));

    expect(listBox.getByRole('option', { name: 'All' })).toBeVisible();
    expect(listBox.getByRole('option', { name: 'crew A' })).toBeVisible();
    expect(listBox.getByRole('option', { name: 'crew B' })).toBeVisible();
    expect(() => {
      listBox.getByRole('option', { name: 'crew C' });
    }).toThrow();
  });

  it('should show detail options when click Included crews button', async () => {
    setup();

    await act(async () => {
      await userEvent.click(screen.getByRole('combobox', { name: mockLabel }));
    });
    const listBox = within(screen.getByRole('listbox'));

    expect(listBox.getByRole('option', { name: 'All' })).toBeVisible();
    expect(listBox.getByRole('option', { name: 'crew A' })).toBeVisible();
    expect(listBox.getByRole('option', { name: 'crew B' })).toBeVisible();
  });

  it('should show error message when crews is null', async () => {
    setup();
    await act(async () => {
      await userEvent.click(screen.getByRole('combobox', { name: mockLabel }));
    });
    await act(async () => {
      await userEvent.click(screen.getByText('All'));
    });

    const requiredText = screen.getByText('required');
    expect(requiredText.tagName).toBe('STRONG');
  });

  it('should show other selections when cancel one option given default all selections in crews', async () => {
    setup();

    await act(async () => {
      await userEvent.click(screen.getByRole('combobox', { name: mockLabel }));
    });

    const listBox = within(screen.getByRole('listbox'));
    await act(async () => {
      await userEvent.click(listBox.getByRole('option', { name: mockOptions[0] }));
    });

    expect(screen.queryByRole('button', { name: mockOptions[0] })).not.toBeInTheDocument();
    expect(screen.queryByRole('button', { name: mockOptions[1] })).toBeInTheDocument();
  });

  it('should clear crews data when check all option', async () => {
    setup();

    await act(async () => {
      await userEvent.click(screen.getByRole('combobox', { name: mockLabel }));
    });

    const listBox = within(screen.getByRole('listbox'));
    const allOption = listBox.getByRole('option', { name: 'All' });
    await act(async () => {
      await userEvent.click(allOption);
    });

    expect(screen.queryByRole('button', { name: mockOptions[0] })).not.toBeInTheDocument();
    expect(screen.queryByRole('button', { name: mockOptions[1] })).not.toBeInTheDocument();

    await act(async () => {
      await userEvent.click(allOption);
    });

    expect(screen.queryByRole('button', { name: mockOptions[0] })).toBeInTheDocument();
    expect(screen.queryByRole('button', { name: mockOptions[1] })).toBeInTheDocument();
  });

  it('should show radio group when render Crews component', async () => {
    setup();

    expect(screen.getByText(assigneeFilterLabels[0])).toBeInTheDocument();
    expect(screen.getByText(assigneeFilterLabels[1])).toBeInTheDocument();
    expect(screen.getByRole('radiogroup', { name: 'assigneeFilter' })).toBeVisible();
  });

  it('should show radio group with init value when render Crews component', async () => {
    setup();

    const radioGroups = screen.getAllByRole('radio');
    const optionValues = radioGroups.map((option) => option.getAttribute('value'));
    const checkedValues = radioGroups.map((option) => option.getAttribute('checked'));

    const expectedCheckedValues = ['', null];
    expect(optionValues).toEqual(assigneeFilterValues);
    expect(checkedValues).toEqual(expectedCheckedValues);
  });

  it('should call update function when change radio option', async () => {
    setup();

    await userEvent.click(screen.getByRole('radio', { name: assigneeFilterLabels[1] }));

    await waitFor(() => {
      expect(mockedUseAppDispatch).toHaveBeenCalledTimes(2);
      expect(mockedUseAppDispatch).toHaveBeenCalledWith(updateAssigneeFilter(assigneeFilterValues[1]));
    });
  });
});
