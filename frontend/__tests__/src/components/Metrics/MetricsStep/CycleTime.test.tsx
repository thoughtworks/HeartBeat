import { act, render, waitFor, within } from '@testing-library/react'
import { CycleTime } from '@src/components/Metrics/MetricsStep/CycleTime'
import userEvent from '@testing-library/user-event'
import { Provider } from 'react-redux'
import { setupStore } from '../../../utils/setupStoreUtil'
import { CYCLE_TIME_SETTINGS, ERROR_MESSAGE_TIME_DURATION, LIST_OPEN, NO_RESULT_DASH } from '../../../fixtures'
import { saveDoneColumn, updateTreatFlagCardAsBlock } from '@src/context/Metrics/metricsSlice'

const FlagAsBlock = 'Consider the "Flag" as "Block"'

let store = setupStore()
jest.mock('@src/context/Metrics/metricsSlice', () => ({
  ...jest.requireActual('@src/context/Metrics/metricsSlice'),
  selectMetricsContent: jest.fn().mockReturnValue({
    cycleTimeSettings: [
      {
        name: 'Doing',
        value: 'Analysis',
      },
      {
        name: 'Testing',
        value: 'Review',
      },
      {
        name: 'TODO',
        value: '----',
      },
    ],
  }),
  selectTreatFlagCardAsBlock: jest.fn().mockReturnValue(true),
  selectCycleTimeWarningMessage: jest.fn().mockReturnValue('Test warning Message'),
}))

const mockedUseAppDispatch = jest.fn()
jest.mock('@src/hooks/useAppDispatch', () => ({
  useAppDispatch: () => mockedUseAppDispatch,
}))

const setup = () =>
  render(
    <Provider store={store}>
      <CycleTime title={CYCLE_TIME_SETTINGS} />
    </Provider>
  )

describe('CycleTime', () => {
  beforeEach(() => {
    store = setupStore()
  })

  afterEach(() => {
    jest.clearAllMocks()
  })

  describe('CycleTime Title', () => {
    it('should show Cycle Time title when render Crews component', () => {
      const { getByText } = setup()
      expect(getByText(CYCLE_TIME_SETTINGS)).toBeInTheDocument()
    })
  })

  describe('CycleTime Selector List', () => {
    it('should show selectors title when render Crews component', () => {
      const { getByText } = setup()

      expect(getByText('Doing')).toBeInTheDocument()
      expect(getByText('Testing')).toBeInTheDocument()
      expect(getByText('TODO')).toBeInTheDocument()
    })

    it('should show right input value when initializing', async () => {
      const { getAllByRole } = setup()
      const inputElements = getAllByRole('combobox')
      const selectedInputValues = inputElements.map((input) => input.getAttribute('value'))

      const expectedInputValues = ['Analysis', 'Review', NO_RESULT_DASH]

      expect(selectedInputValues).toEqual(expectedInputValues)
    })

    it('should show detail options when click included button', async () => {
      const { getAllByRole, getByRole } = setup()
      const columnsArray = getAllByRole('button', { name: LIST_OPEN })
      await act(async () => {
        await userEvent.click(columnsArray[0])
      })
      const listBox = within(getByRole('listbox'))
      const options = listBox.getAllByRole('option')
      const optionText = options.map((option) => option.textContent)

      const expectedOptions = [
        NO_RESULT_DASH,
        'To do',
        'Analysis',
        'In Dev',
        'Block',
        'Waiting for testing',
        'Testing',
        'Review',
        'Done',
      ]

      expectedOptions.forEach((expectedOption) => {
        expect(optionText).toContain(expectedOption)
      })
    })

    it('should show the right options when input the keyword to search', async () => {
      const { getAllByRole, getByRole } = setup()
      const columnsArray = getAllByRole('button', { name: LIST_OPEN })
      await act(async () => {
        await userEvent.type(columnsArray[0], 'Done')
      })
      const listBox = within(getByRole('listbox'))
      const options = listBox.getAllByRole('option')
      const optionTexts = options.map((option) => option.textContent)

      const expectedOptions = ['Done']

      expect(optionTexts).toEqual(expectedOptions)
    })

    it('should show no options when enter the wrong keyword', async () => {
      const { getAllByRole, getByText } = setup()
      const columnsArray = getAllByRole('button', { name: LIST_OPEN })
      await act(async () => {
        await userEvent.type(columnsArray[0], 'wrong keyword')
      })

      expect(getByText('No options')).toBeInTheDocument()
    })

    it('should show selected option when click the dropDown button ', async () => {
      const { getAllByRole, getByRole } = setup()
      const columnsArray = getAllByRole('button', { name: LIST_OPEN })
      await act(async () => {
        await userEvent.click(columnsArray[2])
      })

      const listBox = within(getByRole('listbox'))
      const options = listBox.getAllByRole('option')
      const selectedOption = options.find((option) => option.getAttribute('aria-selected') === 'true')

      const selectedOptionText = selectedOption?.textContent

      expect(selectedOptionText).toBe(NO_RESULT_DASH)
    })

    it('should show other selections when change option and will not affect Real done', async () => {
      const { getAllByRole, getByRole } = setup()
      const columnsArray = getAllByRole('button', { name: LIST_OPEN })
      await act(async () => {
        await userEvent.click(columnsArray[2])
      })

      const listBox = within(getByRole('listbox'))
      const mockOptions = listBox.getAllByRole('option')
      await act(async () => {
        await userEvent.click(mockOptions[1])
      })

      const inputElements = getAllByRole('combobox')
      const selectedInputValue = inputElements.map((option) => option.getAttribute('value'))[2]

      expect(selectedInputValue).toBe('To do')
      await waitFor(() => expect(mockedUseAppDispatch).not.toHaveBeenCalledWith(saveDoneColumn([])))
    })

    it('should reset Real done when marked as done from other options', async () => {
      const { getAllByRole, getByRole } = setup()
      const columnsArray = getAllByRole('button', { name: LIST_OPEN })
      await act(async () => {
        await userEvent.click(columnsArray[0])
      })

      const listBox = within(getByRole('listbox'))
      await act(async () => {
        await userEvent.click(listBox.getAllByRole('option')[8])
      })

      const inputElements = getAllByRole('combobox')

      const selectedInputValue = inputElements.map((option) => option.getAttribute('value'))[0]

      expect(selectedInputValue).toBe('Done')
      await waitFor(() => expect(mockedUseAppDispatch).toHaveBeenCalledWith(saveDoneColumn([])))
    })

    it('should show the right selected value when cancel the done', async () => {
      const { getAllByRole, getByRole } = setup()
      const columnsArray = getAllByRole('button', { name: LIST_OPEN })
      await act(async () => {
        await userEvent.click(columnsArray[0])
      })

      const listBox = within(getByRole('listbox'))
      await act(async () => {
        await userEvent.click(listBox.getAllByRole('option')[8])
      })

      await act(async () => {
        await userEvent.click(columnsArray[0])
      })

      const newListBox = within(getByRole('listbox'))
      await act(async () => {
        await userEvent.click(newListBox.getAllByRole('option')[7])
      })

      const inputElements = getAllByRole('combobox')
      const selectedInputValue = inputElements.map((option) => option.getAttribute('value'))[0]

      expect(selectedInputValue).toBe('Review')
      await waitFor(() => expect(mockedUseAppDispatch).toHaveBeenCalledWith(saveDoneColumn([])))
    })
  })

  describe('CycleTime Flag as Block', () => {
    it('should show FlagAsBlock when render Crews component', () => {
      const { getByText } = setup()
      expect(getByText(FlagAsBlock)).toBeInTheDocument()
    })

    it('should be checked by default when initializing', () => {
      const { getByRole } = setup()
      expect(getByRole('checkbox')).toHaveProperty('checked', true)
    })

    it('should change checked when click', async () => {
      const { getByRole } = setup()
      await act(async () => {
        await userEvent.click(getByRole('checkbox'))
      })

      await waitFor(() => {
        expect(mockedUseAppDispatch).toHaveBeenCalledWith(updateTreatFlagCardAsBlock(false))
      })
    })
  })

  it('should show warning message when selectWarningMessage has a value in cycleTime component', () => {
    const { getByText } = setup()

    expect(getByText('Test warning Message')).toBeVisible()
  })

  it('should show disable warning message when selectWarningMessage has a value after two seconds in cycleTime component', async () => {
    jest.useFakeTimers()
    const { queryByText } = setup()

    act(() => {
      jest.advanceTimersByTime(ERROR_MESSAGE_TIME_DURATION)
    })

    await waitFor(() => {
      expect(queryByText('Test warning Message')).not.toBeInTheDocument()
    })
  })
})
