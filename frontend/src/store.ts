import { configureStore } from '@reduxjs/toolkit'
import stepperReducer from './context/stepper/StepperSlice'
import configReducer from './context/config/configSlice'
import jiraVerifyResponseReducer from './context/config/board/jiraVerifyResponse/jiraVerifyResponseSlice'
import pipelineReducer from './context/pipelineTool/pipelineToolSlice'
import pipelineToolResponseReducer from './context/pipelineTool/pipelineToolVerifyResponse/pipelineToolVerifyResponseSlice'
import sourceControlReducer from './context/sourceControl/sourceControlSlice'
import sourceControlVerifyResponseReducer from './context/sourceControl/sourceControlVerifyResponse/sourceControlVerifyResponseSlice'
import saveMetricsSettingReducer from './context/Metrics/metricsSlice'

export const store = configureStore({
  reducer: {
    stepper: stepperReducer,
    config: configReducer,
    pipelineTool: pipelineReducer,
    sourceControl: sourceControlReducer,
    jiraVerifyResponse: jiraVerifyResponseReducer,
    pipelineToolVerifyResponse: pipelineToolResponseReducer,
    sourceControlVerifyResponse: sourceControlVerifyResponseReducer,
    saveMetricsSetting: saveMetricsSettingReducer,
  },
})

export type RootState = ReturnType<typeof store.getState>
export type AppDispatch = typeof store.dispatch
