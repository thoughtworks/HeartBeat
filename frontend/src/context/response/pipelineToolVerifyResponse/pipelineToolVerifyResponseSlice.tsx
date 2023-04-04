import { createSlice } from '@reduxjs/toolkit'

export interface pipelineToolVerifyResponseState {
  pipelineTool: {
    buildKite: {
      pipelineList: {
        id: string
        name: string
        orgId: string
        orgName: string
        repository: string
        steps: string[]
      }[]
    }
  }
}

export const initialState: pipelineToolVerifyResponseState = {
  pipelineTool: {
    buildKite: {
      pipelineList: [],
    },
  },
}

export const pipelineToolVerifyResponseSlice = createSlice({
  name: 'pipelineToolVerifyResponse',
  initialState,
  reducers: {
    updatePipelineToolVerifyResponse: (state, action) => {
      const { pipelineList } = action.payload
      state.pipelineTool.buildKite.pipelineList = pipelineList
    },
  },
})

export default pipelineToolVerifyResponseSlice.reducer
