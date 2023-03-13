import { createSlice } from '@reduxjs/toolkit'
import { RootState } from '@src/store'

export interface jiraVerifyResponseState {
  jiraColumns: { key: string; value: { name: string; statuses: string[] } }[]
  targetFields: []
  users: string[]
}

const initialState: jiraVerifyResponseState = {
  jiraColumns: [
    {
      key: 'done',
      value: {
        name: 'Done',
        statuses: ['DONE', 'CANCELLED'],
      },
    },
    {
      key: 'indeterminate',
      value: {
        name: 'Blocked',
        statuses: ['BLOCKED'],
      },
    },
    {
      key: 'indeterminate',
      value: {
        name: 'Doing',
        statuses: ['DOING'],
      },
    },
    {
      key: 'indeterminate',
      value: {
        name: 'TODO',
        statuses: ['TODO'],
      },
    },
    {
      key: 'indeterminate',
      value: {
        name: 'Testing',
        statuses: ['TESTING'],
      },
    },
  ],
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

export default jiraVerifyResponseSlice.reducer
