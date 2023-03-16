import { createSlice } from '@reduxjs/toolkit'

export interface savedMetricsSettingState {
  jiraColumns: { key: string; value: { name: string; statuses: string[] } }[]
  targetFields: { name: string; key: string; flag: boolean }[]
  users: string[]
  doneColumn: string[]
  boardColumns: { name: string; value: string }[]
}

const initialState: savedMetricsSettingState = {
  jiraColumns: [],
  targetFields: [],
  users: [],
  doneColumn: [],
  boardColumns: [],
}

export const metricsSlice = createSlice({
  name: 'saveMetricsSetting',
  initialState,
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
  },
})

export const { saveTargetFields, saveDoneColumn, saveUsers, saveBoardColumns } = metricsSlice.actions

export default metricsSlice.reducer
