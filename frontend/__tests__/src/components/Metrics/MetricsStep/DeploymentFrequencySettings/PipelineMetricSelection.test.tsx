import { render, waitFor } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { Provider } from 'react-redux'
import { setupStore } from '../../../../utils/setupStoreUtil'
import { PipelineMetricSelection } from '@src/components/Metrics/MetricsStep/DeploymentFrequencySettings/PipelineMetricSelection'
import { deleteADeploymentFrequencySetting } from '@src/context/Metrics/metricsSlice'
import { updatePipelineToolVerifyResponse } from '@src/context/config/configSlice'
import { metricsClient } from '@src/clients/MetricsClient'

jest.mock('@src/context/Metrics/metricsSlice', () => ({
  ...jest.requireActual('@src/context/Metrics/metricsSlice'),
  deleteADeploymentFrequencySetting: jest.fn().mockReturnValue({ type: 'DELETE_DEPLOYMENT_FREQUENCY_SETTING' }),
}))

describe('PipelineMetricSelection', () => {
  const REMOVE_BUTTON = 'Remove'
  const mockId = 0
  const deploymentFrequencySetting = {
    id: 0,
    organization: '',
    pipelineName: '',
    steps: '',
  }
  const store = setupStore()

  const setup = async (
    deploymentFrequencySetting: { id: number; organization: string; pipelineName: string; steps: string },
    isShowRemoveButton: boolean
  ) => {
    await store.dispatch(
      updatePipelineToolVerifyResponse({
        pipelineList: [
          {
            id: 'mockId',
            name: 'mockName',
            orgId: 'mockOrgId',
            orgName: 'mockOrgName',
            repository: 'mockRepository',
            steps: ['step1', 'step2'],
          },
        ],
      })
    )
    return render(
      <Provider store={store}>
        <PipelineMetricSelection
          deploymentFrequencySetting={deploymentFrequencySetting}
          isShowRemoveButton={isShowRemoveButton}
          errorMessages={{ organization: '', pipelineName: '', steps: '' }}
        />
      </Provider>
    )
  }

  beforeEach(() => {
    jest.clearAllMocks()
  })

  it('should render PipelineMetricSelection when isShowRemoveButton is true', async () => {
    const { getByText } = await setup(deploymentFrequencySetting, true)

    expect(getByText(REMOVE_BUTTON)).toBeInTheDocument()
    expect(getByText('Organization')).toBeInTheDocument()
  })

  it('should render PipelineMetricSelection when isShowRemoveButton is false', async () => {
    const { getByText, queryByText } = await setup(deploymentFrequencySetting, false)

    expect(queryByText(REMOVE_BUTTON)).not.toBeInTheDocument()
    expect(getByText('Organization')).toBeInTheDocument()
  })

  it('should call deleteADeploymentFrequencySetting function when click remove this pipeline button', async () => {
    const { getByRole } = await setup(deploymentFrequencySetting, true)

    await userEvent.click(getByRole('button', { name: REMOVE_BUTTON }))

    expect(deleteADeploymentFrequencySetting).toHaveBeenCalledTimes(1)
    expect(deleteADeploymentFrequencySetting).toHaveBeenCalledWith(mockId)
  })

  it('should show pipelineName selection when select organization', async () => {
    const { getByText } = await setup({ ...deploymentFrequencySetting, organization: 'mockOrgName' }, false)

    expect(getByText('Organization')).toBeInTheDocument()
    expect(getByText('Pipeline Name')).toBeInTheDocument()
  })

  it('should show step selection when select organization and pipelineName', async () => {
    metricsClient.getSteps = jest.fn().mockImplementation(() => ['steps1', 'steps2'])
    const { getByText } = await setup(
      { ...deploymentFrequencySetting, organization: 'mockOrgName', pipelineName: 'mockName' },
      false
    )

    expect(getByText('Organization')).toBeInTheDocument()
    expect(getByText('Pipeline Name')).toBeInTheDocument()
    expect(getByText('Steps')).toBeInTheDocument()
  })

  it('should show error message pop when getSteps failed', async () => {
    metricsClient.getSteps = jest.fn().mockImplementation(() => {
      throw new Error('error message')
    })
    const { getByText } = await setup(
      { ...deploymentFrequencySetting, organization: 'mockOrgName', pipelineName: 'mockName' },
      false
    )

    await waitFor(() => {
      expect(getByText('BuildKite Get steps failed: error message')).toBeInTheDocument()
    })

    expect(getByText('Organization')).toBeInTheDocument()
    expect(getByText('Pipeline Name')).toBeInTheDocument()
    expect(getByText('Steps')).toBeInTheDocument()
  })
})
