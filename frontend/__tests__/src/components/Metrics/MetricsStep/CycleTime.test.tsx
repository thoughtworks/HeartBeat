import { render } from '@testing-library/react'
import { CycleTime } from '@src/components/Metrics/MetricsStep/CycleTime'

const title = 'Cycle Time Settings'
const setup = () => render(<CycleTime title={title} />)

describe('CycleTime', () => {
  it('should show Crews when render Crews component', () => {
    const { getByText } = setup()
    expect(getByText(title)).toBeInTheDocument()
  })
})
