import { act, render } from '@testing-library/react'
import MetricsStep from '@src/components/Metrics/MetricsStep'
import { Provider } from 'react-redux'
import { setupStore } from '../../../utils/setupStoreUtil'

import { updateMetrics } from '@src/context/config/configSlice'
import {
  CLASSIFICATION_SETTING,
  CREWS_SETTING,
  CYCLE_TIME_SETTINGS,
  DEPLOYMENT_FREQUENCY_SETTINGS,
  REAL_DONE,
  REQUIRED_DATA_LIST,
} from '../../../fixtures'
import { saveCycleTimeSettings } from '@src/context/Metrics/metricsSlice'

let store = setupStore()

const setup = () =>
  render(
    <Provider store={store}>
      <MetricsStep />
    </Provider>
  )

describe('MetricsStep', () => {
  beforeEach(() => {
    store = setupStore()
  })

  it('should render Crews when select velocity, and show Real done when have done column in Cycle time', async () => {
    await store.dispatch(updateMetrics([REQUIRED_DATA_LIST[1]]))
    const { getByText, queryByText } = setup()

    expect(getByText(CREWS_SETTING)).toBeInTheDocument()
    expect(queryByText(CYCLE_TIME_SETTINGS)).not.toBeInTheDocument()
    expect(queryByText(CLASSIFICATION_SETTING)).not.toBeInTheDocument()

    act(() => {
      store.dispatch(saveCycleTimeSettings([{ name: 'Testing', value: 'Done' }]))
    })

    expect(getByText(REAL_DONE)).toBeInTheDocument()
  })

  it('should show Cycle Time Settings when select cycle time in config page', async () => {
    await store.dispatch(updateMetrics([REQUIRED_DATA_LIST[2]]))
    const { getByText } = setup()

    expect(getByText(CYCLE_TIME_SETTINGS)).toBeInTheDocument()
  })

  it('should hide Real Done when no done column in cycleTime settings', async () => {
    await store.dispatch(saveCycleTimeSettings([{ name: 'Testing', value: 'Block' }]))
    const { queryByText } = setup()

    expect(queryByText(REAL_DONE)).not.toBeInTheDocument()
  })

  it('should show Classification Setting when select classification in config page', async () => {
    await store.dispatch(updateMetrics([REQUIRED_DATA_LIST[3]]))
    const { getByText } = setup()

    expect(getByText(CLASSIFICATION_SETTING)).toBeInTheDocument()
  })

  it('should show DeploymentFrequencySettings component when select deployment frequency in config page', async () => {
    await store.dispatch(updateMetrics([REQUIRED_DATA_LIST[5]]))
    const { getByText } = setup()

    expect(getByText(DEPLOYMENT_FREQUENCY_SETTINGS)).toBeInTheDocument()
  })

  it(' should call setNotificationProps when notificationProps is not undefined', async () => {
    const setNotificationProps = jest.fn().mockImplementation(() => {
      // do noting
    })
    render(
      <Provider store={store}>
        <MetricsStep setNotificationProps={setNotificationProps} />
      </Provider>
    )
    expect(setNotificationProps).toBeCalledTimes(1)
  })
})
