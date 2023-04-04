import { createSlice } from '@reduxjs/toolkit'
import {
  initialState as boardVerifyResponseInitialState,
  boardVerifyResponseSlice,
} from '@src/context/response/boardVerifyResponse/boardVerifyResponseSlice'
import {
  initialState as pipelineToolVerifyResponseInitialState,
  pipelineToolVerifyResponseSlice,
} from '@src/context/response/pipelineToolVerifyResponse/pipelineToolVerifyResponseSlice'
import {
  initialState as sourceControlVerifyResponseInitialState,
  sourceControlVerifyResponseSlice,
} from '@src/context/response/sourceControlVerifyResponse/sourceControlVerifyResponseSlice'
import { RootState } from '@src/store'

export const responseSlice = createSlice({
  name: 'response',
  initialState: {
    ...boardVerifyResponseInitialState,
    ...pipelineToolVerifyResponseInitialState,
    ...sourceControlVerifyResponseInitialState,
  },
  reducers: {
    ...boardVerifyResponseSlice.caseReducers,
    ...pipelineToolVerifyResponseSlice.caseReducers,
    ...sourceControlVerifyResponseSlice.caseReducers,
  },
})

export const { updateJiraVerifyResponse, updatePipelineToolVerifyResponse, updateSourceControlVerifyResponse } =
  responseSlice.actions

export const selectUsers = (state: RootState) => state.response.board.jira.users
export const selectJiraColumns = (state: RootState) => state.response.board.jira.jiraColumns
export const selectTargetFields = (state: RootState) => state.response.board.jira.targetFields

export default responseSlice.reducer
