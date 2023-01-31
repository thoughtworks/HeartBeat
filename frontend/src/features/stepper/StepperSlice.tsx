import { createSlice } from '@reduxjs/toolkit'
import type { RootState } from '@src/store/store'
import { ZERO } from '@src/constants'

export interface StepState {
  value: number
}

const initialState: StepState = {
  value: 0,
}

export const stepperSlice = createSlice({
  name: 'stepper',
  initialState,
  reducers: {
    nextStep: (state) => {
      state.value += 1
    },
    backStep: (state) => {
      state.value = state.value === ZERO ? ZERO : state.value - 1
    },
  },
})

export const { nextStep, backStep } = stepperSlice.actions

export const selectStep = (state: RootState) => state.stepper.value

export default stepperSlice.reducer
