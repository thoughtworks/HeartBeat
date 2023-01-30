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

  it('should show metrics config step when click back button given config step ', () => {
    const { getByText } = render(<MetricsStepper />)

    fireEvent.click(getByText(BACK))
    expect(getByText('Step 1')).toBeInTheDocument()
  })

  it('should show metrics metrics step when click next button given config step', async () => {
    const { getByText } = render(<MetricsStepper />)

    fireEvent.click(getByText(NEXT))
    expect(getByText('Step 2')).toBeInTheDocument()
  })

  it('should show metrics config step when click back button given metrics step', async () => {
    const { getByText } = render(<MetricsStepper />)

    fireEvent.click(getByText(NEXT))
    fireEvent.click(getByText(BACK))
    expect(getByText('Step 1')).toBeInTheDocument()
  })

  it('should show metrics export step when click next button given export step', async () => {
    const { getByText } = render(<MetricsStepper />)

    fireEvent.click(getByText(NEXT))
    fireEvent.click(getByText(NEXT))
    fireEvent.click(getByText(ExportBoardData))
    expect(getByText('Step 3')).toBeInTheDocument()
  })
})
