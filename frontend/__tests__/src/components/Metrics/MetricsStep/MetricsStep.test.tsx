import { render } from '@testing-library/react'
import { MetricsStep } from '@src/components/Metrics/MetricsStep'
import { Provider } from 'react-redux'
import { setupStore } from '../../../utils/setupStoreUtil'

let store = setupStore()

beforeEach(() => {
  store = setupStore()
})

const setup = () =>
  render(
    <Provider store={store}>
      <MetricsStep />
    </Provider>
  )

describe('MetricsStep', () => {
  it('should render Crews and CycleTime components', () => {
    const { getByText } = setup()
    expect(getByText('Crews Setting')).toBeInTheDocument()
    expect(getByText('Cycle Time Setting')).toBeInTheDocument()
  })
})
