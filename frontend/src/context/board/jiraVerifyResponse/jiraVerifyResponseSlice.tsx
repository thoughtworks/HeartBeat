import { createSlice } from '@reduxjs/toolkit'
import { RootState } from '@src/store'

export interface jiraVerifyResponseState {
  jiraColumns: []
  targetFields: []
  users: string[]
  columns: string[]
}

const initialState: jiraVerifyResponseState = {
  jiraColumns: [],
  targetFields: [],
  users: [],
}

export const jiraVerifyResponseSlice = createSlice({
  name: 'jiraVerifyResponse',
  initialState,
  reducers: {
    updateJiraVerifyResponse: (state, action) => {
      const { jiraColumns, targetFields, users, columns } = action.payload
      state.jiraColumns = jiraColumns
      state.targetFields = targetFields
      state.users = users
      state.columns = columns
    },
  },
})

export const { updateJiraVerifyResponse } = jiraVerifyResponseSlice.actions

export const selectUsers = (state: RootState) => state.jiraVerifyResponse.users

export const selectColumns = (state: RootState) => state.jiraVerifyResponse.columns

export default jiraVerifyResponseSlice.reducer
