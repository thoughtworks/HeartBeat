import { createSlice } from '@reduxjs/toolkit';
import { ZERO } from '@src/constants/commons';
import type { RootState } from '@src/store';

export interface IMetricsPageFailedDateRange {
  isBoardInfoError?: boolean;
  isPipelineInfoError?: boolean;
  isPipelineStepError?: boolean;
}

export interface IReportPageFailedDateRange {
  isGainPollingUrlError?: boolean;
  isPollingError?: boolean;
}

export interface IPageFailedDateRangePayload<T> {
  startDate: string;
  errors: T;
}

export interface StepState {
  stepNumber: number;
  timeStamp: number;
  shouldMetricsLoaded: boolean;
  metricsPageFailedTimeRangeInfos: Record<string, IMetricsPageFailedDateRange>;
  reportPageFailedTimeRangeInfos: Record<string, IReportPageFailedDateRange>;
}

const initialState: StepState = {
  stepNumber: 0,
  timeStamp: 0,
  shouldMetricsLoaded: true,
  metricsPageFailedTimeRangeInfos: {},
  reportPageFailedTimeRangeInfos: {},
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
        state.metricsPageFailedTimeRangeInfos = {};
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
    updateMetricsPageFailedTimeRangeInfos: (state, action) => {
      const errorInfoList: IPageFailedDateRangePayload<IMetricsPageFailedDateRange>[] = action.payload;

      errorInfoList.forEach((singleTimeRangeInfo) => updateInfo(singleTimeRangeInfo));

      function updateInfo(errorInfo: IPageFailedDateRangePayload<IMetricsPageFailedDateRange>) {
        const { startDate, errors } = errorInfo;
        state.metricsPageFailedTimeRangeInfos[startDate] = {
          ...state.metricsPageFailedTimeRangeInfos[startDate],
          ...errors,
        };
      }
    },

    updateReportPageFailedTimeRangeInfos: (state, action) => {
      const errorInfoList: IPageFailedDateRangePayload<IReportPageFailedDateRange>[] = action.payload;

      errorInfoList.forEach((singleTimeRangeInfo) => updateInfo(singleTimeRangeInfo));

      function updateInfo(errorInfo: IPageFailedDateRangePayload<IReportPageFailedDateRange>) {
        const { startDate, errors } = errorInfo;
        state.reportPageFailedTimeRangeInfos[startDate] = {
          ...state.reportPageFailedTimeRangeInfos[startDate],
          ...errors,
        };
      }
    },
  },
});

export const {
  resetStep,
  nextStep,
  backStep,
  updateShouldMetricsLoaded,
  updateTimeStamp,
  updateMetricsPageFailedTimeRangeInfos,
  updateReportPageFailedTimeRangeInfos,
} = stepperSlice.actions;

export const selectStepNumber = (state: RootState) => state.stepper.stepNumber;
export const selectTimeStamp = (state: RootState) => state.stepper.timeStamp;
export const shouldMetricsLoaded = (state: RootState) => state.stepper.shouldMetricsLoaded;
export const selectMetricsPageFailedTimeRangeInfos = (state: RootState) =>
  state.stepper.metricsPageFailedTimeRangeInfos;

export const selectReportPageFailedTimeRangeInfos = (state: RootState) => state.stepper.reportPageFailedTimeRangeInfos;

export default stepperSlice.reducer;
