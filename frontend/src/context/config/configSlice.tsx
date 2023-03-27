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
import { REQUIRED_DATA } from '@src/constants'
export interface initialBasicConfigState {
  basicConfigState: {
    isProjectCreated: boolean
    projectName: string
    calendarType: string
    dateRange: {
      startDate: string
      endDate: string
    }
    metrics: string[]
  }
}

const initialBasicConfigState: initialBasicConfigState = {
  basicConfigState: {
    isProjectCreated: true,
    projectName: '',
    calendarType: REGULAR_CALENDAR,
    dateRange: {
      startDate: '',
      endDate: '',
    },
    metrics: [],
  },
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
      state.basicConfigState.projectName = action.payload
    },
    updateCalendarType: (state, action) => {
      state.basicConfigState.calendarType = action.payload
    },
    updateDateRange: (state, action) => {
      const { startDate, endDate } = action.payload
      state.basicConfigState.dateRange = { startDate, endDate }
    },
    updateMetrics: (state, action) => {
      const {
        VELOCITY,
        CYCLE_TIME,
        CLASSIFICATION,
        LEAD_TIME_FOR_CHANGES,
        DEPLOYMENT_FREQUENCY,
        CHANGE_FAILURE_RATE,
        MEAN_TIME_TO_RECOVERY,
      } = REQUIRED_DATA

      state.basicConfigState.metrics = action.payload

      state.isShowBoard = [VELOCITY, CYCLE_TIME, CLASSIFICATION].some((metric) =>
        state.basicConfigState.metrics.includes(metric)
      )
      state.isShowPipeline = [
        LEAD_TIME_FOR_CHANGES,
        DEPLOYMENT_FREQUENCY,
        CHANGE_FAILURE_RATE,
        MEAN_TIME_TO_RECOVERY,
      ].some((metric) => state.basicConfigState.metrics.includes(metric))
      state.isShowSourceControl = [LEAD_TIME_FOR_CHANGES].some((metric) =>
        state.basicConfigState.metrics.includes(metric)
      )
    },
    updateBasicConfigState: (state, action) => {
      state.basicConfigState = action.payload || state.basicConfigState
      state.boardConfig = action.payload.board || state.boardConfig
      state.pipelineToolConfig = action.payload.pipelineToolConfig || state.pipelineToolConfig
      state.sourceControlConfig = action.payload.sourceControlConfig || state.sourceControlConfig
    },
    isProjectCreated: (state, action) => {
      state.basicConfigState.isProjectCreated = action.payload
    },

    ...boardReducer.caseReducers,
    ...pipelineToolReducer.caseReducers,
    ...sourceControlReducer.caseReducers,
  },
})
export const {
  isProjectCreated,
  updateProjectName,
  updateCalendarType,
  updateDateRange,
  updateMetrics,
  updateBoard,
  updateBoardVerifyState,
  updateBasicConfigState,
  updatePipelineToolVerifyState,
  updatePipelineTool,
  updateSourceControl,
  updateSourceControlVerifyState,
} = configSlice.actions

export const selectProjectName = (state: RootState) => state.config.basicConfigState.projectName
export const selectCalendarType = (state: RootState) => state.config.basicConfigState.calendarType
export const selectDateRange = (state: RootState) => state.config.basicConfigState.dateRange
export const selectMetrics = (state: RootState) => state.config.basicConfigState.metrics
export const selectIsBoardVerified = (state: RootState) => state.config.isBoardVerified
export const selectBoard = (state: RootState) => state.config.boardConfig
export const isPipelineToolVerified = (state: RootState) => state.config.isPipelineToolVerified
export const selectPipelineTool = (state: RootState) => state.config.pipelineToolConfig
export const isSourceControlVerified = (state: RootState) => state.config.isSourceControlVerified
export const selectSourceControl = (state: RootState) => state.config.sourceControlConfig
export const selectConfig = (state: RootState) => state.config

export default configSlice.reducer
