import { render } from '@testing-library/react'
import { ReportCard } from '@src/components/Common/ReportGrid/ReportCard'

describe('Report Card', () => {
  it('should not show exceeding items', () => {
    const items = [
      {
        value: 1,
        subtitle: 'PR Lead Time',
      },
      {
        value: 2,
        subtitle: 'Pipeline Lead Time',
      },
      {
        value: 3,
        subtitle: 'Total Lead Time',
      },
    ]

    const { getByText, queryByText } = render(<ReportCard title={'card'} items={items} xs={6} />)

    expect(getByText('1.00')).toBeInTheDocument()
    expect(getByText('2.00')).toBeInTheDocument()
    expect(queryByText('3.00')).not.toBeInTheDocument()
  })
})
