import { createSlice } from '@reduxjs/toolkit'
import { PIPELINE_TOOL_TYPES } from '@src/constants'

export interface pipelineToolState {
  pipelineToolConfig: { pipelineTool: string; token: string }
  isPipelineToolVerified: boolean
}

export const initialPipelineToolState: pipelineToolState = {
  pipelineToolConfig: {
    pipelineTool: PIPELINE_TOOL_TYPES.BUILD_KITE,
    token: '',
  },
  isPipelineToolVerified: false,
}

export const pipelineToolSlice = createSlice({
  name: 'pipelineTool',
  initialState: initialPipelineToolState,
  reducers: {
    updatePipelineToolVerifyState: (state, action) => {
      state.isPipelineToolVerified = action.payload
    },
    updatePipelineTool: (state, action) => {
      state.pipelineToolConfig = action.payload
    },
  },
})

export default pipelineToolSlice.reducer
