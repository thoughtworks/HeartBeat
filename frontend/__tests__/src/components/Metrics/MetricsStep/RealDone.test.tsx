import { act, render, waitFor, within } from '@testing-library/react'
import { RealDone } from '@src/components/Metrics/MetricsStep/RealDone'
import userEvent from '@testing-library/user-event'
import { setupStore } from '../../../utils/setupStoreUtil'
import { Provider } from 'react-redux'
import { saveCycleTimeSettings } from '@src/context/Metrics/metricsSlice'
import { ERROR_MESSAGE_TIME_DURATION } from '../../../fixtures'

jest.mock('@src/context/Metrics/metricsSlice', () => ({
  ...jest.requireActual('@src/context/Metrics/metricsSlice'),
  selectRealDoneWarningMessage: jest.fn().mockReturnValue('Test warning Message'),
}))

const mockColumnsList = [
  {
    key: 'done',
    value: {
      name: 'Done',
      statuses: ['DONE', 'CANCELLED'],
    },
  },
]

const mockTitle = 'RealDone'
const mockLabel = 'Consider as Done'
let store = setupStore()
const setup = () =>
  render(
    <Provider store={store}>
      <RealDone columns={mockColumnsList} label={mockLabel} title={mockTitle} />
    </Provider>
  )

describe('RealDone', () => {
  beforeEach(() => {
    store = setupStore()
  })

  afterEach(() => {
    jest.clearAllMocks()
  })

  it('should show RealDone when render RealDone component', () => {
    const { getByText } = setup()

    expect(getByText(mockTitle)).toBeInTheDocument()
  })

  it('should show consider as done when initializing', () => {
    const { getByText } = setup()
    const label = getByText(mockLabel)
    const helperText = getByText('consider as Done')

    expect(label).toBeInTheDocument()
    expect(helperText.tagName).toBe('STRONG')
  })

  it('should show detail options when click Consider as Done button', async () => {
    const { getByRole } = setup()
    await userEvent.click(getByRole('button', { name: mockLabel }))
    const listBox = within(getByRole('listbox'))
    const options = listBox.getAllByRole('option')
    const optionValue = options.map((li) => li.getAttribute('data-value'))

    expect(optionValue).toEqual(['All', 'DONE', 'CANCELLED'])
  })

  it('should show other selections when cancel one option given default all selections in RealDone', async () => {
    const { getByRole } = setup()

    await userEvent.click(getByRole('button', { name: mockLabel }))

    const listBox = within(getByRole('listbox'))
    await userEvent.click(listBox.getByRole('option', { name: mockColumnsList[0].value.statuses[0] }))

    expect(listBox.getByRole('option', { name: mockColumnsList[0].value.statuses[0] })).toHaveProperty('selected', true)
    expect(listBox.getByRole('option', { name: mockColumnsList[0].value.statuses[1] })).toHaveProperty(
      'selected',
      false
    )
  })

  it('should clear RealDone data when check all option', async () => {
    const { getByRole } = setup()

    await userEvent.click(getByRole('button', { name: mockLabel }))
    const listBox = within(getByRole('listbox'))
    const allOption = listBox.getByRole('option', { name: 'All' })
    await userEvent.click(allOption)

    expect(listBox.getByRole('option', { name: mockColumnsList[0].value.statuses[0] })).toHaveProperty('selected', true)
    expect(listBox.getByRole('option', { name: mockColumnsList[0].value.statuses[1] })).toHaveProperty('selected', true)

    await userEvent.click(allOption)

    expect(listBox.getByRole('option', { name: mockColumnsList[0].value.statuses[0] })).toHaveProperty(
      'selected',
      false
    )
    expect(listBox.getByRole('option', { name: mockColumnsList[0].value.statuses[1] })).toHaveProperty(
      'selected',
      false
    )
  })

  it('should show doing when choose Testing column is Done', async () => {
    await store.dispatch(saveCycleTimeSettings([{ name: 'Done', value: 'Done' }]))
    const { getByRole } = setup()

    await userEvent.click(getByRole('button', { name: mockLabel }))
    const listBox = within(getByRole('listbox'))
    const allOption = listBox.getByRole('option', { name: 'All' })
    await userEvent.click(allOption)

    expect(listBox.getByRole('option', { name: 'DONE' })).toHaveProperty('selected', true)
    expect(listBox.getByRole('option', { name: 'CANCELLED' })).toHaveProperty('selected', true)
  })

  it('should show warning message when realDone warning message has a value in realDone component', () => {
    const { getByText } = setup()

    expect(getByText('Test warning Message')).toBeInTheDocument()
  })

  it('should clear warning message when realDone warning message has a value after four seconds in realDone component', async () => {
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
