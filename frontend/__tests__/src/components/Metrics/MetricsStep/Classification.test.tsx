import { act, render, waitFor, within } from '@testing-library/react'
import { Classification } from '@src/components/Metrics/MetricsStep/Classification'
import userEvent from '@testing-library/user-event'
import { setupStore } from '../../../utils/setupStoreUtil'
import { Provider } from 'react-redux'
import { ERROR_MESSAGE_TIME_DURATION } from '../../../fixtures'

const mockTitle = 'Classification Setting'
const mockLabel = 'Distinguished by'
const mockTargetFields = [
  { flag: true, key: 'issue', name: 'Issue' },
  { flag: false, key: 'type', name: 'Type' },
]

jest.mock('@src/context/config/configSlice', () => ({
  ...jest.requireActual('@src/context/config/configSlice'),
  selectIsProjectCreated: jest.fn().mockReturnValue(false),
}))

jest.mock('@src/context/Metrics/metricsSlice', () => ({
  ...jest.requireActual('@src/context/Metrics/metricsSlice'),
  selectClassificationWarningMessage: jest.fn().mockReturnValue('Test warning Message'),
}))

let store = setupStore()
const setup = () => {
  return render(
    <Provider store={store}>
      <Classification title={mockTitle} label={mockLabel} targetFields={mockTargetFields} />
    </Provider>
  )
}

describe('Classification', () => {
  beforeEach(() => {
    store = setupStore()
  })

  afterEach(() => {
    jest.clearAllMocks()
  })

  it('should show Classification when render Classification component', () => {
    const { getByText } = setup()

    expect(getByText(mockTitle)).toBeInTheDocument()
    expect(getByText(mockLabel)).toBeInTheDocument()
  })

  it('should show default options when initialization', () => {
    const { queryByText, getByText } = setup()

    expect(getByText('Issue')).toBeInTheDocument()
    expect(queryByText('Type')).not.toBeInTheDocument()
  })

  it('should show all options when click selectBox', async () => {
    const { getByRole } = setup()
    await act(async () => {
      await userEvent.click(getByRole('combobox', { name: mockLabel }))
    })

    expect(getByRole('option', { name: 'Issue' })).toBeInTheDocument()
    expect(getByRole('option', { name: 'Type' })).toBeInTheDocument()
  })

  it('should show all targetField when click All and show nothing when cancel click', async () => {
    const { getByText, getByRole, queryByRole } = setup()
    await act(async () => {
      await userEvent.click(getByRole('combobox', { name: mockLabel }))
    })
    await act(async () => {
      await userEvent.click(getByText('All'))
    })
    const names = mockTargetFields.map((item) => item.name)

    expect(getByRole('button', { name: names[0] })).toBeVisible()
    expect(getByRole('button', { name: names[1] })).toBeVisible()

    await act(async () => {
      await userEvent.click(getByText('All'))
    })

    expect(queryByRole('button', { name: names[0] })).not.toBeInTheDocument()
    expect(queryByRole('button', { name: names[1] })).not.toBeInTheDocument()
  })

  it('should show selected targetField when click selected field', async () => {
    const { getByRole, getByText, queryByRole } = setup()
    const names = mockTargetFields.map((item) => item.name)

    await act(async () => {
      await userEvent.click(getByRole('combobox', { name: mockLabel }))
    })
    await act(async () => {
      await userEvent.click(getByText('All'))
    })
    await act(async () => {
      await userEvent.click(getByText('All'))
    })

    const listBox = within(getByRole('listbox'))

    await act(async () => {
      await userEvent.click(listBox.getByRole('option', { name: names[0] }))
    })

    expect(queryByRole('button', { name: names[0] })).toBeInTheDocument()
    expect(queryByRole('button', { name: names[1] })).not.toBeInTheDocument()
  })

  it('should show warning message when classification warning message has a value in cycleTime component', () => {
    const { getByText } = setup()

    expect(getByText('Test warning Message')).toBeVisible()
  })

  it('should show disable warning message when classification warning message has a value after two seconds in cycleTime component', async () => {
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
