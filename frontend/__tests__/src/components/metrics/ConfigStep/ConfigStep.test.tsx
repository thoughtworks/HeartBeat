import { render } from '@testing-library/react'
import { ConfigStep } from '@src/components/metrics/ConfigStep'

describe('ConfigStep', () => {
  it('should show project name when render configStep', () => {
    const { getByText } = render(<ConfigStep />)
    expect(getByText('Project Name')).toBeInTheDocument()
  })
})
