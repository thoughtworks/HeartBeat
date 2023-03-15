import { createSlice } from '@reduxjs/toolkit'

export interface savedMetricsSettingState {
  jiraColumns: { key: string; value: { name: string; statuses: string[] } }[]
  targetFields: { name: string; key: string; flag: boolean }[]
  users: string[]
  boardColumns: { name: string; value: string }[]
}

const initialState: savedMetricsSettingState = {
  jiraColumns: [],
  targetFields: [],
  users: [],
  boardColumns: [],
}

export const metricsSlice = createSlice({
  name: 'saveMetricsSetting',
  initialState,
  reducers: {
    updateTargetFields: (state, action) => {
      state.targetFields = action.payload
    },
    updateUsers: (state, action) => {
      state.users = action.payload
    },
    savedBoardColumns: (state, action) => {
      state.boardColumns = action.payload
    },
  },
})

export const { updateTargetFields, updateUsers, savedBoardColumns } = metricsSlice.actions

export default metricsSlice.reducer
