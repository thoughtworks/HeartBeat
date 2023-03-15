import { render } from '@testing-library/react'
import { Provider } from 'react-redux'
import { store } from '@src/store'
import userEvent from '@testing-library/user-event'
import { addADeploymentFrequencySetting } from '@src/context/pipelineMetricsSettings/pipelineMetricsSettingsSlice'
import { DeploymentFrequencySettings } from '@src/components/Metrics/MetricsStep/DeploymentFrequencySettings'

jest.mock('@src/components/Metrics/MetricsStep/DeploymentFrequencySettings/PipelineMetricSelection', () => ({
  PipelineMetricSelection: () => <div>mock PipelineMetricSelection</div>,
}))

jest.mock('@src/hooks', () => ({
  useAppDispatch: () => jest.fn(),
  useAppSelector: jest.fn().mockReturnValue([{ organization: '', pipelineName: '', steps: '' }]),
}))

jest.mock('@src/context/pipelineMetricsSettings/pipelineMetricsSettingsSlice', () => ({
  addADeploymentFrequencySetting: jest.fn(),
}))

const setUp = () => {
  return render(
    <Provider store={store}>
      <DeploymentFrequencySettings />
    </Provider>
  )
}

describe('DeploymentFrequencySettings', () => {
  afterEach(() => {
    jest.clearAllMocks()
  })

  it('should render DeploymentFrequencySettings component', () => {
    const { getByText, getByRole } = setUp()

    expect(getByText('Deployment frequency settings')).toBeInTheDocument()
    expect(getByText('mock PipelineMetricSelection')).toBeInTheDocument()
    expect(getByRole('button', { name: 'Add another pipeline' })).toBeInTheDocument()
  })

  it('should call addADeploymentFrequencySetting function when click add another pipeline button', async () => {
    const { getByRole } = await setUp()

    await userEvent.click(getByRole('button', { name: 'Add another pipeline' }))

    expect(addADeploymentFrequencySetting).toHaveBeenCalledTimes(1)
  })
})
