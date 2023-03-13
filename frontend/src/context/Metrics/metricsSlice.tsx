import { createSlice } from '@reduxjs/toolkit'

export interface updatedJiraVerifyResponseState {
  jiraColumns: []
  targetFields: { name: string; key: string; flag: boolean }[]
  users: string[]
}

const initialState: updatedJiraVerifyResponseState = {
  jiraColumns: [],
  targetFields: [],
  users: [],
}

export const metricsSlice = createSlice({
  name: 'updatedJiraVerifyResponse',
  initialState,
  reducers: {
    updateTargetFields: (state, action) => {
      state.targetFields = [...action.payload]
    },
  },
})

export const { updateTargetFields } = metricsSlice.actions

export default metricsSlice.reducer
