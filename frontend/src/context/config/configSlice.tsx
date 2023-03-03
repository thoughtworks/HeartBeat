import { createSlice } from '@reduxjs/toolkit'
import type { RootState } from '@src/store'
import { BOARD_TYPES, REGULAR_CALENDAR } from '@src/constants'

export interface configState {
  projectName: string
  calendarType: string
  dateRange: {
    startDate: string
    endDate: string
  }
  metrics: string[]
  board: { type: string; boardId: string; email: string; projectKey: string; site: string; token: string }
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
    updateRequiredData: (state, action) => {
      state.metrics = action.payload
    },
    updateBoard: (state, action) => {
      state.board = action.payload
    },
  },
})

export const { updateProjectName, updateCalendarType, updateDateRange, updateRequiredData, updateBoard } =
  configSlice.actions

export const selectProjectName = (state: RootState) => state.config.projectName
export const selectCalendarType = (state: RootState) => state.config.calendarType
export const selectDateRange = (state: RootState) => state.config.dateRange
export const selectMetrics = (state: RootState) => state.config.metrics
export const selectBoard = (state: RootState) => state.config.board

export default configSlice.reducer
