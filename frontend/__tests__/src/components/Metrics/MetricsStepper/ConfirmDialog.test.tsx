import { render } from '@testing-library/react'
import { ConfirmDialog } from '@src/components/Metrics/MetricsStepper/ConfirmDialog'

describe('confirm dialog', () => {
  it('should show confirm dialog', () => {
    const { getByText } = render(<ConfirmDialog />)

    expect(getByText('All the filled data will be cleared. Continue to Home page?')).toBeInTheDocument()
  })
})
