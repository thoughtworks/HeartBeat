import { render } from '@testing-library/react'
import { Provider } from 'react-redux'
import { store } from '@src/store'
import userEvent from '@testing-library/user-event'
import { DeploymentFrequencySettings } from '@src/components/Metrics/MetricsStep/DeploymentFrequencySettings'
import { addADeploymentFrequencySetting, deleteADeploymentFrequencySetting } from '@src/context/Metrics/metricsSlice'
import { DEPLOYMENT_FREQUENCY_SETTINGS } from '../../../../fixtures'

jest.mock('@src/hooks', () => ({
  useAppDispatch: () => jest.fn(),
  useAppSelector: jest.fn().mockReturnValue([
    { id: 1, organization: '', pipelineName: '', steps: '' },
    { id: 2, organization: '', pipelineName: '', steps: '' },
  ]),
}))
jest.mock('@src/context/Metrics/metricsSlice', () => ({
  addADeploymentFrequencySetting: jest.fn(),
  deleteADeploymentFrequencySetting: jest.fn(),
}))

const setup = () =>
  render(
    <Provider store={store}>
      <DeploymentFrequencySettings />
    </Provider>
  )

describe('DeploymentFrequencySettings', () => {
  afterEach(() => {
    jest.clearAllMocks()
  })

  it('should render DeploymentFrequencySettings component', () => {
    const mockValidationCheckContext = {
      errorMessages: [{ id: 1, error: 'error' }],
      clearErrorMessage: jest.fn(),
      checkDuplicatedPipeLine: jest.fn(),
      isPipelineValid: () => true,
    }

    jest.mock('@src/components/Metrics/MetricsStep/DeploymentFrequencySettings/PipelineMetricSelection', () => ({
      PipelineMetricSelection: ({ errorMessages }: { errorMessages: string }) => (
        <div>errorMessages: {errorMessages}</div>
      ),
    }))

    jest.mock('@src/hooks/useMetricsStepValidationCheckContext', () => ({
      useMetricsStepValidationCheckContext: () => mockValidationCheckContext,
    }))

    const { getByText, getByRole } = setup()

    expect(getByText(DEPLOYMENT_FREQUENCY_SETTINGS)).toBeInTheDocument()
    expect(getByText('errorMessages: error')).toBeInTheDocument()
    expect(getByRole('button')).toBeInTheDocument()
  })

  it('should call addADeploymentFrequencySetting function when click add another pipeline button', async () => {
    const { getByTestId } = await setup()

    await userEvent.click(getByTestId('AddIcon'))

    expect(addADeploymentFrequencySetting).toHaveBeenCalledTimes(1)
  })

  it('should call deleteADeploymentFrequencySetting function when click remove pipeline button', async () => {
    const { getAllByRole } = await setup()

    await userEvent.click(getAllByRole('button', { name: 'Remove' })[0])

    expect(deleteADeploymentFrequencySetting).toHaveBeenCalledTimes(1)
  })
})
