import pipelineMetricsSettingsReducer, {
  updateDeploymentFrequencySettings,
} from '@src/context/pipelineMetricsSettings/pipelineMetricsSettingsSlice'

describe('pipelineMetricsSettings reducer', () => {
  it('should return init DeploymentFrequencySettings when handle initial state', () => {
    const initDeploymentFrequencySettings = [{ organization: '', pipelineName: '', steps: '' }]
    const pipelineMetricsSettings = pipelineMetricsSettingsReducer(undefined, { type: 'unknown' })

    expect(pipelineMetricsSettings.deploymentFrequencySettings).toEqual(initDeploymentFrequencySettings)
  })

  it('should update deploymentFrequencySettings when handle updateDeploymentFrequencySettings given initial state', () => {
    const mockDeploymentFrequencySettings = [
      { organization: 'mockOrganization', pipelineName: 'mockPipelineName', steps: 'mockStep' },
    ]

    const pipelineMetricsSettings = pipelineMetricsSettingsReducer(
      undefined,
      updateDeploymentFrequencySettings(mockDeploymentFrequencySettings)
    )

    expect(pipelineMetricsSettings.deploymentFrequencySettings).toEqual(mockDeploymentFrequencySettings)
  })
})
