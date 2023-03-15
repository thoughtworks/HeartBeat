import { render } from '@testing-library/react'
import { SingleSelection } from '@src/components/Metrics/MetricsStep/DeploymentFrequencySettings/SingleSelection'
import userEvent from '@testing-library/user-event'
import { Provider } from 'react-redux'
import { store } from '@src/store'

describe('SingleSelection', () => {
  const mockOptions = ['mockOptions 1', 'mockOptions 2', 'mockOptions 3']
  const mockLabel = 'mockLabel'
  const mockValue = 'mockOptions 1'
  const setUp = () =>
    render(
      <Provider store={store}>
        <SingleSelection options={mockOptions} label={mockLabel} value={mockValue} index={0} />
      </Provider>
    )

  it('should render SingleSelection', () => {
    const { getByText } = setUp()

    expect(getByText(mockLabel)).toBeInTheDocument()
    expect(getByText(mockValue)).toBeInTheDocument()
  })

  it('should call update option function when change option given mockValue as default', async () => {
    const { getByText, getByRole } = setUp()

    await userEvent.click(getByRole('button', { name: mockLabel }))
    await userEvent.click(getByText(mockOptions[1]))

    expect(getByText(mockOptions[1])).toBeInTheDocument()
  })
})
