import { createSlice } from '@reduxjs/toolkit'
import type { RootState } from '@src/store'

export interface boardState {
  isBoardVerified: boolean
}

const initialState: boardState = {
  isBoardVerified: false,
}

export const boardSlice = createSlice({
  name: 'board',
  initialState,
  reducers: {
    updateBoardVerifyState: (state, action) => {
      state.isBoardVerified = action.payload
    },
  },
})

export const { updateBoardVerifyState } = boardSlice.actions

export const selectIsBoardVerified = (state: RootState) => state.board.isBoardVerified

export default boardSlice.reducer
