import { configureStore } from '@reduxjs/toolkit'
import stepperReducer from './features/stepper/StepperSlice'
import configReducer from './features/config/configSlice'
import boardReducer from './features/board/boardSlice'
import pipelineReducer from './features/pipelineTool/pipelineToolSlice'
import jiraVerifyResponseReducer from './features/jiraVerifyResponse/jiraVerifyResponseSlice'
export const store = configureStore({
  reducer: {
    stepper: stepperReducer,
    config: configReducer,
    board: boardReducer,
    pipelineTool: pipelineReducer,
    jiraVerifyResponse: jiraVerifyResponseReducer,
  },
})

export type RootState = ReturnType<typeof store.getState>
export type AppDispatch = typeof store.dispatch
