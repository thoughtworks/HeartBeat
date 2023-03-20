import { render, within } from '@testing-library/react'
import { CycleTime } from '@src/components/Metrics/MetricsStep/CycleTime'
import userEvent from '@testing-library/user-event'
import { Provider } from 'react-redux'
import { setupStore } from '../../../utils/setupStoreUtil'
import { CYCLE_TIME_SETTINGS } from '../../../fixtures'

let store = setupStore()

beforeEach(() => {
  store = setupStore()
})

const DEFAULT_SELECTED = '----'
const mockColumnsList = [
  {
    key: 'indeterminate',
    value: {
      name: 'Doing',
      statuses: ['DOING'],
    },
  },
  {
    key: 'indeterminate',
    value: {
      name: 'Testing',
      statuses: ['TESTING'],
    },
  },
  {
    key: 'indeterminate',
    value: {
      name: 'TODO',
      statuses: ['TODO'],
    },
  },
  {
    key: 'done',
    value: {
      name: 'Done',
      statuses: ['DONE', 'CANCELLED'],
    },
  },
  {
    key: 'indeterminate',
    value: {
      name: 'Blocked',
      statuses: ['BLOCKED'],
    },
  },
]
const errorMessage = 'Should only select One "Done"'

const FlagAsBlock = 'Consider the "Flag" as "Block"'

const setup = () =>
  render(
    <Provider store={store}>
      <CycleTime title={CYCLE_TIME_SETTINGS} columns={mockColumnsList} />
    </Provider>
  )

describe('CycleTime', () => {
  describe('CycleTime Title', () => {
    it('should show Cycle Time title when render Crews component', () => {
      const { getByText } = setup()
      expect(getByText(CYCLE_TIME_SETTINGS)).toBeInTheDocument()
    })
  })

  describe('CycleTime Selector List', () => {
    it('should show selectors title when render Crews component', () => {
      const { getByText } = setup()

      expect(getByText(mockColumnsList[0].value.name)).toBeInTheDocument()
      expect(getByText(mockColumnsList[1].value.name)).toBeInTheDocument()
      expect(getByText(mockColumnsList[2].value.name)).toBeInTheDocument()
      expect(getByText(mockColumnsList[3].value.name)).toBeInTheDocument()
      expect(getByText(mockColumnsList[4].value.name)).toBeInTheDocument()
    })

    it('should show "----" in selector by create default when initializing', () => {
      const { getAllByText } = setup()
      expect(getAllByText(DEFAULT_SELECTED)).toHaveLength(5)
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
        'In dev',
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
      await userEvent.click(columnsArray[3])
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

      expect(getByText(errorMessage)).toBeInTheDocument()
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
})
