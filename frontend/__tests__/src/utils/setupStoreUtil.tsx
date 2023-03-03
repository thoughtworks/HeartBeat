import { configureStore } from '@reduxjs/toolkit'
import { stepperSlice } from '@src/features/stepper/StepperSlice'
import { configSlice } from '@src/features/config/configSlice'
import { boardSlice } from '@src/features/board/boardSlice'

export const setupStore = () => {
  return configureStore({
    reducer: {
      [stepperSlice.name]: stepperSlice.reducer,
      [configSlice.name]: configSlice.reducer,
      [boardSlice.name]: boardSlice.reducer,
    },
  })
}
