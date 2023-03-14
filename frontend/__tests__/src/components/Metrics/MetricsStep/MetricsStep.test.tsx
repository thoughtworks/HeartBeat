import { render } from '@testing-library/react'
import { MetricsStep } from '@src/components/Metrics/MetricsStep'
import { Provider } from 'react-redux'
import { setupStore } from '../../../utils/setupStoreUtil'

import { updateMetrics } from '@src/context/config/configSlice'

const store = setupStore()
const setup = () => {
  return render(
    <Provider store={store}>
      <MetricsStep />
    </Provider>
  )
}

describe('MetricsStep', () => {
  it('should show default crews setting', () => {
    const { getByText, queryByText } = setup()

    expect(getByText('Crews Setting')).toBeInTheDocument()
    expect(queryByText('Classification Setting')).not.toBeInTheDocument()
  })

  it('should show Classification Setting when select classification in config page', async () => {
    await store.dispatch(updateMetrics(['Classification']))
    const { getByText } = setup()

    expect(getByText('Classification Setting')).toBeInTheDocument()
  })
})
