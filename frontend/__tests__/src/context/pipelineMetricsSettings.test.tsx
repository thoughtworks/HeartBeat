import pipelineMetricsSettingsReducer, {
  updateDeploymentFrequencySettings,
  addADeploymentFrequencySetting,
  deleteADeploymentFrequencySetting,
} from '@src/context/pipelineMetricsSettings/pipelineMetricsSettingsSlice'

describe('pipelineMetricsSettings reducer', () => {
  const initPipelineMetricsSettings = {
    deploymentFrequencySettings: [{ organization: '', pipelineName: '', steps: '' }],
  }

  it('should return init DeploymentFrequencySettings when handle initial state', () => {
    const pipelineMetricsSettings = pipelineMetricsSettingsReducer(undefined, { type: 'unknown' })

    expect(pipelineMetricsSettings.deploymentFrequencySettings).toEqual(
      initPipelineMetricsSettings.deploymentFrequencySettings
    )
  })

  it('should update deploymentFrequencySettings when handle updateDeploymentFrequencySettings given initial state', () => {
    const mockDeploymentFrequencySettings = [
      { organization: 'mockOrganization', pipelineName: 'mockPipelineName', steps: 'mockStep' },
    ]

    const pipelineMetricsSettings = pipelineMetricsSettingsReducer(
      initPipelineMetricsSettings,
      updateDeploymentFrequencySettings(mockDeploymentFrequencySettings)
    )

    expect(pipelineMetricsSettings.deploymentFrequencySettings).toEqual(mockDeploymentFrequencySettings)
  })

  it('should add a deploymentFrequencySetting when handle addADeploymentFrequencySettings given initial state', () => {
    const addedDeploymentFrequencySettings = [
      { organization: '', pipelineName: '', steps: '' },
      { organization: '', pipelineName: '', steps: '' },
    ]

    const pipelineMetricsSettings = pipelineMetricsSettingsReducer(
      initPipelineMetricsSettings,
      addADeploymentFrequencySetting()
    )

    expect(pipelineMetricsSettings.deploymentFrequencySettings).toEqual(addedDeploymentFrequencySettings)
  })

  it('should delete a deploymentFrequencySetting when handle deleteADeploymentFrequencySettings given some state value', () => {
    const mockDeploymentFrequencySettings = {
      deploymentFrequencySettings: [
        { organization: 'mock organization 1', pipelineName: 'mock pipeline name 1', steps: 'step 1' },
        { organization: 'mock organization 2', pipelineName: 'mock pipeline name 2', steps: 'step 2' },
      ],
    }

    const pipelineMetricsSettings = pipelineMetricsSettingsReducer(
      mockDeploymentFrequencySettings,
      deleteADeploymentFrequencySetting(0)
    )

    expect(pipelineMetricsSettings.deploymentFrequencySettings).toEqual([
      {
        organization: 'mock organization 2',
        pipelineName: 'mock pipeline name 2',
        steps: 'step 2',
      },
    ])
  })
})
