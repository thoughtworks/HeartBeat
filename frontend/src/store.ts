import stepperReducer from './context/stepper/StepperSlice';
import metricsSlice from './context/Metrics/metricsSlice';
import configReducer from './context/config/configSlice';
import metaSlice from '@src/context/meta/metaSlice';
import { configureStore } from '@reduxjs/toolkit';

export const store = configureStore({
  reducer: {
    stepper: stepperReducer,
    config: configReducer,
    metrics: metricsSlice,
    meta: metaSlice,
  },
});

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;
