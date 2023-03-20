import { fireEvent, render } from '@testing-library/react'
import MetricsStepper from '@src/components/Metrics/MetricsStepper'
import { Provider } from 'react-redux'
import { setupStore } from '../../../utils/setupStoreUtil'
import { BACK, CONFIRM_DIALOG_DESCRIPTION, EXPORT_BOARD_DATA, NEXT, PROJECT_NAME_LABEL, STEPS } from '../../../fixtures'
import userEvent from '@testing-library/user-event'

const mockedUsedNavigate = jest.fn()
jest.mock('react-router-dom', () => ({
  ...jest.requireActual('react-router-dom'),
  useNavigate: () => mockedUsedNavigate,
}))
const YES = 'Yes'
const CANCEL = 'Cancel'
const METRICS = 'Metrics'
const EXPORT = 'Export'
const stepperColor = 'rgba(0, 0, 0, 0.87)'
let store = setupStore()

beforeEach(() => {
  store = setupStore()
})

const setup = () =>
  render(
    <Provider store={store}>
      <MetricsStepper />
    </Provider>
  )

describe('MetricsStepper', () => {
  it('should show metrics stepper', () => {
    const { getByText } = setup()

    STEPS.map((label) => {
      expect(getByText(label)).toBeInTheDocument()
    })

    expect(getByText(NEXT)).toBeInTheDocument()
    expect(getByText(BACK)).toBeInTheDocument()
  })

  it('should show metrics config step when click back button given config step ', () => {
    const { getByText } = setup()

    fireEvent.click(getByText(BACK))

    expect(getByText(PROJECT_NAME_LABEL)).toBeInTheDocument()
  })

  it('should show metrics step when click next button given config step', async () => {
    const { getByText } = setup()

    fireEvent.click(getByText(NEXT))

    expect(getByText(METRICS)).toHaveStyle(`color:${stepperColor}`)
  })

  it('should show metrics config step when click back button given metrics step', () => {
    const { getByText } = setup()

    fireEvent.click(getByText(NEXT))
    fireEvent.click(getByText(BACK))

    expect(getByText(PROJECT_NAME_LABEL)).toBeInTheDocument()
  })

  it('should show metrics export step when click next button given export step', () => {
    const { getByText } = setup()

    fireEvent.click(getByText(NEXT))
    fireEvent.click(getByText(NEXT))
    fireEvent.click(getByText(EXPORT_BOARD_DATA))

    expect(getByText(EXPORT)).toHaveStyle(`color:${stepperColor}`)
  })

  it('should show confirm dialog when click back button in config page', async () => {
    const { getByText } = setup()

    await userEvent.click(getByText(BACK))

    expect(getByText(CONFIRM_DIALOG_DESCRIPTION)).toBeInTheDocument()
  })

  it('should close confirm dialog when click cancel button', async () => {
    const { getByText, queryByText } = setup()

    await userEvent.click(getByText(BACK))
    await userEvent.click(getByText(CANCEL))

    expect(queryByText(CONFIRM_DIALOG_DESCRIPTION)).not.toBeInTheDocument()
  })

  it('should go to home page when click Yes button', async () => {
    const { getByText } = setup()

    await userEvent.click(getByText(BACK))

    expect(getByText(YES)).toBeVisible()

    await userEvent.click(getByText(YES))

    expect(mockedUsedNavigate).toHaveBeenCalledTimes(1)
    expect(mockedUsedNavigate).toHaveBeenCalledWith('/home')
  })
})
