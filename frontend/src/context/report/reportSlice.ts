import { createSlice } from '@reduxjs/toolkit'
import type { RootState } from '@src/store'
import { ReportResponseDTO } from '@src/clients/report/dto/response'

export interface ReportState {
  reportData: ReportResponseDTO | null
}

export const initialBoardState: ReportState = {
  reportData: null,
}

export const reportSlice = createSlice({
  name: 'report',
  initialState: {
    ...initialBoardState,
  },
  reducers: {
    updateReportData: (state, action) => {
      state.reportData = action.payload
    },
  },
})
export const { updateReportData } = reportSlice.actions

export const selectReportData = (state: RootState) => {
  return state.report.reportData
}

export default reportSlice.reducer
