import { createSlice } from '@reduxjs/toolkit';
import { ZERO } from '@src/constants/commons';
import type { RootState } from '@src/store';

export interface StepState {
  stepNumber: number;
  timeStamp: number;
  shouldMetricsLoaded: boolean;
  failedTimeRangeList: string[];
}

const initialState: StepState = {
  stepNumber: 0,
  timeStamp: 0,
  shouldMetricsLoaded: true,
  failedTimeRangeList: [],
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
      if (state.shouldMetricsLoaded && state.stepNumber === 0) {
        state.failedTimeRangeList = [];
      }
      state.shouldMetricsLoaded = true;
      state.stepNumber += 1;
    },
    backStep: (state) => {
      state.shouldMetricsLoaded = false;
      state.stepNumber = state.stepNumber === ZERO ? ZERO : state.stepNumber - 1;
    },
    updateShouldMetricsLoaded: (state, action) => {
      state.shouldMetricsLoaded = action.payload;
    },
    updateTimeStamp: (state, action) => {
      state.timeStamp = action.payload;
    },
    updateFailedTimeRange: (state, action) => {
      state.failedTimeRangeList = state.failedTimeRangeList.concat(action.payload);
    },
  },
});

export const { resetStep, nextStep, backStep, updateShouldMetricsLoaded, updateTimeStamp, updateFailedTimeRange } =
  stepperSlice.actions;

export const selectStepNumber = (state: RootState) => state.stepper.stepNumber;
export const selectTimeStamp = (state: RootState) => state.stepper.timeStamp;
export const shouldMetricsLoaded = (state: RootState) => state.stepper.shouldMetricsLoaded;
export const selectFailedTimeRange = (state: RootState) => state.stepper.failedTimeRangeList;

export default stepperSlice.reducer;
