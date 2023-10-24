import React from 'react'
import { render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import MultiAutoComplete from '@src/components/Common/MultiAutoComplete'
import { act } from 'react-dom/test-utils'

describe('MultiAutoComplete', () => {
  const optionList = ['Option 1', 'Option 2', 'Option 3']
  const selectedOption = ['Option 1']
  const onChangeHandler = jest.fn()
  const isSelectAll = false
  const textFieldLabel = 'Select Options'
  const isError = false
  const testId = 'multi-auto-complete'

  it('renders the component', () => {
    render(
      <MultiAutoComplete
        optionList={optionList}
        selectedOption={selectedOption}
        onChangeHandler={onChangeHandler}
        isSelectAll={isSelectAll}
        textFieldLabel={textFieldLabel}
        isError={isError}
        testId={testId}
      />
    )

    const autoCompleteComponent = screen.getByTestId(testId)
    expect(autoCompleteComponent).toBeInTheDocument()
  })

  it('When passed selectedoption changed, the correct option would be displayed', async () => {
    render(
      <MultiAutoComplete
        optionList={optionList}
        selectedOption={selectedOption}
        onChangeHandler={onChangeHandler}
        isSelectAll={isSelectAll}
        textFieldLabel={textFieldLabel}
        isError={isError}
        testId={testId}
      />
    )

    expect(screen.getByRole('button', { name: 'Option 1' })).toBeVisible()
  })

  it('When All, All would be called by onChange function', async () => {
    render(
      <MultiAutoComplete
        optionList={optionList}
        selectedOption={selectedOption}
        onChangeHandler={onChangeHandler}
        isSelectAll={isSelectAll}
        textFieldLabel={textFieldLabel}
        isError={isError}
        testId={testId}
      />
    )

    const inputField = screen.getByRole('combobox')
    await userEvent.click(inputField)

    const allOption = screen.getByRole('option', { name: 'All' })
    await act(async () => {
      await userEvent.click(allOption)
    })

    expect(onChangeHandler).toHaveBeenCalledWith(expect.anything(), ['Option 1', 'All'], 'selectOption', {
      option: 'All',
    })
  })
})
