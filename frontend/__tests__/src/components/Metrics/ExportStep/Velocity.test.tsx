import { render } from '@testing-library/react'
import { Velocity } from '@src/components/Metrics/ExportStep/Velocity'

describe('Velocity component', () => {
  const mockTitle = 'Test Velocity'
  const mockVelocityData = [
    { name: 'test1', value: 10 },
    { name: 'test2', value: 3 },
  ]
  const setup = () => render(<Velocity title={mockTitle} velocityData={mockVelocityData} />)

  test('renders the component with the correct title and data', () => {
    const { getByText } = setup()

    expect(getByText(mockTitle)).toBeInTheDocument()
    expect(getByText(mockVelocityData[0].name)).toBeInTheDocument()
    expect(getByText(mockVelocityData[1].value)).toBeInTheDocument()
  })
})
