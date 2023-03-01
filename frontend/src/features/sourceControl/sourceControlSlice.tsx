import { createSlice } from '@reduxjs/toolkit'
import type { RootState } from '@src/store'

export interface sourceControlState {
  isSourceControlVerified: boolean
}

const initialState: sourceControlState = {
  isSourceControlVerified: false,
}

export const sourceControlSlice = createSlice({
  name: 'sourceControl',
  initialState,
  reducers: {
    changeSourceControlVerifyState: (state, action) => {
      state.isSourceControlVerified = action.payload
    },
  },
})
export const { changeSourceControlVerifyState } = sourceControlSlice.actions

export const isSourceControlVerified = (state: RootState) => state.sourceControl.isSourceControlVerified

export default sourceControlSlice.reducer
