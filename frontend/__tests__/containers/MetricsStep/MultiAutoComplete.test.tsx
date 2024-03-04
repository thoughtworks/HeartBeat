import MultiAutoComplete from '@src/components/Common/MultiAutoComplete';
import { ALL, MOCK_AUTOCOMPLETE_LIST } from '../../fixtures';
import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import React from 'react';

describe('MultiAutoComplete', () => {
  const optionList = ['Option 1', 'Option 2', 'Option 3'];
  const selectedOption = ['Option 1'];
  const onChangeHandler = jest.fn();
  const isSelectAll = false;
  const textFieldLabel = 'Select Options';
  const isError = false;
  const testId = 'multi-auto-complete';
  const setup = () =>
    render(
      <MultiAutoComplete
        optionList={optionList}
        selectedOption={selectedOption}
        onChangeHandler={onChangeHandler}
        isSelectAll={isSelectAll}
        textFieldLabel={textFieldLabel}
        isError={isError}
        testId={testId}
      />,
    );

  it('renders the component', () => {
    setup();

    expect(screen.getByTestId(testId)).toBeInTheDocument();
  });

  it('When passed selected option changed, the correct option would be displayed', async () => {
    setup();

    expect(screen.getByRole('button', { name: 'Option 1' })).toBeVisible();
  });

  it('When user select All option, all options in drop box would be selected', async () => {
    setup();

    const inputField = screen.getByRole('combobox');
    await userEvent.click(inputField);
    const allOption = screen.getByRole('option', { name: 'All' });
    await userEvent.click(allOption);

    expect(onChangeHandler).toHaveBeenCalledWith(expect.anything(), [MOCK_AUTOCOMPLETE_LIST[0], ALL]);
  });
});
