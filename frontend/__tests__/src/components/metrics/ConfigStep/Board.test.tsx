import { render } from '@testing-library/react'
import { Board } from '@src/components/metrics/ConfigStep/Board'

describe('Board', () => {
  it('should show board title when render board component ', () => {
    const { getByText } = render(<Board />)

    expect(getByText('board')).toBeInTheDocument()
  })
})
