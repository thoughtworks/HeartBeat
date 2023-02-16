import { createSlice } from '@reduxjs/toolkit'
import type { RootState } from '@src/store/store'
import { REGULAR_CALENDAR } from '@src/constants'

export interface configState {
  projectName: string
  calendarType: string
}

const initialState: configState = {
  projectName: '',
  calendarType: REGULAR_CALENDAR,
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
  },
})

export const { updateProjectName, updateCalendarType } = configSlice.actions

export const selectProjectName = (state: RootState) => state.config.projectName
export const selectCalendarType = (state: RootState) => state.config.calendarType

export default configSlice.reducer
