import { createSlice } from '@reduxjs/toolkit'

export interface savedMetricsSettingState {
  jiraColumns: []
  targetFields: { name: string; key: string; flag: boolean }[]
  users: string[]
  doneColumn: string[]
}

const initialState: savedMetricsSettingState = {
  jiraColumns: [],
  targetFields: [],
  users: [],
  doneColumn: [],
}

export const metricsSlice = createSlice({
  name: 'saveMetricsSetting',
  initialState,
  reducers: {
    updateTargetFields: (state, action) => {
      state.targetFields = action.payload
    },
    updateDoneColumn: (state, action) => {
      state.doneColumn = action.payload
    },
    updateUsers: (state, action) => {
      state.users = action.payload
    },
  },
})

export const { updateTargetFields, updateDoneColumn, updateUsers } = metricsSlice.actions

export default metricsSlice.reducer
