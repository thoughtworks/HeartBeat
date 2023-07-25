import { render } from '@testing-library/react'
import { Loading } from '@src/components/Loading'

describe('Loading', () => {
  it('should show Loading', () => {
    const { container } = render(<Loading />)

    expect(container.getElementsByTagName('svg')).toHaveLength(1)
    expect(container.getElementsByTagName('span')[0].getAttribute('role')).toEqual('progressbar')
  })
})
