import { configureStore } from '@reduxjs/toolkit'
import stepperReducer from './context/stepper/StepperSlice'
import configReducer from './context/config/configSlice'
import boardReducer from './context/board/boardSlice'
import jiraVerifyResponseReducer from './context/board/jiraVerifyResponse/jiraVerifyResponseSlice'
export const store = configureStore({
  reducer: {
    stepper: stepperReducer,
    config: configReducer,
    board: boardReducer,
    jiraVerifyResponse: jiraVerifyResponseReducer,
  },
})

export type RootState = ReturnType<typeof store.getState>
export type AppDispatch = typeof store.dispatch
