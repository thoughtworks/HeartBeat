import { createSlice } from '@reduxjs/toolkit'
import type { RootState } from '@src/store'
import { PIPELINE_TOOL_TYPES, REGULAR_CALENDAR, SOURCE_CONTROL_TYPES } from '@src/constants'
import { boardSlice as boardReducer, initialBoardState } from '@src/context/board/boardSlice'

export interface configState {
  projectName: string
  calendarType: string
  dateRange: {
    startDate: string
    endDate: string
  }
  metrics: string[]
  pipelineToolFields: { pipelineTool: string; token: string }
  sourceControlFields: { sourceControl: string; token: string }
}

const initialState: configState = {
  projectName: '',
  calendarType: REGULAR_CALENDAR,
  dateRange: {
    startDate: '',
    endDate: '',
  },
  metrics: [],
  pipelineToolFields: {
    pipelineTool: PIPELINE_TOOL_TYPES.BUILD_KITE,
    token: '',
  },
  sourceControlFields: {
    sourceControl: SOURCE_CONTROL_TYPES.GITHUB,
    token: '',
  },
}

export const configSlice = createSlice({
  name: 'config',
  initialState: {
    ...initialBoardState,
    ...initialState,
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
    updatePipelineToolFields: (state, action) => {
      state.pipelineToolFields = action.payload
    },
    updateSourceControlFields: (state, action) => {
      state.sourceControlFields = action.payload
    },
    ...boardReducer.caseReducers,
  },
})
export const {
  updateProjectName,
  updateCalendarType,
  updateDateRange,
  updateMetrics,
  updatePipelineToolFields,
  updateSourceControlFields,
  updateBoard,
  updateBoardVerifyState,
} = configSlice.actions

export const selectProjectName = (state: RootState) => state.config.projectName
export const selectCalendarType = (state: RootState) => state.config.calendarType
export const selectDateRange = (state: RootState) => state.config.dateRange
export const selectMetrics = (state: RootState) => state.config.metrics
export const selectPipelineToolFields = (state: RootState) => state.config.pipelineToolFields
export const selectSourceControlFields = (state: RootState) => state.config.sourceControlFields
export const selectIsBoardVerified = (state: RootState) => state.config.isBoardVerified
export const selectBoard = (state: RootState) => state.config.boardConfig

export default configSlice.reducer
