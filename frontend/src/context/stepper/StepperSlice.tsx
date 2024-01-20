import { createSlice } from '@reduxjs/toolkit';
import { ZERO } from '@src/constants/commons';
import type { RootState } from '@src/store';

export interface StepState {
  stepNumber: number;
  timeStamp: number;
}

const initialState: StepState = {
  stepNumber: 0,
  timeStamp: 0,
};

export const stepperSlice = createSlice({
  name: 'stepper',
  initialState,
  reducers: {
    resetStep: (state) => {
      state.stepNumber = initialState.stepNumber;
      state.timeStamp = initialState.timeStamp;
    },
    nextStep: (state) => {
      state.stepNumber += 1;
    },
    backStep: (state) => {
      state.stepNumber = state.stepNumber === ZERO ? ZERO : state.stepNumber - 1;
    },
    updateTimeStamp: (state, action) => {
      state.timeStamp = action.payload;
    },
  },
});

export const { resetStep, nextStep, backStep, updateTimeStamp } = stepperSlice.actions;

export const selectStepNumber = (state: RootState) => state.stepper.stepNumber;
export const selectTimeStamp = (state: RootState) => state.stepper.timeStamp;

export default stepperSlice.reducer;
