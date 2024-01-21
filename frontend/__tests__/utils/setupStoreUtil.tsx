import { stepperSlice } from '@src/context/stepper/StepperSlice';
import { metricsSlice } from '@src/context/Metrics/metricsSlice';
import { configSlice } from '@src/context/config/configSlice';
import { headerSlice } from '@src/context/header/headerSlice';
import { configureStore } from '@reduxjs/toolkit';

export const setupStore = () => {
  return configureStore({
    reducer: {
      [stepperSlice.name]: stepperSlice.reducer,
      [configSlice.name]: configSlice.reducer,
      [metricsSlice.name]: metricsSlice.reducer,
      [headerSlice.name]: headerSlice.reducer,
    },
    middleware: [],
  });
};
