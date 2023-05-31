import { createSlice } from '@reduxjs/toolkit'
import type { RootState } from '@src/store'
import { ZERO } from '@src/constants'

export interface StepState {
  stepNumber: number
}

const initialState: StepState = {
  stepNumber: 0,
}

export const stepperSlice = createSlice({
  name: 'stepper',
  initialState,
  reducers: {
    nextStep: (state) => {
      state.stepNumber += 1
    },
    backStep: (state) => {
      state.stepNumber = state.stepNumber === ZERO ? ZERO : state.stepNumber - 1
    },
  },
})

export const { nextStep, backStep } = stepperSlice.actions

export const selectStepNumber = (state: RootState) => state.stepper.stepNumber

export default stepperSlice.reducer
