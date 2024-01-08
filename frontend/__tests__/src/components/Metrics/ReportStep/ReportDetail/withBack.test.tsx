import { withGoBack } from '@src/components/Metrics/ReportStep/ReportDetail/withBack'
import { render, fireEvent } from '@testing-library/react'

describe('withGoBack', () => {
  const onBack = jest.fn()

  afterEach(jest.clearAllMocks)

  it('should render a link with back', () => {
    const Component = withGoBack(() => <div>test1</div>)
    const { getByText } = render(<Component onBack={onBack} />)
    expect(getByText('Back')).toBeInTheDocument()
  })

  it('should render the icon', () => {
    const Component = withGoBack(() => <div>test2</div>)
    const { getByTestId } = render(<Component onBack={onBack} />)
    expect(getByTestId('ArrowBackIcon')).toBeInTheDocument()
  })

  it('should call onBack when the back is clicked', () => {
    const Component = withGoBack(() => <div>test3</div>)
    const { getByText } = render(<Component onBack={onBack} />)
    fireEvent.click(getByText('Back'))
    expect(onBack).toBeCalled()
  })
})
