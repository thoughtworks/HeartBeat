import { configureStore } from '@reduxjs/toolkit'
import { stepperSlice } from '@src/context/stepper/StepperSlice'
import { configSlice } from '@src/context/config/configSlice'
import { boardSlice } from '@src/context/board/boardSlice'
import { pipelineToolSlice } from '@src/context/pipelineTool/pipelineToolSlice'
import { jiraVerifyResponseSlice } from '@src/context/board/jiraVerifyResponse/jiraVerifyResponseSlice'
import { sourceControlSlice } from '@src/context/sourceControl/sourceControlSlice'
import { metricsSlice } from '@src/context/Metrics/metricsSlice'

export const setupStore = () => {
  return configureStore({
    reducer: {
      [stepperSlice.name]: stepperSlice.reducer,
      [configSlice.name]: configSlice.reducer,
      [boardSlice.name]: boardSlice.reducer,
      [pipelineToolSlice.name]: pipelineToolSlice.reducer,
      [jiraVerifyResponseSlice.name]: jiraVerifyResponseSlice.reducer,
      [sourceControlSlice.name]: sourceControlSlice.reducer,
      [metricsSlice.name]: metricsSlice.reducer,
    },
  })
}
