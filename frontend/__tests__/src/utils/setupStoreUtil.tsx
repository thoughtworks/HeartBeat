import { configureStore } from '@reduxjs/toolkit'
import { stepperSlice } from '@src/features/stepper/StepperSlice'
import { configSlice } from '@src/features/config/configSlice'
import { boardSlice } from '@src/features/board/boardSlice'
import { pipelineToolSlice } from '@src/features/pipelineTool/pipelineToolSlice'
import { sourceControlSlice } from '@src/features/sourceControl/sourceControlSlice'

export const setupStore = () => {
  return configureStore({
    reducer: {
      [stepperSlice.name]: stepperSlice.reducer,
      [configSlice.name]: configSlice.reducer,
      [boardSlice.name]: boardSlice.reducer,
      [pipelineToolSlice.name]: pipelineToolSlice.reducer,
      [sourceControlSlice.name]: sourceControlSlice.reducer,
    },
  })
}
