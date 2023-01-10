import { configureStore } from '@reduxjs/toolkit';
import counterReducer from '../components/counter/counterSlice';
export const index = configureStore({
  reducer: {
    counter: counterReducer,
  },
});

export type RootState = ReturnType<typeof index.getState>;
export type AppDispatch = typeof index.dispatch;
