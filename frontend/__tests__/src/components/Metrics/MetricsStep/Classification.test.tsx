import { render } from '@testing-library/react'
import { Classification } from '@src/components/Metrics/MetricsStep/Classification'

const mockTitle = 'Classification Setting'
const mockLabel = 'Distinguished By'
const setup = () => {
  return render(<Classification title={mockTitle} label={mockLabel} />)
}

describe('Classification', () => {
  it('should show Classification when render Classification component', () => {
    const { getByText } = setup()

    expect(getByText(mockTitle)).toBeInTheDocument()
    expect(getByText(mockLabel)).toBeInTheDocument()
  })
})
