import { createSlice } from '@reduxjs/toolkit'
import type { RootState } from '@src/store'
import { BOARD_TYPES, PIPELINE_TOOL_TYPES, REGULAR_CALENDAR } from '@src/constants'

export interface configState {
  projectName: string
  calendarType: string
  dateRange: {
    startDate: string
    endDate: string
  }
  metrics: string[]
  board: { type: string; boardId: string; email: string; projectKey: string; site: string; token: string }
  pipelineToolFields: { pipelineTool: string; token: string }
}

const initialState: configState = {
  projectName: '',
  calendarType: REGULAR_CALENDAR,
  dateRange: {
    startDate: '',
    endDate: '',
  },
  metrics: [],
  board: {
    type: BOARD_TYPES.JIRA,
    boardId: '',
    email: '',
    projectKey: '',
    site: '',
    token: '',
  },
  pipelineToolFields: {
    pipelineTool: PIPELINE_TOOL_TYPES.BUILD_KITE,
    token: '',
  },
}

export const configSlice = createSlice({
  name: 'config',
  initialState,
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
    updateBoard: (state, action) => {
      state.board = action.payload
    },
    updatePipelineToolFields: (state, action) => {
      state.pipelineToolFields = action.payload
    },
  },
})

export const {
  updateProjectName,
  updateCalendarType,
  updateDateRange,
  updateMetrics,
  updateBoard,
  updatePipelineToolFields,
} = configSlice.actions

export const selectProjectName = (state: RootState) => state.config.projectName
export const selectCalendarType = (state: RootState) => state.config.calendarType
export const selectDateRange = (state: RootState) => state.config.dateRange
export const selectMetrics = (state: RootState) => state.config.metrics
export const selectBoard = (state: RootState) => state.config.board
export const selectPipelineToolFields = (state: RootState) => state.config.pipelineToolFields

export default configSlice.reducer
