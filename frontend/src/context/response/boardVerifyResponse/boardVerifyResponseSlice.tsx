import { createSlice } from '@reduxjs/toolkit'

export interface boardVerifyResponseState {
  board: {
    jira: {
      jiraColumns: { key: string; value: { name: string; statuses: string[] } }[]
      targetFields: { name: string; key: string; flag: boolean }[]
      users: string[]
    }
  }
}

export const initialState: boardVerifyResponseState = {
  board: {
    jira: {
      jiraColumns: [],
      targetFields: [],
      users: [],
    },
  },
}

export const boardVerifyResponseSlice = createSlice({
  name: 'boardVerifyResponse',
  initialState,
  reducers: {
    updateJiraVerifyResponse: (state, action) => {
      const { jiraColumns, targetFields, users } = action.payload
      state.board.jira.jiraColumns = jiraColumns
      state.board.jira.targetFields = targetFields
      state.board.jira.users = users
    },
  },
})

export default boardVerifyResponseSlice.reducer
