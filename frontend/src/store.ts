import { configureStore } from '@reduxjs/toolkit'
import stepperReducer from './context/stepper/StepperSlice'
import configReducer from './context/config/configSlice'
import boardReducer from './context/board/boardSlice'
import jiraVerifyResponseReducer from './context/board/jiraVerifyResponse/jiraVerifyResponseSlice'
import pipelineReducer from './context/pipelineTool/pipelineToolSlice'
import pipelineToolResponseReducer from './context/pipelineToolVerifyResponse/pipelineToolVerifyResponseSlice'

export const store = configureStore({
  reducer: {
    stepper: stepperReducer,
    config: configReducer,
    board: boardReducer,
    pipelineTool: pipelineReducer,
    jiraVerifyResponse: jiraVerifyResponseReducer,
    pipelineToolVerifyResponse: pipelineToolResponseReducer,
  },
})

export type RootState = ReturnType<typeof store.getState>
export type AppDispatch = typeof store.dispatch
