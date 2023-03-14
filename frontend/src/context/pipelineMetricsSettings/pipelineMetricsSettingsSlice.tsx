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
    addADeploymentFrequencySetting: (state) => {
      state.deploymentFrequencySettings = [
        ...state.deploymentFrequencySettings,
        { organization: '', pipelineName: '', steps: '' },
      ]
    },
    updateDeploymentFrequencySettings: (state, action) => {
      state.deploymentFrequencySettings = action.payload
    },
    deleteADeploymentFrequencySetting: (state, action) => {
      const deleteIndex = action.payload
      state.deploymentFrequencySettings = [
        ...state.deploymentFrequencySettings.filter((deploymentFrequencySetting, index) => index !== deleteIndex),
      ]
    },
  },
})

export const { addADeploymentFrequencySetting, updateDeploymentFrequencySettings, deleteADeploymentFrequencySetting } =
  pipelineMetricsSettingsSlice.actions

export const selectDeploymentFrequencySettings = (state: RootState) =>
  state.pipelineMetricsSettings.deploymentFrequencySettings

export default pipelineMetricsSettingsSlice.reducer
