import { render } from '@testing-library/react'
import { Velocity } from '@src/components/Metrics/ReportStep/Velocity'
import { VelocityMetricName } from '../../../fixtures'

describe('Velocity component', () => {
  const mockTitle = 'Test Velocity'

  const mockVelocityData = [
    { id: 0, name: 'Velocity(Story Point)', valueList: ['20'] },
    { id: 1, name: 'Throughput(Cards Count)', valueList: ['15'] },
  ]
  const setup = () => render(<Velocity title={mockTitle} velocityData={mockVelocityData} />)

  test('renders the component with the correct title and data', () => {
    const { getByText } = setup()

    expect(getByText(mockTitle)).toBeInTheDocument()
    expect(getByText(VelocityMetricName.VELOCITY_SP)).toBeInTheDocument()
    expect(getByText(VelocityMetricName.THROUGHPUT_CARDS_COUNT)).toBeInTheDocument()
  })
})
