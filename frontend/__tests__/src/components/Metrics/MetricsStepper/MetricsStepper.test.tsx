import { fireEvent, render } from '@testing-library/react'
import MetricsStepper from '@src/components/Metrics/MetricsStepper'
import { Provider } from 'react-redux'
import { setupStore } from '../../../utils/setupStoreUtil'
import { BACK, EXPORT_BOARD_DATA, NEXT, PROJECT_NAME_LABEL, STEPS } from '../../../fixtures'

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

  it('should show metrics metrics step when click next button given config step', async () => {
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
})
