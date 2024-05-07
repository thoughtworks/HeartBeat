import { createSlice } from '@reduxjs/toolkit';
import { ZERO } from '@src/constants/commons';
import type { RootState } from '@src/store';

export interface StepState {
  stepNumber: number;
  timeStamp: number;
  shouldMetricsLoad: boolean;
  failedTimeRange: string[];
}

const initialState: StepState = {
  stepNumber: 0,
  timeStamp: 0,
  shouldMetricsLoad: true,
  failedTimeRange: [],
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
      if (state.shouldMetricsLoad && state.stepNumber === 0) {
        state.failedTimeRange = [];
      }
      state.shouldMetricsLoad = true;
      state.stepNumber += 1;
    },
    backStep: (state) => {
      state.shouldMetricsLoad = false;
      state.stepNumber = state.stepNumber === ZERO ? ZERO : state.stepNumber - 1;
    },
    updateShouldMetricsLoad: (state, action) => {
      state.shouldMetricsLoad = action.payload;
    },
    updateTimeStamp: (state, action) => {
      state.timeStamp = action.payload;
    },
    updateFailedTimeRange: (state, action) => {
      state.failedTimeRange = state.failedTimeRange.concat(action.payload);
    },
  },
});

export const { resetStep, nextStep, backStep, updateShouldMetricsLoad, updateTimeStamp, updateFailedTimeRange } =
  stepperSlice.actions;

export const selectStepNumber = (state: RootState) => state.stepper.stepNumber;
export const selectTimeStamp = (state: RootState) => state.stepper.timeStamp;
export const shouldMetricsLoad = (state: RootState) => state.stepper.shouldMetricsLoad;
export const selectFailedTimeRange = (state: RootState) => state.stepper.failedTimeRange;

export default stepperSlice.reducer;
