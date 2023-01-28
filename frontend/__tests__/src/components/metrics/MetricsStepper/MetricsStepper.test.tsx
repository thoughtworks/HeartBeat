import { fireEvent, getByText, render } from '@testing-library/react'
import MetricsStepper from '@src/components/metrics/MetricsStepper'
import '@testing-library/jest-dom'

describe('MetricsStepper', () => {
  it('should show metrics stepper', () => {
    const steps = ['config', 'metrics', 'export']
    const { getByText } = render(<MetricsStepper />)

    steps.map((label) => {
      expect(getByText(label)).toBeInTheDocument()
    })
    expect(getByText('Next')).toBeInTheDocument()
    expect(getByText('Back')).toBeInTheDocument()
  })

  it('should show metrics stepper 2 when click next button given stepper 1', async () => {
    const { getByText } = render(<MetricsStepper />)

    fireEvent.click(getByText('Next'))
    expect(getByText('Step 2')).toBeInTheDocument()
  })

  it('should show metrics stepper 1 when click back button given stepper 2', async () => {
    const { getByText } = render(<MetricsStepper />)

    fireEvent.click(getByText('Next'))
    fireEvent.click(getByText('Back'))
    expect(getByText('Step 1')).toBeInTheDocument()
  })

  it('should show metrics stepper 3 when click next button given stepper 3', async () => {
    const { getByText } = render(<MetricsStepper />)

    fireEvent.click(getByText('Next'))
    fireEvent.click(getByText('Next'))
    fireEvent.click(getByText('Export board data'))
    expect(getByText('Step 3')).toBeInTheDocument()
  })
})
