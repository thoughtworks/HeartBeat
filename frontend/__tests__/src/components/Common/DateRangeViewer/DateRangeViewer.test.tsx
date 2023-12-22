import { render, screen } from '@testing-library/react'
import DateRangeViewer from '@src/components/Common/DateRangeViewer'
describe('DateRangeVier', () => {
  it('should render component', () => {
    render(<DateRangeViewer startDate={new Date('2022/1/1').toString()} endDate={new Date('2022/1/2').toString()} />)
    expect(screen.getByText(/2022-01-01/)).toBeInTheDocument()
    expect(screen.getByText(/2022-01-02/)).toBeInTheDocument()
  })
})
