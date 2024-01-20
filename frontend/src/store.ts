import stepperReducer from './context/stepper/StepperSlice';
import headerSlice from '@src/context/header/headerSlice';
import metricsSlice from './context/Metrics/metricsSlice';
import configReducer from './context/config/configSlice';
import { configureStore } from '@reduxjs/toolkit';

export const store = configureStore({
  reducer: {
    stepper: stepperReducer,
    config: configReducer,
    metrics: metricsSlice,
    header: headerSlice,
  },
});

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;
