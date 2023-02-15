import { createSlice } from '@reduxjs/toolkit'
import type { RootState } from '@src/store/store'

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
    changeBoardVerifyState: (state, action) => {
      state.isBoardVerified = action.payload
    },
  },
})

export const { changeBoardVerifyState } = boardSlice.actions

export const isBoardVerified = (state: RootState) => state.board.isBoardVerified

export default boardSlice.reducer
