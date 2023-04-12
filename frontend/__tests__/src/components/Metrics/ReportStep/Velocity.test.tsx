import { render } from '@testing-library/react'
import { Velocity } from '@src/components/Metrics/ReportStep/Velocity'
import { VelocityMetricName } from '../../../fixtures'

describe('Velocity component', () => {
  const mockTitle = 'Test Velocity'

  const mockVelocityData = [
    { id: 1, name: 'Velocity(SP)', value: ['20'] },
    { id: 2, name: 'ThroughPut(Cards Count)', value: ['15'] },
  ]
  const setup = () => render(<Velocity title={mockTitle} velocityData={mockVelocityData} />)

  test('renders the component with the correct title and data', () => {
    const { getByText } = setup()

    expect(getByText(mockTitle)).toBeInTheDocument()
    expect(getByText(VelocityMetricName.VELOCITY_SP)).toBeInTheDocument()
    expect(getByText(VelocityMetricName.THROUGHPUT_CARDS_COUNT)).toBeInTheDocument()
  })
})
