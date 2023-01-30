import { fireEvent, render } from '@testing-library/react'
import MetricsStepper from '@src/components/metrics/MetricsStepper'
import '@testing-library/jest-dom'

const NEXT = 'Next'
const BACK = 'Back'
const ExportBoardData = 'Export board data'
const steps = ['Config', 'Metrics', 'Export']

describe('MetricsStepper', () => {
  it('should show metrics stepper', () => {
    const { getByText } = render(<MetricsStepper />)

    steps.map((label) => {
      expect(getByText(label)).toBeInTheDocument()
    })
    expect(getByText(NEXT)).toBeInTheDocument()
    expect(getByText(BACK)).toBeInTheDocument()
  })

  it('should show metrics stepper 2 when click next button given stepper 1', async () => {
    const { getByText } = render(<MetricsStepper />)

    fireEvent.click(getByText(NEXT))
    expect(getByText('Step 2')).toBeInTheDocument()
  })

  it('should show metrics stepper 1 when click back button given stepper 2', async () => {
    const { getByText } = render(<MetricsStepper />)

    fireEvent.click(getByText(NEXT))
    fireEvent.click(getByText(BACK))
    expect(getByText('Step 1')).toBeInTheDocument()
  })

  it('should show metrics stepper 3 when click next button given stepper 3', async () => {
    const { getByText } = render(<MetricsStepper />)

    fireEvent.click(getByText(NEXT))
    fireEvent.click(getByText(NEXT))
    fireEvent.click(getByText(ExportBoardData))
    expect(getByText('Step 3')).toBeInTheDocument()
  })
})
