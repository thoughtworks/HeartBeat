import { createSlice } from '@reduxjs/toolkit'

export interface sourceControlVerifyResponseState {
  sourceControl: {
    github: { githubRepos: string[] }
  }
}

export const initialState: sourceControlVerifyResponseState = {
  sourceControl: {
    github: {
      githubRepos: [],
    },
  },
}

export const sourceControlVerifyResponseSlice = createSlice({
  name: 'sourceControlVerifyResponse',
  initialState,
  reducers: {
    updateSourceControlVerifyResponse: (state, action) => {
      const { githubRepos } = action.payload
      state.sourceControl.github.githubRepos = githubRepos
    },
  },
})

export default sourceControlVerifyResponseSlice.reducer
