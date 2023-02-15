import { configureStore } from '@reduxjs/toolkit'
import stepperReducer from '../features/stepper/StepperSlice'
import boardReducer from '../features/board/boardSlice'
export const store = configureStore({
  reducer: {
    stepper: stepperReducer,
    board: boardReducer,
  },
})

export type RootState = ReturnType<typeof store.getState>
export type AppDispatch = typeof store.dispatch
