import { createSlice } from '@reduxjs/toolkit'
import camelCase from 'lodash.camelcase'
import { RootState } from '@src/store'

export interface savedMetricsSettingState {
  jiraColumns: { key: string; value: { name: string; statuses: string[] } }[]
  targetFields: { name: string; key: string; flag: boolean }[]
  users: string[]
  doneColumn: string[]
  boardColumns: { name: string; value: string }[]
  deploymentFrequencySettings: { id: number; organization: string; pipelineName: string; steps: string }[]
  importFile: string[]
  isProjectCreated: boolean
  classification: string[]
}

const initialState: savedMetricsSettingState = {
  jiraColumns: [],
  targetFields: [],
  users: [],
  doneColumn: [],
  boardColumns: [],
  deploymentFrequencySettings: [{ id: 0, organization: '', pipelineName: '', steps: '' }],
  importFile: [],
  isProjectCreated: true,
  classification: [],
}

export const metricsSlice = createSlice({
  name: 'saveMetricsSetting',
  initialState: {
    ...initialState,
  },
  reducers: {
    saveTargetFields: (state, action) => {
      state.targetFields = action.payload
    },
    saveDoneColumn: (state, action) => {
      state.doneColumn = action.payload
    },
    saveUsers: (state, action) => {
      state.users = action.payload
    },
    saveBoardColumns: (state, action) => {
      state.boardColumns = action.payload
    },

    addADeploymentFrequencySetting: (state) => {
      const newId = state.deploymentFrequencySettings[state.deploymentFrequencySettings.length - 1].id + 1
      state.deploymentFrequencySettings = [
        ...state.deploymentFrequencySettings,
        { id: newId, organization: '', pipelineName: '', steps: '' },
      ]
    },

    updateDeploymentFrequencySettings: (state, action) => {
      const { updateId, label, value } = action.payload

      state.deploymentFrequencySettings = state.deploymentFrequencySettings.map((deploymentFrequencySetting) => {
        return deploymentFrequencySetting.id === updateId
          ? {
              ...deploymentFrequencySetting,
              [camelCase(label)]: value,
            }
          : deploymentFrequencySetting
      })
    },

    updateMetricsState: (state, action) => {
      const { isProjectCreated, basic } = action.payload
      state.isProjectCreated = isProjectCreated
      state.importFile = basic
      state.users = basic.crews || state.users
      state.boardColumns = basic.cycleTime || state.boardColumns
      state.doneColumn = basic.realDone || state.doneColumn
      state.classification = basic.classification || state.classification
    },

    deleteADeploymentFrequencySetting: (state, action) => {
      const deleteId = action.payload
      state.deploymentFrequencySettings = [...state.deploymentFrequencySettings.filter(({ id }) => id !== deleteId)]
    },
  },
})

export const {
  saveTargetFields,
  saveDoneColumn,
  saveUsers,
  saveBoardColumns,
  addADeploymentFrequencySetting,
  updateDeploymentFrequencySettings,
  deleteADeploymentFrequencySetting,
  updateMetricsState,
} = metricsSlice.actions

export const selectDeploymentFrequencySettings = (state: RootState) =>
  state.saveMetricsSetting.deploymentFrequencySettings

export const selectBoardColumns = (state: RootState) => state.saveMetricsSetting.boardColumns
export const selectMetricsContent = (state: RootState) => state.saveMetricsSetting

export default metricsSlice.reducer
