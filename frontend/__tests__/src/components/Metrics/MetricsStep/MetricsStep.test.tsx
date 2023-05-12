import { render } from '@testing-library/react'
import { MetricsStep } from '@src/components/Metrics/MetricsStep'
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
import { saveBoardColumns } from '@src/context/Metrics/metricsSlice'

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
  it('should render Crews and Real Done components when select velocity', async () => {
    await store.dispatch(updateMetrics([REQUIRED_DATA_LIST[1]]))
    const { getByText, queryByText } = setup()

    expect(getByText(CREWS_SETTING)).toBeInTheDocument()
    expect(getByText(REAL_DONE)).toBeInTheDocument()
    expect(queryByText(CYCLE_TIME_SETTINGS)).not.toBeInTheDocument()
    expect(queryByText(CLASSIFICATION_SETTING)).not.toBeInTheDocument()
  })

  it('should show Cycle Time Settings when select cycle time in config page', async () => {
    await store.dispatch(updateMetrics([REQUIRED_DATA_LIST[2]]))
    const { getByText } = setup()

    expect(getByText(CYCLE_TIME_SETTINGS)).toBeInTheDocument()
  })

  it('should show Real Done when select velocity and selectedColumns include done column', async () => {
    await store.dispatch(updateMetrics([REQUIRED_DATA_LIST[1]]))
    const mockColumnsList = [
      {
        key: 'done',
        value: {
          name: 'Done',
          statuses: ['DONE', 'CANCELLED'],
        },
      },
    ]
    await store.dispatch(saveBoardColumns(mockColumnsList))
    const { getByText } = setup()

    expect(getByText(REAL_DONE)).toBeInTheDocument()
  })

  it('should hide Real Done when select two "Done" in cycleTime settings', async () => {
    await store.dispatch(
      saveBoardColumns([
        { name: 'Testing', value: 'Done' },
        { name: 'TODO', value: 'Done' },
      ])
    )
    const { queryByText } = setup()

    expect(queryByText('Real Done')).not.toBeInTheDocument()
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
})
