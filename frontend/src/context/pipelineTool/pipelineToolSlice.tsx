import { createSlice } from '@reduxjs/toolkit'
import type { RootState } from '@src/store'

export interface pipelineToolState {
  isPipelineToolVerified: boolean
}

const initialState: pipelineToolState = {
  isPipelineToolVerified: false,
}

export const pipelineToolSlice = createSlice({
  name: 'pipelineTool',
  initialState,
  reducers: {
    changePipelineToolVerifyState: (state, action) => {
      state.isPipelineToolVerified = action.payload
    },
  },
})

export const { changePipelineToolVerifyState } = pipelineToolSlice.actions

export const isPipelineToolVerified = (state: RootState) => state.pipelineTool.isPipelineToolVerified

export default pipelineToolSlice.reducer
