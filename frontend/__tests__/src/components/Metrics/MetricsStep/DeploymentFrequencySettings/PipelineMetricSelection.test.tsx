import { render, waitFor, within } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { Provider } from 'react-redux'
import { setupStore } from '../../../../utils/setupStoreUtil'
import { PipelineMetricSelection } from '@src/components/Metrics/MetricsStep/DeploymentFrequencySettings/PipelineMetricSelection'
import { metricsClient } from '@src/clients/MetricsClient'
import { updatePipelineToolVerifyResponseSteps } from '@src/context/config/configSlice'
import { ORGANIZATION, PIPELINE_NAME, PIPELINE_SETTING_TYPES, REMOVE_BUTTON, STEP } from '../../../../fixtures'

jest.mock('@src/context/Metrics/metricsSlice', () => ({
  ...jest.requireActual('@src/context/Metrics/metricsSlice'),
  deleteADeploymentFrequencySetting: jest.fn().mockReturnValue({ type: 'DELETE_DEPLOYMENT_FREQUENCY_SETTING' }),
}))

jest.mock('@src/context/config/configSlice', () => ({
  ...jest.requireActual('@src/context/config/configSlice'),
  selectPipelineOrganizations: jest.fn().mockReturnValue(['mockOrgName', 'mockOrgName2']),
  selectPipelineNames: jest.fn().mockReturnValue(['mockName', 'mockName2']),
  selectSteps: jest.fn().mockReturnValue(['step1', 'step2']),
  selectStepsParams: jest.fn().mockReturnValue({
    buildId: '',
    organizationId: '',
    params: {
      endTime: 1681747200000,
      orgName: '',
      pipelineName: '',
      repository: '',
      startTime: 1680537600000,
    },
    pipelineType: 'BuildKite',
    token: '',
  }),
  updatePipelineToolVerifyResponseSteps: jest
    .fn()
    .mockReturnValue({ type: 'UPDATE_PIPELINE_TOOL_VERIFY_RESPONSE_STEPS' }),
}))

describe('PipelineMetricSelection', () => {
  const mockId = 0
  const deploymentFrequencySetting = {
    id: 0,
    organization: '',
    pipelineName: '',
    step: '',
  }
  const mockHandleClickRemoveButton = jest.fn()
  const mockUpdatePipeline = jest.fn()
  const mockClearErrorMessage = jest.fn()

  const setup = async (
    deploymentFrequencySetting: { id: number; organization: string; pipelineName: string; step: string },
    isShowRemoveButton: boolean
  ) => {
    const store = setupStore()
    return render(
      <Provider store={store}>
        <PipelineMetricSelection
          type={PIPELINE_SETTING_TYPES.DEPLOYMENT_FREQUENCY_SETTINGS_TYPE}
          pipelineSetting={deploymentFrequencySetting}
          isShowRemoveButton={isShowRemoveButton}
          errorMessages={{
            organization: 'organization is required',
            pipelineName: 'pipelineName is required',
            step: 'steps is required',
          }}
          onRemovePipeline={mockHandleClickRemoveButton}
          onUpdatePipeline={mockUpdatePipeline}
          onClearErrorMessage={mockClearErrorMessage}
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
    expect(getByText(ORGANIZATION)).toBeInTheDocument()
  })

  it('should render PipelineMetricSelection when isShowRemoveButton is false', async () => {
    const { getByText, queryByText } = await setup(deploymentFrequencySetting, false)

    expect(queryByText(REMOVE_BUTTON)).not.toBeInTheDocument()
    expect(getByText(ORGANIZATION)).toBeInTheDocument()
  })

  it('should call deleteADeploymentFrequencySetting function when click remove this pipeline button', async () => {
    const { getByRole } = await setup(deploymentFrequencySetting, true)

    await userEvent.click(getByRole('button', { name: REMOVE_BUTTON }))

    expect(mockHandleClickRemoveButton).toHaveBeenCalledTimes(1)
    expect(mockHandleClickRemoveButton).toHaveBeenCalledWith(mockId)
  })

  it('should show pipelineName selection when select organization', async () => {
    const { getByText, getByRole } = await setup({ ...deploymentFrequencySetting, organization: 'mockOrgName' }, false)

    expect(getByText(ORGANIZATION)).toBeInTheDocument()
    expect(getByText(PIPELINE_NAME)).toBeInTheDocument()

    await userEvent.click(getByRole('button', { name: ORGANIZATION }))
    const listBox = within(getByRole('listbox'))
    await userEvent.click(listBox.getByText('mockOrgName2'))

    expect(mockClearErrorMessage).toHaveBeenCalledTimes(1)
  })

  it('should show step selection when select organization and pipelineName', async () => {
    metricsClient.getSteps = jest.fn().mockImplementation(() => ['steps1', 'steps2'])
    const { getByText } = await setup(
      { ...deploymentFrequencySetting, organization: 'mockOrgName', pipelineName: 'mockName' },
      false
    )

    expect(getByText(ORGANIZATION)).toBeInTheDocument()
    expect(getByText(PIPELINE_NAME)).toBeInTheDocument()
    expect(getByText(STEP)).toBeInTheDocument()
  })

  it('should show error message pop when getSteps failed', async () => {
    metricsClient.getSteps = jest.fn().mockImplementation(() => {
      throw new Error('error message')
    })
    const { getByText, getByRole } = await setup(
      { id: 0, organization: 'mockOrgName', pipelineName: 'mockName', step: '' },
      false
    )

    await userEvent.click(getByRole('button', { name: PIPELINE_NAME }))
    const listBox = within(getByRole('listbox'))
    await userEvent.click(listBox.getByText('mockName2'))

    await waitFor(() => {
      expect(getByText('BuildKite get steps failed: error message')).toBeInTheDocument()
    })
    expect(mockUpdatePipeline).toHaveBeenCalledTimes(2)
    expect(mockClearErrorMessage).toHaveBeenCalledTimes(1)
  })

  it('should show steps selection when getSteps succeed ', async () => {
    metricsClient.getSteps = jest.fn().mockImplementation(() => ['steps'])
    const { getByRole, getByText } = await setup(
      { id: 0, organization: 'mockOrgName', pipelineName: 'mockName', step: '' },
      false
    )

    await waitFor(() => {
      expect(updatePipelineToolVerifyResponseSteps).toHaveBeenCalledTimes(1)
      expect(getByText(STEP)).toBeInTheDocument()
    })
    await userEvent.click(getByRole('button', { name: STEP }))
    const stepsListBox = within(getByRole('listbox'))
    await userEvent.click(stepsListBox.getByText('step2'))

    expect(mockUpdatePipeline).toHaveBeenCalledTimes(1)
    expect(mockClearErrorMessage).toHaveBeenCalledTimes(1)
  })
})
