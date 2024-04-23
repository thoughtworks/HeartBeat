import { SingleSelection } from '@src/containers/MetricsStep/DeploymentFrequencySettings/SingleSelection';
import { act, render, within } from '@testing-library/react';
import { setupStore } from '@test/utils/setupStoreUtil';
import userEvent from '@testing-library/user-event';
import { LIST_OPEN } from '@test/fixtures';
import { Provider } from 'react-redux';

const mockValidationCheckContext = {
  checkDuplicatedPipeLine: jest.fn(),
  checkPipelineValidation: jest.fn(),
};

jest.mock('@src/hooks/useMetricsStepValidationCheckContext', () => ({
  useMetricsStepValidationCheckContext: () => mockValidationCheckContext,
}));
jest.mock('react', () => ({
  ...jest.requireActual('react'),
  useEffect: jest.fn(),
}));
jest.mock('@src/context/Metrics/metricsSlice', () => ({
  ...jest.requireActual('@src/context/Metrics/metricsSlice'),
  selectDeploymentFrequencySettings: jest.fn().mockReturnValue([]),
}));
jest.mock('@src/utils/util', () => ({
  ...jest.requireActual('@src/utils/util'),
  getDisabledOptions: jest.fn(),
}));
let store = setupStore();

describe('SingleSelection', () => {
  const mockOptions = [':java:mockOptions 1', ':lock:mockOptions 2', ':react:mockOptions 3'];
  const mockLabel = 'mockLabel';
  const mockValue = 'mockOptions 1';
  const mockOnGetSteps = jest.fn();
  const mockUpdatePipeline = jest.fn();

  beforeEach(() => {
    store = setupStore();
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  const setup = () =>
    render(
      <Provider store={store}>
        <SingleSelection
          options={mockOptions}
          label={mockLabel}
          value={mockValue}
          id={0}
          onGetSteps={mockOnGetSteps}
          onUpDatePipeline={mockUpdatePipeline}
        />
      </Provider>,
    );

  it('should show selected label and value when render a SingleSelection', () => {
    const { getByText, getAllByRole } = setup();
    const inputElements = getAllByRole('combobox');

    const selectedInputValues = inputElements.map((input) => input.getAttribute('value'));

    expect(getByText(mockLabel)).toBeInTheDocument();
    expect(selectedInputValues).toEqual([mockValue]);
  });

  it('should show detail options when click the dropdown button', async () => {
    const { getAllByRole, getByRole } = setup();
    const buttonElements = getAllByRole('button', { name: LIST_OPEN });

    await act(async () => {
      await userEvent.click(buttonElements[0]);
    });
    const listBox = within(getByRole('listbox'));
    const options = listBox.getAllByRole('option');
    const optionText = options.map((option) => option.textContent);

    expect(optionText).toEqual(['mockOptions 1', 'mockOptions 2', 'mockOptions 3']);
  });

  it('should show the right options when search the keyword', async () => {
    const { getAllByRole, getByRole } = setup();
    const buttonElements = getAllByRole('button', { name: LIST_OPEN });

    await act(async () => {
      await userEvent.type(buttonElements[0], '1');
    });

    const listBox = within(getByRole('listbox'));
    const options = listBox.getAllByRole('option');
    const optionTexts = options.map((option) => option.textContent);

    const expectedOptions = ['mockOptions 1'];

    expect(optionTexts).toEqual(expectedOptions);
  });

  it('should show no options when search the wrong keyword', async () => {
    const { getAllByRole, getByText } = setup();
    const buttonElements = getAllByRole('button', { name: LIST_OPEN });

    await act(async () => {
      await userEvent.type(buttonElements[0], 'wrong keyword');
    });

    expect(getByText('No options')).toBeInTheDocument();
  });

  it('should call update option function and OnGetSteps function when change option given mockValue as default', async () => {
    const { getByText, getByRole } = setup();

    await act(async () => {
      await userEvent.click(getByRole('button', { name: LIST_OPEN }));
    });
    await act(async () => {
      await userEvent.click(getByText('mockOptions 2'));
    });

    expect(mockOnGetSteps).toHaveBeenCalledTimes(1);
    expect(mockUpdatePipeline).toHaveBeenCalledTimes(3);
  });
});
