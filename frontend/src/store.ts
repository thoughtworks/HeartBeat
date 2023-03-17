import { configureStore } from '@reduxjs/toolkit'
import stepperReducer from './context/stepper/StepperSlice'
import configReducer from './context/config/configSlice'
import jiraVerifyResponseReducer from './context/config/board/jiraVerifyResponse/jiraVerifyResponseSlice'
import pipelineToolResponseReducer from './context/config/pipelineTool/pipelineToolVerifyResponse/pipelineToolVerifyResponseSlice'
import sourceControlVerifyResponseReducer from './context/config/sourceControl/sourceControlVerifyResponse/sourceControlVerifyResponseSlice'
import saveMetricsSettingReducer from './context/Metrics/metricsSlice'

export const store = configureStore({
  reducer: {
    stepper: stepperReducer,
    config: configReducer,
    jiraVerifyResponse: jiraVerifyResponseReducer,
    pipelineToolVerifyResponse: pipelineToolResponseReducer,
    sourceControlVerifyResponse: sourceControlVerifyResponseReducer,
    saveMetricsSetting: saveMetricsSettingReducer,
  },
})

export type RootState = ReturnType<typeof store.getState>
export type AppDispatch = typeof store.dispatch
