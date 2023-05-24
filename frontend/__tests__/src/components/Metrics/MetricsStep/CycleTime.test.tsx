import { render, waitFor, within } from '@testing-library/react'
import { CycleTime } from '@src/components/Metrics/MetricsStep/CycleTime'
import userEvent from '@testing-library/user-event'
import { Provider } from 'react-redux'
import { setupStore } from '../../../utils/setupStoreUtil'
import { CYCLE_TIME_SETTINGS } from '../../../fixtures'

const DEFAULT_SELECTED = '----'

const errorMessage = 'Only one column can be selected as "Done"'

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
  selectCycleTimeWarningMessage: jest.fn().mockReturnValue('Test warning Message'),
}))

jest.mock('@src/context/config/configSlice', () => ({
  ...jest.requireActual('@src/context/config/configSlice'),
  selectPipelineOrganizations: jest.fn().mockReturnValue(['mockOrgName']),
  selectPipelineNames: jest.fn().mockReturnValue(['']),
  selectSteps: jest.fn().mockReturnValue(['']),
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

    it('should show "----" in selector by create default when initializing', () => {
      const { getAllByText } = setup()

      expect(getAllByText(DEFAULT_SELECTED)).toHaveLength(1)
    })

    it('should show detail options when click included button', async () => {
      const { getAllByRole, getByRole } = setup()
      const columnsArray = getAllByRole('button', { name: 'Doing' })
      await userEvent.click(columnsArray[0])
      const listBox = within(getByRole('listbox'))
      const options = listBox.getAllByRole('option')
      const optionValue = options.map((li) => li.getAttribute('data-value'))

      expect(optionValue).toEqual([
        '----',
        'To do',
        'Analysis',
        'In Dev',
        'Block',
        'Waiting for testing',
        'Testing',
        'Review',
        'Done',
      ])
    })

    it('should show other selections when change option', async () => {
      const { getAllByRole, getByRole, getByText } = setup()
      const columnsArray = getAllByRole('button', { name: 'Doing' })
      await userEvent.click(columnsArray[2])
      const listBox = within(getByRole('listbox'))
      const mockOption = listBox.getByRole('option', { name: 'To do' })
      await userEvent.click(mockOption)

      expect(getByText('To do')).toBeInTheDocument()
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
      await userEvent.click(getByRole('checkbox'))
      expect(getByRole('checkbox')).toHaveProperty('checked', false)
      await userEvent.click(getByRole('checkbox'))
      expect(getByRole('checkbox')).toHaveProperty('checked', true)
    })
  })

  describe('Error message ', () => {
    it('should show error message when select more than one Done option', async () => {
      const { getAllByRole, getByRole, getByText } = setup()
      const columnsArray = getAllByRole('button', { name: 'Doing' })
      await userEvent.click(columnsArray[0])
      const listBoxZero = within(getByRole('listbox'))
      const mockOptionDone = listBoxZero.getByRole('option', { name: 'Done' })
      await userEvent.click(mockOptionDone)
      await userEvent.click(columnsArray[1])
      const listBoxOne = within(getByRole('listbox'))
      const mockOptionOneDone = listBoxOne.getByRole('option', { name: 'Done' })
      await userEvent.click(mockOptionOneDone)

      await waitFor(() => expect(getByText(errorMessage)).toBeInTheDocument())
    })

    it('should not show error message when select less than one Done option', async () => {
      const { getAllByRole, getByRole, queryByText } = setup()
      const columnsArray = getAllByRole('button', { name: 'Doing' })
      await userEvent.click(columnsArray[0])
      const listBoxZero = within(getByRole('listbox'))
      const mockOptionDone = listBoxZero.getByRole('option', { name: 'Done' })
      await userEvent.click(mockOptionDone)
      await userEvent.click(columnsArray[1])
      const listBoxOne = within(getByRole('listbox'))
      const mockOptionOneDone = listBoxOne.getByRole('option', { name: 'Done' })
      await userEvent.click(mockOptionOneDone)
      await userEvent.click(columnsArray[0])
      const listBoxTwo = within(getByRole('listbox'))
      const mockOptionTwoDone = listBoxTwo.getByRole('option', { name: 'To do' })
      await userEvent.click(mockOptionTwoDone)

      expect(queryByText(errorMessage)).not.toBeInTheDocument()
    })
  })

  it('should show warning message when selectWarningMessage has a value in cycleTime component', () => {
    const { getByText } = setup()

    expect(getByText('Test warning Message')).toBeVisible()
  })

  it('should show disable warning message when selectWarningMessage has a value after two seconds in cycleTime component', () => {
    const { queryByText } = setup()

    setTimeout(() => {
      expect(queryByText('Test warning Message')).not.toBeInTheDocument()
    }, 2000)
  })
})
