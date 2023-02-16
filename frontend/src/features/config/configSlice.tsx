import { createSlice } from '@reduxjs/toolkit'
import type { RootState } from '@src/store/store'
import { BOARD_TYPES, REGULAR_CALENDAR } from '@src/constants'

export interface configState {
  projectName: string
  calendarType: string
  dateRange: {
    startDate: number | null
    endDate: number | null
  }
  requiredData: string[]
  boardFields: { board: string; boardId: string; email: string; projectKey: string; site: string; token: string }
}

const initialState: configState = {
  projectName: '',
  calendarType: REGULAR_CALENDAR,
  dateRange: {
    startDate: null,
    endDate: null,
  },
  requiredData: [],
  boardFields: {
    board: BOARD_TYPES.JIRA,
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
      state.requiredData = action.payload
    },
    updateBoardFields: (state, action) => {
      state.boardFields = action.payload
    },
  },
})

export const { updateProjectName, updateCalendarType, updateDateRange, updateRequiredData, updateBoardFields } =
  configSlice.actions

export const selectProjectName = (state: RootState) => state.config.projectName
export const selectCalendarType = (state: RootState) => state.config.calendarType
export const selectDateRange = (state: RootState) => state.config.dateRange
export const selectRequiredData = (state: RootState) => state.config.requiredData
export const selectBoardFields = (state: RootState) => state.config.boardFields

export default configSlice.reducer
