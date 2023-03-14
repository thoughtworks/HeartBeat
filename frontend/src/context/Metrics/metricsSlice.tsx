import { createSlice } from '@reduxjs/toolkit'

export interface savedMetricsSettingState {
  jiraColumns: []
  targetFields: { name: string; key: string; flag: boolean }[]
  users: string[]
}

const initialState: savedMetricsSettingState = {
  jiraColumns: [],
  targetFields: [],
  users: [],
}

export const metricsSlice = createSlice({
  name: 'saveMetricsSetting',
  initialState,
  reducers: {
    updateTargetFields: (state, action) => {
      state.targetFields = action.payload
    },
  },
})

export const { updateTargetFields } = metricsSlice.actions

export default metricsSlice.reducer
