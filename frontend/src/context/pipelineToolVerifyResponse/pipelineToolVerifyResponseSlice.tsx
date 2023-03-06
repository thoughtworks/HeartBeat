import { createSlice } from '@reduxjs/toolkit'

export interface pipelineToolVerifyResponseState {
  pipelineTool: []
}

const initialState: pipelineToolVerifyResponseState = {
  pipelineTool: [],
}

export const pipelineToolVerifyResponseSlice = createSlice({
  name: 'pipelineTool verify response',
  initialState,
  reducers: {
    updatePipelineToolVerifyResponse: (state, action) => {
      const { pipelineTool } = action.payload
      state.pipelineTool = pipelineTool
    },
  },
})

export const { updatePipelineToolVerifyResponse } = pipelineToolVerifyResponseSlice.actions

export default pipelineToolVerifyResponseSlice.reducer
