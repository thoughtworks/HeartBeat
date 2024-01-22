import { stepperSlice } from '@src/context/stepper/StepperSlice';
import { metricsSlice } from '@src/context/Metrics/metricsSlice';
import { configSlice } from '@src/context/config/configSlice';
import { metaSlice } from '@src/context/meta/metaSlice';
import { configureStore } from '@reduxjs/toolkit';

export const setupStore = () => {
  return configureStore({
    reducer: {
      [stepperSlice.name]: stepperSlice.reducer,
      [configSlice.name]: configSlice.reducer,
      [metricsSlice.name]: metricsSlice.reducer,
      [metaSlice.name]: metaSlice.reducer,
    },
    middleware: [],
  });
};
