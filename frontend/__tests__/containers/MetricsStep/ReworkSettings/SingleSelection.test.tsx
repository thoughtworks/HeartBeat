import { SingleSelection } from '@src/containers/MetricsStep/ReworkSettings/SingleSelection';
import { act, render, waitFor, within } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { LIST_OPEN } from '@test/fixtures';

describe('SingleSelection', () => {
  const mockOptions = ['opton1', 'opton2', 'opton3'];
  const mockLabel = 'mockLabel';
  const mockValue = 'mockOptions 1';
  const mockOnValueChange = jest.fn();

  afterEach(() => {
    jest.clearAllMocks();
  });

  const setup = () =>
    render(
      <SingleSelection options={mockOptions} label={mockLabel} value={mockValue} onValueChange={mockOnValueChange} />,
    );

  it('should trigger onValueChange callback when select value option', async () => {
    const { getByText, getByRole, getAllByRole } = setup();

    await waitFor(() => {
      expect(getByText(mockLabel)).toBeInTheDocument();
    });

    await act(async () => {
      await userEvent.click(getAllByRole('button', { name: LIST_OPEN })[0]);
    });

    const stepsListBox = within(getByRole('listbox'));
    await act(async () => {
      await userEvent.click(stepsListBox.getByText(mockOptions[1]));
    });

    expect(mockOnValueChange).toHaveBeenCalledTimes(1);
  });

  it('should show no options when search the wrong keyword', async () => {
    const { getAllByRole, getByText } = setup();
    const buttonElements = getAllByRole('button', { name: LIST_OPEN });

    await act(async () => {
      await userEvent.type(buttonElements[0], 'wrong keyword');
    });

    expect(getByText('No options')).toBeInTheDocument();
  });
});
