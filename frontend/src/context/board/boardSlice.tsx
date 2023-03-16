import { createSlice } from '@reduxjs/toolkit'
import { BOARD_TYPES } from '@src/constants'

export interface boardState {
  boardConfig: { type: string; boardId: string; email: string; projectKey: string; site: string; token: string }
  isBoardVerified: boolean
}

export const initialBoardState: boardState = {
  boardConfig: { type: BOARD_TYPES.JIRA, boardId: '', email: '', projectKey: '', site: '', token: '' },
  isBoardVerified: false,
}

export const boardSlice = createSlice({
  name: 'board',
  initialState: initialBoardState,
  reducers: {
    updateBoardVerifyState: (state, action) => {
      state.isBoardVerified = action.payload
    },
    updateBoard: (state, action) => {
      state.boardConfig = action.payload
    },
  },
})

export default boardSlice.reducer
