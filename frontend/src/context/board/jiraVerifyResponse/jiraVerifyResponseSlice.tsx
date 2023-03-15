import { createSlice } from '@reduxjs/toolkit'
import { RootState } from '@src/store'

export interface jiraVerifyResponseState {
  jiraColumns: { key: string; value: { name: string; statuses: string[] } }[]
  targetFields: { name: string; key: string; flag: boolean }[]
  users: string[]
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
      const { jiraColumns, targetFields, users } = action.payload
      state.jiraColumns = jiraColumns
      state.targetFields = targetFields
      state.users = users
    },
  },
})

export const { updateJiraVerifyResponse } = jiraVerifyResponseSlice.actions

export const selectUsers = (state: RootState) => state.jiraVerifyResponse.users

export const selectJiraColumns = (state: RootState) => state.jiraVerifyResponse.jiraColumns

export const selectTargetFields = (state: RootState) => state.jiraVerifyResponse.targetFields

export default jiraVerifyResponseSlice.reducer
