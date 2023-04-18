import { render } from '@testing-library/react'
import { Provider } from 'react-redux'
import { store } from '@src/store'
import { LeadTimeForChanges } from '@src/components/Metrics/MetricsStep/LeadTimeForChanges'
import { addALeadTimeForChanges } from '@src/context/Metrics/metricsSlice'
import userEvent from '@testing-library/user-event'

export const LEAD_TIME_FOR_CHANGES = 'Lead Time for Changes'

jest.mock('@src/hooks', () => ({
  useAppDispatch: () => jest.fn(),
}))

jest.mock('@src/context/Metrics/metricsSlice', () => ({
  addALeadTimeForChanges: jest.fn(),
}))

const setup = () =>
  render(
    <Provider store={store}>
      <LeadTimeForChanges />
    </Provider>
  )

describe('LeadTimeForChanges', () => {
  afterEach(() => {
    jest.clearAllMocks()
  })

  it('should render LeadTimeForChanges', () => {
    const { getByText } = setup()

    expect(getByText(LEAD_TIME_FOR_CHANGES)).toBeInTheDocument()
  })

  it('should call addALeadTimeForChanges function when click add another pipeline button', async () => {
    const { getByRole } = await setup()

    await userEvent.click(getByRole('button'))

    expect(addALeadTimeForChanges).toHaveBeenCalledTimes(1)
  })
})
