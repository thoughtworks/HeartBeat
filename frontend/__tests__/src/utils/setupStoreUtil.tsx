import { configureStore } from '@reduxjs/toolkit'
import { stepperSlice } from '@src/context/stepper/StepperSlice'
import { configSlice } from '@src/context/config/configSlice'
import { boardSlice } from '@src/context/board/boardSlice'

export const setupStore = () => {
  return configureStore({
    reducer: {
      [stepperSlice.name]: stepperSlice.reducer,
      [configSlice.name]: configSlice.reducer,
      [boardSlice.name]: boardSlice.reducer,
    },
  })
}
