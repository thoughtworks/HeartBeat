import { render, within } from '@testing-library/react'
import { CycleTime } from '@src/components/Metrics/MetricsStep/CycleTime'
import userEvent from '@testing-library/user-event'

const title = 'Cycle Time Settings'
const defaultSelected = '----'
const mockColumnsList = ['Done', 'Blocked', 'Doing', 'TODO', 'Testing']
const FlagAsBlock = 'Consider the "Flag" as "Block"'

const setup = () => render(<CycleTime title={title} columns={mockColumnsList} />)

describe('CycleTime', () => {
  describe('CycleTime Title', () => {
    it('should show Cycle Time title when render Crews component', () => {
      const { getByText } = setup()
      expect(getByText(title)).toBeInTheDocument()
    })
  })

  describe('CycleTime Selector List', () => {
    it('should show selectors title when render Crews component', () => {
      const { getByText } = setup()

      expect(getByText(mockColumnsList[0])).toBeInTheDocument()
      expect(getByText(mockColumnsList[1])).toBeInTheDocument()
      expect(getByText(mockColumnsList[2])).toBeInTheDocument()
      expect(getByText(mockColumnsList[3])).toBeInTheDocument()
      expect(getByText(mockColumnsList[4])).toBeInTheDocument()
    })

    it('should show "----" in selector by create default when initializing', () => {
      const { getAllByText } = setup()
      expect(getAllByText(defaultSelected)).toHaveLength(5)
    })

    it('should show detail options when click included button', async () => {
      const { getAllByRole, getByRole } = setup()
      const columnsArray = getAllByRole('button', { name: 'Done' })
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
      const columnsArray = getAllByRole('button', { name: 'Done' })
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
})
