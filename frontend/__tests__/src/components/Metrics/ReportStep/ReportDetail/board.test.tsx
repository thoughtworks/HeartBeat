import { ReportResponseDTO } from '@src/clients/report/dto/response'
import { render } from '@testing-library/react'
import { BoardDetail } from '@src/components/Metrics/ReportStep/ReportDetail'
import { reportMapper } from '@src/hooks/reportMapper/report'

jest.mock('@src/hooks/reportMapper/report')

describe('board', () => {
  const data: ReportResponseDTO = {} as ReportResponseDTO

  afterEach(jest.clearAllMocks)

  it('should render a back link', () => {
    ;(reportMapper as jest.Mock).mockReturnValue({})
    const { getByText, getByTestId } = render(<BoardDetail data={data} onBack={jest.fn()} />)
    expect(getByTestId('ArrowBackIcon')).toBeInTheDocument()
    expect(getByText('Back')).toBeInTheDocument()
  })

  describe('Velocity', () => {
    it('should show velocity when velocity data is existing', () => {
      ;(reportMapper as jest.Mock).mockReturnValue({
        velocityList: [
          { id: 0, name: 'name1', valueList: [{ value: 1 }] },
          { id: 1, name: 'name2', valueList: [{ value: 2 }] },
        ],
      })
      const { getByText, getByTestId, container } = render(<BoardDetail data={data} onBack={jest.fn()} />)
      expect(getByText('Velocity')).toBeInTheDocument()
      expect(getByTestId('Velocity')).toBeInTheDocument()
      expect(container.querySelectorAll('tbody > tr').length).toBe(2)
    })

    it('should not show velocity when velocity data is not existing', () => {
      ;(reportMapper as jest.Mock).mockReturnValue({
        velocityList: null,
      })
      const { queryAllByText } = render(<BoardDetail data={data} onBack={jest.fn()} />)
      expect(queryAllByText('Velocity').length).toEqual(0)
    })
  })

  describe('Cycle time', () => {
    it('should show cycle time when cycle time data is existing', () => {
      ;(reportMapper as jest.Mock).mockReturnValue({
        cycleTimeList: [
          { id: 0, name: 'name1', valueList: [{ value: 1 }] },
          { id: 1, name: 'name2', valueList: [{ value: 2 }] },
          { id: 2, name: 'name3', valueList: [{ value: 3 }] },
        ],
      })
      const { getByText, getByTestId, container } = render(<BoardDetail data={data} onBack={jest.fn()} />)
      expect(getByText('Cycle time')).toBeInTheDocument()
      expect(getByTestId('Cycle time')).toBeInTheDocument()
      expect(container.querySelectorAll('tbody > tr').length).toBe(3)
    })

    it('should not show cycle time when cycle time data is not existing', () => {
      ;(reportMapper as jest.Mock).mockReturnValue({
        cycleTimeList: null,
      })
      const { queryAllByText } = render(<BoardDetail data={data} onBack={jest.fn()} />)
      expect(queryAllByText('Cycle time').length).toEqual(0)
    })
  })

  describe('Classification', () => {
    it('should show classifications when classifications data is existing', () => {
      ;(reportMapper as jest.Mock).mockReturnValue({
        classification: [
          { id: 0, name: 'name1', valuesList: [{ name: 'test1', value: 1 }] },
          { id: 1, name: 'name2', valuesList: [{ name: 'test2', value: 2 }] },
          { id: 2, name: 'name3', valuesList: [{ name: 'test3', value: 3 }] },
          { id: 3, name: 'name4', valuesList: [{ name: 'test4', value: 4 }] },
        ],
      })
      const { getByText, getByTestId, container } = render(<BoardDetail data={data} onBack={jest.fn()} />)
      expect(getByText('Classifications')).toBeInTheDocument()
      expect(getByTestId('Classifications')).toBeInTheDocument()
      expect(container.querySelectorAll('tbody > tr').length).toBe(8)
    })

    it('should not show classifications when classifications data is not existing', () => {
      ;(reportMapper as jest.Mock).mockReturnValue({
        classification: null,
      })
      const { queryAllByText } = render(<BoardDetail data={data} onBack={jest.fn()} />)
      expect(queryAllByText('Classifications').length).toEqual(0)
    })
  })

  it('should show all data when all data is existing', () => {
    ;(reportMapper as jest.Mock).mockReturnValue({
      velocityList: [{ id: 0, name: 'name1', valueList: [{ value: 1 }] }],
      cycleTimeList: [
        { id: 0, name: 'name1', valueList: [{ value: 1 }] },
        { id: 1, name: 'name2', valueList: [{ value: 2 }] },
      ],
      classification: [
        { id: 0, name: 'name1', valuesList: [{ name: 'test1', value: 1 }] },
        { id: 1, name: 'name2', valuesList: [{ name: 'test2', value: 2 }] },
        { id: 2, name: 'name3', valuesList: [{ name: 'test3', value: 3 }] },
      ],
    })
    const { getByText, getByTestId, container } = render(<BoardDetail data={data} onBack={jest.fn()} />)
    expect(getByText('Velocity')).toBeInTheDocument()
    expect(getByTestId('Velocity')).toBeInTheDocument()
    expect(getByText('Cycle time')).toBeInTheDocument()
    expect(getByTestId('Cycle time')).toBeInTheDocument()
    expect(getByText('Classifications')).toBeInTheDocument()
    expect(getByTestId('Classifications')).toBeInTheDocument()

    expect(container.querySelectorAll('table[data-test-id="Velocity"] > tbody > tr').length).toBe(1)
    expect(container.querySelectorAll('table[data-test-id="Cycle time"] > tbody > tr').length).toBe(2)
    expect(container.querySelectorAll('table[data-test-id="Classifications"] > tbody > tr').length).toBe(6)
  })
})
