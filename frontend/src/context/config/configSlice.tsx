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

export interface BasicConfigState {
  isProjectCreated: boolean
  basic: {
    projectName: string
    calendarType: string
    dateRange: {
      startDate: string | null
      endDate: string | null
    }
    metrics: string[]
  }
}

const initialBasicConfigState: BasicConfigState = {
  isProjectCreated: true,
  basic: {
    projectName: '',
    calendarType: REGULAR_CALENDAR,
    dateRange: {
      startDate: null,
      endDate: null,
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
      state.basic.projectName = action.payload
    },
    updateCalendarType: (state, action) => {
      state.basic.calendarType = action.payload
    },
    updateDateRange: (state, action) => {
      const { startDate, endDate } = action.payload
      state.basic.dateRange = { startDate, endDate }
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

      state.basic.metrics = action.payload

      state.isShowBoard = [VELOCITY, CYCLE_TIME, CLASSIFICATION].some((metric) => state.basic.metrics.includes(metric))
      state.isShowPipeline = [
        LEAD_TIME_FOR_CHANGES,
        DEPLOYMENT_FREQUENCY,
        CHANGE_FAILURE_RATE,
        MEAN_TIME_TO_RECOVERY,
      ].some((metric) => state.basic.metrics.includes(metric))
      state.isShowSourceControl = [LEAD_TIME_FOR_CHANGES].some((metric) => state.basic.metrics.includes(metric))
      state.basic.metrics = action.payload
    },
    updateBasicConfigState: (state, action) => {
      state.basic = action.payload
      state.boardConfig = action.payload.boardConfig || state.boardConfig
      state.pipelineToolConfig = action.payload.pipelineToolConfig || state.pipelineToolConfig
      state.sourceControlConfig = action.payload.sourceControlConfig || state.sourceControlConfig
    },
    updateProjectCreatedState: (state, action) => {
      state.isProjectCreated = action.payload
    },

    ...boardReducer.caseReducers,
    ...pipelineToolReducer.caseReducers,
    ...sourceControlReducer.caseReducers,
  },
})
export const {
  updateProjectCreatedState,
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

export const selectProjectName = (state: RootState) => state.config.basic.projectName
export const selectCalendarType = (state: RootState) => state.config.basic.calendarType
export const selectDateRange = (state: RootState) => state.config.basic.dateRange
export const selectMetrics = (state: RootState) => state.config.basic.metrics
export const selectIsBoardVerified = (state: RootState) => state.config.isBoardVerified
export const selectBoard = (state: RootState) => state.config.boardConfig
export const isPipelineToolVerified = (state: RootState) => state.config.isPipelineToolVerified
export const selectPipelineTool = (state: RootState) => state.config.pipelineToolConfig
export const isSourceControlVerified = (state: RootState) => state.config.isSourceControlVerified
export const selectSourceControl = (state: RootState) => state.config.sourceControlConfig
export const selectConfig = (state: RootState) => state.config

export default configSlice.reducer
