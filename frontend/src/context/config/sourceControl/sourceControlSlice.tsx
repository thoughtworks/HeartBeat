import { createSlice } from '@reduxjs/toolkit'
import { SOURCE_CONTROL_TYPES } from '@src/constants'

export interface sourceControlState {
  sourceControlConfig: { sourceControl: string; token: string }

  isSourceControlVerified: boolean
}

export const initialSourceControlState: sourceControlState = {
  sourceControlConfig: {
    sourceControl: SOURCE_CONTROL_TYPES.GITHUB,
    token: '',
  },
  isSourceControlVerified: false,
}

export const sourceControlSlice = createSlice({
  name: 'sourceControl',
  initialState: initialSourceControlState,
  reducers: {
    updateSourceControlVerifyState: (state, action) => {
      state.isSourceControlVerified = action.payload
    },
    updateSourceControl: (state, action) => {
      state.sourceControlConfig = action.payload
    },
  },
})

export default sourceControlSlice.reducer
