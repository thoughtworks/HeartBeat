import { createSlice } from '@reduxjs/toolkit'
import type { RootState } from '@src/store/store'

export interface configState {
  projectName: string
}

const initialState: configState = {
  projectName: '',
}

export const configSlice = createSlice({
  name: 'config',
  initialState,
  reducers: {
    updateProjectName: (state, action) => {
      state.projectName = action.payload
    },
  },
})

export const { updateProjectName } = configSlice.actions

export const selectProjectName = (state: RootState) => state.config.projectName

export default configSlice.reducer
