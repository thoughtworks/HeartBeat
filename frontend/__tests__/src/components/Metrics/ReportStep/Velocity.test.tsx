import { render } from '@testing-library/react'
import { Velocity } from '@src/components/Metrics/ReportStep/Velocity'
import { VelocityMetric } from '../../../fixtures'

describe('Velocity component', () => {
  const mockTitle = 'Test Velocity'
  const mockVelocityData = { velocityForSP: '4', velocityForCards: '2' }

  const setup = () => render(<Velocity title={mockTitle} velocityData={mockVelocityData} />)

  test('renders the component with the correct title and data', () => {
    const { getByText } = setup()

    expect(getByText(mockTitle)).toBeInTheDocument()
    expect(getByText(VelocityMetric.VELOCITY_SP)).toBeInTheDocument()
    expect(getByText(VelocityMetric.THROUGHPUT_CARDS_COUNT)).toBeInTheDocument()
  })
})
