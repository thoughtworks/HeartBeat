import { createSlice } from '@reduxjs/toolkit'
import { SOURCE_CONTROL_TYPES } from '@src/constants'

export interface sourceControlState {
  sourceControlConfig: { type: string; token: string }
  isSourceControlVerified: boolean
  isShowSourceControl: boolean
}

export const initialSourceControlState: sourceControlState = {
  sourceControlConfig: {
    type: SOURCE_CONTROL_TYPES.GITHUB,
    token: '',
  },
  isSourceControlVerified: false,
  isShowSourceControl: false,
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
