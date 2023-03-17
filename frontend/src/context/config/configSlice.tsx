import { createSlice } from '@reduxjs/toolkit'
import type { RootState } from '@src/store'
import { REGULAR_CALENDAR, SOURCE_CONTROL_TYPES } from '@src/constants'
import { boardSlice as boardReducer, initialBoardState } from '@src/context/config/board/boardSlice'
import {
  pipelineToolSlice as pipelineToolReducer,
  initialPipelineToolState,
} from '@src/context/pipelineTool/pipelineToolSlice'

export interface basicConfigState {
  projectName: string
  calendarType: string
  dateRange: {
    startDate: string
    endDate: string
  }
  metrics: string[]
  sourceControlFields: { sourceControl: string; token: string }
}

const initialBasicConfigState: basicConfigState = {
  projectName: '',
  calendarType: REGULAR_CALENDAR,
  dateRange: {
    startDate: '',
    endDate: '',
  },
  metrics: [],
  sourceControlFields: {
    sourceControl: SOURCE_CONTROL_TYPES.GITHUB,
    token: '',
  },
}

export const configSlice = createSlice({
  name: 'config',
  initialState: {
    ...initialBasicConfigState,
    ...initialBoardState,
    ...initialPipelineToolState,
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
    updateSourceControlFields: (state, action) => {
      state.sourceControlFields = action.payload
    },
    ...boardReducer.caseReducers,
    ...pipelineToolReducer.caseReducers,
  },
})
export const {
  updateProjectName,
  updateCalendarType,
  updateDateRange,
  updateMetrics,
  updateSourceControlFields,
  updateBoard,
  updateBoardVerifyState,
  updatePipelineToolVerifyState,
  updatePipelineTool,
} = configSlice.actions

export const selectProjectName = (state: RootState) => state.config.projectName
export const selectCalendarType = (state: RootState) => state.config.calendarType
export const selectDateRange = (state: RootState) => state.config.dateRange
export const selectMetrics = (state: RootState) => state.config.metrics
export const selectSourceControlFields = (state: RootState) => state.config.sourceControlFields
export const selectIsBoardVerified = (state: RootState) => state.config.isBoardVerified
export const selectBoard = (state: RootState) => state.config.boardConfig
export const isPipelineToolVerified = (state: RootState) => state.config.isPipelineToolVerified
export const selectPipelineTool = (state: RootState) => state.config.pipelineToolConfig

export default configSlice.reducer
