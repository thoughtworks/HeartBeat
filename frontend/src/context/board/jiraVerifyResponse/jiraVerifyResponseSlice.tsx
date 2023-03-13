import { createSlice } from '@reduxjs/toolkit'
import { RootState } from '@src/store'

export interface jiraVerifyResponseState {
  jiraColumns: []
  targetFields: { name: string; key: string; flag: boolean }[]
  users: string[]
}

const initialState: jiraVerifyResponseState = {
  jiraColumns: [],
  targetFields: [
    { key: 'issuetype', name: 'Issue Type', flag: false },
    { key: 'parent', name: 'Parent', flag: false },
    { key: 'customfield_10020', name: 'Sprint', flag: false },
    { key: 'project', name: 'Project', flag: false },
    { key: 'reporter', name: 'Reporter', flag: false },
    { key: 'customfield_10021', name: 'Flagged', flag: false },
    { key: 'fixVersions', name: 'Fix versions', flag: false },
    { key: 'customfield_10000', name: 'Development', flag: false },
    { key: 'priority', name: 'Priority', flag: false },
    { key: 'customfield_10037', name: 'Partner', flag: false },
    { key: 'labels', name: 'Labels', flag: false },
    { key: 'timetracking', name: 'Time tracking', flag: false },
    { key: 'customfield_10015', name: 'Start date', flag: false },
    { key: 'customfield_10016', name: 'Story point estimate', flag: false },
    { key: 'customfield_10038', name: 'QA', flag: false },
    { key: 'customfield_10019', name: 'Rank', flag: false },
    { key: 'assignee', name: 'Assignee', flag: false },
    { key: 'customfield_10017', name: 'Issue color', flag: false },
    { key: 'customfield_10027', name: 'Feature/Operation', flag: false },
  ],
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

export const selectTargetFields = (state: RootState) => state.jiraVerifyResponse.targetFields

export default jiraVerifyResponseSlice.reducer
