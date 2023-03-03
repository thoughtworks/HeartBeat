import { createSlice } from '@reduxjs/toolkit'

export interface jiraVerifyResponseState {
  jiraColumns: []
  targetFields: []
  users: []
}

const initialState: jiraVerifyResponseState = {
  jiraColumns: [],
  targetFields: [],
  users: [],
}

export const jiraVerifyResponseSlice = createSlice({
  name: 'jira verify response',
  initialState,
  reducers: {
    updateJiraVerifyResponse: (state, action) => {
      const { jiraColumns, targetFields, users } = action.payload
      state.jiraColumns = jiraColumns
      state.targetFields = targetFields
      state.users = users
    },
  },
})

export const { updateJiraVerifyResponse } = jiraVerifyResponseSlice.actions

export default jiraVerifyResponseSlice.reducer
