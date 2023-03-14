import { createSlice } from '@reduxjs/toolkit'
import type { RootState } from '@src/store'

export interface pipelineMetricsSettingsState {
  deploymentFrequencySettings: { organization: string; pipelineName: string; steps: string }[]
}

const initialState: pipelineMetricsSettingsState = {
  deploymentFrequencySettings: [{ organization: '', pipelineName: '', steps: '' }],
}

export const pipelineMetricsSettingsSlice = createSlice({
  name: 'pipelineMetricsSettings',
  initialState,
  reducers: {
    updateDeploymentFrequencySettings: (state, action) => {
      state.deploymentFrequencySettings = action.payload
    },
  },
})

export const { updateDeploymentFrequencySettings } = pipelineMetricsSettingsSlice.actions

export const selectDeploymentFrequencySettings = (state: RootState) =>
  state.pipelineMetricsSettings.deploymentFrequencySettings

export default pipelineMetricsSettingsSlice.reducer
