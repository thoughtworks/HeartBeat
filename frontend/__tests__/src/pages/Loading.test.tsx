import { Loading } from '@src/pages/Loading'
import { render } from '@testing-library/react'

describe('Loading', () => {
  it('should show Loading text', () => {
    const { getAllByText } = render(<Loading />)

    expect(getAllByText('Loading...').length).toEqual(1)
  })
})
