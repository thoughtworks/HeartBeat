import { createSlice } from '@reduxjs/toolkit'
import type { RootState } from '@src/store'
import { REGULAR_CALENDAR } from '@src/constants'
import { boardSlice as boardReducer, initialBoardState } from '@src/context/config/board/boardSlice'
import {
  pipelineToolSlice as pipelineToolReducer,
  initialPipelineToolState,
} from '@src/context/config/pipelineTool/pipelineToolSlice'
import {
  sourceControlSlice as sourceControlReducer,
  initialSourceControlState,
} from '@src/context/config/sourceControl/sourceControlSlice'

export interface basicConfigState {
  projectName: string
  calendarType: string
  dateRange: {
    startDate: string
    endDate: string
  }
  metrics: string[]
}

const initialBasicConfigState: basicConfigState = {
  projectName: '',
  calendarType: REGULAR_CALENDAR,
  dateRange: {
    startDate: '',
    endDate: '',
  },
  metrics: [],
}

export const configSlice = createSlice({
  name: 'config',
  initialState: {
    ...initialBasicConfigState,
    ...initialBoardState,
    ...initialPipelineToolState,
    ...initialSourceControlState,
  },
  reducers: {
    updateProjectName: (state, action) => {
      state.projectName = action.payload
    },
    updateCalendarType: (state, action) => {
      state.calendarType = action.payload
    },
    updateDateRange: (state, action) => {
      const { startDate, endDate } = action.payload
      state.dateRange = { startDate, endDate }
    },
    updateMetrics: (state, action) => {
      state.metrics = action.payload
    },
    ...boardReducer.caseReducers,
    ...pipelineToolReducer.caseReducers,
    ...sourceControlReducer.caseReducers,
  },
})
export const {
  updateProjectName,
  updateCalendarType,
  updateDateRange,
  updateMetrics,
  updateBoard,
  updateBoardVerifyState,
  updatePipelineToolVerifyState,
  updatePipelineTool,
  updateSourceControl,
  updateSourceControlVerifyState,
} = configSlice.actions

export const selectProjectName = (state: RootState) => state.config.projectName
export const selectCalendarType = (state: RootState) => state.config.calendarType
export const selectDateRange = (state: RootState) => state.config.dateRange
export const selectMetrics = (state: RootState) => state.config.metrics
export const selectIsBoardVerified = (state: RootState) => state.config.isBoardVerified
export const selectBoard = (state: RootState) => state.config.boardConfig
export const isPipelineToolVerified = (state: RootState) => state.config.isPipelineToolVerified
export const selectPipelineTool = (state: RootState) => state.config.pipelineToolConfig
export const isSourceControlVerified = (state: RootState) => state.config.isSourceControlVerified
export const selectSourceControl = (state: RootState) => state.config.sourceControlConfig

export default configSlice.reducer
