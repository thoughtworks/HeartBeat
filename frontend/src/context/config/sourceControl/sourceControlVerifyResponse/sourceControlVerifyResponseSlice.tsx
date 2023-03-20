import { createSlice } from '@reduxjs/toolkit'

export interface sourceControlVerifyResponseState {
  sourceControl: []
}

const initialState: sourceControlVerifyResponseState = {
  sourceControl: [],
}

export const sourceControlVerifyResponseSlice = createSlice({
  name: 'sourceControlVerifyResponse',
  initialState,
  reducers: {
    updateSourceControlVerifyResponse: (state, action) => {
      const { sourceControl } = action.payload
      state.sourceControl = sourceControl
    },
  },
})

export const { updateSourceControlVerifyResponse } = sourceControlVerifyResponseSlice.actions

export default sourceControlVerifyResponseSlice.reducer
