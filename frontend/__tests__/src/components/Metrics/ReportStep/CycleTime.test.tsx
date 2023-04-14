import { render } from '@testing-library/react'
import { CycleTimeReport } from '@src/components/Metrics/ReportStep/CycleTime'
import { CycleTimeMetricsName } from '../../../fixtures'

describe('Cycle Time component', () => {
  const mockTitle = 'Test Cycle Time'

  const mockCycleTimeData = [
    { id: 1, name: 'Average cycle time', valueList: ['21.18', '30.26'] },
    { id: 2, name: 'Total development time/Total cycle time', valueList: ['0.57'] },
    { id: 3, name: 'Total waiting for testing time/Total cycle time', valueList: ['0.01'] },
    { id: 4, name: 'Total block time/Total cycle time', valueList: ['0.40'] },
    { id: 5, name: 'Total review time/Total cycle time', valueList: ['0.01'] },
    { id: 6, name: 'Total testing time/Total cycle time', valueList: ['0.00'] },
    { id: 7, name: 'Average development time', valueList: ['12.13', '17.32'] },
    { id: 8, name: 'Average waiting for testing time', valueList: ['0.16', '0.23'] },
    { id: 9, name: 'Average block time', valueList: ['8.54', '12.20'] },
    { id: 10, name: 'Average review time', valueList: ['0.26', '0.36'] },
    { id: 11, name: 'Average testing time', valueList: ['0.10', '0.14'] },
  ]
  const setup = () => render(<CycleTimeReport title={mockTitle} cycleTimeData={mockCycleTimeData} />)

  test('renders the component with the correct title and data', () => {
    const { getByText } = setup()

    expect(getByText(mockTitle)).toBeInTheDocument()
    expect(getByText(CycleTimeMetricsName.AVERAGE_CYCLE_TIME)).toBeInTheDocument()
    expect(getByText(CycleTimeMetricsName.DEVELOPMENT_PROPORTION)).toBeInTheDocument()
    expect(getByText(CycleTimeMetricsName.WAITING_PROPORTION)).toBeInTheDocument()
    expect(getByText(CycleTimeMetricsName.BLOCK_PROPORTION)).toBeInTheDocument()
    expect(getByText(CycleTimeMetricsName.REVIEW_PROPORTION)).toBeInTheDocument()
    expect(getByText(CycleTimeMetricsName.TESTING_PROPORTION)).toBeInTheDocument()
    expect(getByText(CycleTimeMetricsName.AVERAGE_DEVELOPMENT_TIME)).toBeInTheDocument()
    expect(getByText(CycleTimeMetricsName.AVERAGE_WAITING_TIME)).toBeInTheDocument()
    expect(getByText(CycleTimeMetricsName.AVERAGE_BLOCK_TIME)).toBeInTheDocument()
    expect(getByText(CycleTimeMetricsName.AVERAGE_REVIEW_TIME)).toBeInTheDocument()
    expect(getByText(CycleTimeMetricsName.AVERAGE_TESTING_TIME)).toBeInTheDocument()
  })
})
