import { render } from '@testing-library/react'
import { MetricsStep } from '@src/components/Metrics/MetricsStep'
import { Provider } from 'react-redux'
import { setupStore } from '../../../utils/setupStoreUtil'

import { updateMetrics } from '@src/context/config/configSlice'
import { CLASSIFICATION_SETTING, CREWS_SETTING, CYCLE_TIME_SETTING, REQUIRED_DATA_LIST } from '../../../fixtures'

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
    const { getByText, queryByText } = setup()

    expect(getByText(CREWS_SETTING)).toBeInTheDocument()
    expect(getByText(CYCLE_TIME_SETTING)).toBeInTheDocument()
    expect(queryByText(CLASSIFICATION_SETTING)).not.toBeInTheDocument()
  })

  it('should show Cycle Time Setting when select classification in config page', async () => {
    await store.dispatch(updateMetrics([REQUIRED_DATA_LIST[1]]))
    const { getByText } = setup()

    expect(getByText(CYCLE_TIME_SETTING)).toBeInTheDocument()
  })

  it('should show Classification Setting when select classification in config page', async () => {
    await store.dispatch(updateMetrics([REQUIRED_DATA_LIST[2]]))
    const { getByText } = setup()

    expect(getByText(CLASSIFICATION_SETTING)).toBeInTheDocument()
  })
})
