import { ReportResponseDTO } from '@src/clients/report/dto/response'
import { render } from '@testing-library/react'
import { reportMapper } from '@src/hooks/reportMapper/report'
import { DoraDetail } from '@src/components/Metrics/ReportStep/ReportDetail'

jest.mock('@src/hooks/reportMapper/report')
describe('DoraDetail', () => {
  const data: ReportResponseDTO = {} as ReportResponseDTO

  afterEach(jest.clearAllMocks)

  it('should render a back link', () => {
    ;(reportMapper as jest.Mock).mockReturnValue({})
    const { getByText, getByTestId } = render(<DoraDetail data={data} onBack={jest.fn()} />)
    expect(getByTestId('ArrowBackIcon')).toBeInTheDocument()
    expect(getByText('Back')).toBeInTheDocument()
  })

  describe('Deployment frequency', () => {
    it('should show deploymentFrequencyList when deploymentFrequencyList data is existing', () => {
      ;(reportMapper as jest.Mock).mockReturnValue({
        deploymentFrequencyList: [{ id: 0, name: 'name1', valuesList: [{ name: 'test1', value: 1 }] }],
      })
      const { getByText, getByTestId, container } = render(<DoraDetail data={data} onBack={jest.fn()} />)
      expect(getByText('Deployment frequency')).toBeInTheDocument()
      expect(getByTestId('Deployment frequency')).toBeInTheDocument()
      expect(container.querySelectorAll('tbody > tr').length).toBe(2)
    })

    it('should not show deploymentFrequencyList when deploymentFrequencyList data is not existing', () => {
      ;(reportMapper as jest.Mock).mockReturnValue({
        deploymentFrequencyList: null,
      })
      const { queryAllByText } = render(<DoraDetail data={data} onBack={jest.fn()} />)
      expect(queryAllByText('Deployment frequency').length).toEqual(0)
    })
  })

  describe('Lead time for changes', () => {
    it('should show leadTimeForChangesList when leadTimeForChangesList data is existing', () => {
      ;(reportMapper as jest.Mock).mockReturnValue({
        leadTimeForChangesList: [{ id: 0, name: 'name1', valuesList: [{ name: 'test1', value: 1 }] }],
      })
      const { getByText, getByTestId, container } = render(<DoraDetail data={data} onBack={jest.fn()} />)
      expect(getByText('Lead time for changes')).toBeInTheDocument()
      expect(getByTestId('Lead time for changes')).toBeInTheDocument()
      expect(container.querySelectorAll('tbody > tr').length).toBe(2)
    })

    it('should not show leadTimeForChangesList when leadTimeForChangesList data is not existing', () => {
      ;(reportMapper as jest.Mock).mockReturnValue({
        leadTimeForChangesList: null,
      })
      const { queryAllByText } = render(<DoraDetail data={data} onBack={jest.fn()} />)
      expect(queryAllByText('Lead time for changes').length).toEqual(0)
    })
  })

  describe('Change failure rate', () => {
    it('should show changeFailureRateList when changeFailureRateList data is existing', () => {
      ;(reportMapper as jest.Mock).mockReturnValue({
        changeFailureRateList: [{ id: 0, name: 'name1', valuesList: [{ name: 'test1', value: 1 }] }],
      })
      const { getByText, getByTestId, container } = render(<DoraDetail data={data} onBack={jest.fn()} />)
      expect(getByText('Change failure rate')).toBeInTheDocument()
      expect(getByTestId('Change failure rate')).toBeInTheDocument()
      expect(container.querySelectorAll('tbody > tr').length).toBe(2)
    })

    it('should not show changeFailureRateList when changeFailureRateList data is not existing', () => {
      ;(reportMapper as jest.Mock).mockReturnValue({
        changeFailureRateList: null,
      })
      const { queryAllByText } = render(<DoraDetail data={data} onBack={jest.fn()} />)
      expect(queryAllByText('Change failure rate').length).toEqual(0)
    })
  })

  describe('Mean Time To Recovery', () => {
    it('should show meanTimeToRecoveryList when meanTimeToRecoveryList data is existing', () => {
      ;(reportMapper as jest.Mock).mockReturnValue({
        meanTimeToRecoveryList: [{ id: 0, name: 'name1', valuesList: [{ name: 'test1', value: 1 }] }],
      })
      const { getByText, getByTestId, container } = render(<DoraDetail data={data} onBack={jest.fn()} />)
      expect(getByText('Mean Time To Recovery')).toBeInTheDocument()
      expect(getByTestId('Mean Time To Recovery')).toBeInTheDocument()
      expect(container.querySelectorAll('tbody > tr').length).toBe(2)
    })

    it('should not show meanTimeToRecoveryList when meanTimeToRecoveryList data is not existing', () => {
      ;(reportMapper as jest.Mock).mockReturnValue({
        meanTimeToRecoveryList: null,
      })
      const { queryAllByText } = render(<DoraDetail data={data} onBack={jest.fn()} />)
      expect(queryAllByText('Mean Time To Recovery').length).toEqual(0)
    })
  })
})
