import { render } from '@testing-library/react'
import { Provider } from 'react-redux'
import { store } from '@src/store'
import { LeadTimeForChanges } from '@src/components/Metrics/MetricsStep/LeadTimeForChanges'
import { addALeadTimeForChanges, deleteALeadTimeForChange } from '@src/context/Metrics/metricsSlice'
import userEvent from '@testing-library/user-event'

export const LEAD_TIME_FOR_CHANGES = 'Lead Time for Changes'

jest.mock('@src/hooks', () => ({
  useAppDispatch: () => jest.fn(),
  useAppSelector: jest.fn().mockReturnValue([
    { id: 1, organization: '', pipelineName: '', steps: '' },
    { id: 2, organization: '', pipelineName: '', steps: '' },
  ]),
}))

jest.mock('@src/context/Metrics/metricsSlice', () => ({
  addALeadTimeForChanges: jest.fn(),
  deleteALeadTimeForChange: jest.fn(),
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
    const { getByTestId } = await setup()

    await userEvent.click(getByTestId('AddIcon'))

    expect(addALeadTimeForChanges).toHaveBeenCalledTimes(1)
  })

  it('should call deleteALeadTimeForChanges function when click remove pipeline button', async () => {
    const { getAllByRole } = await setup()

    await userEvent.click(getAllByRole('button', { name: 'Remove' })[0])

    expect(deleteALeadTimeForChange).toHaveBeenCalledTimes(1)
  })
})
