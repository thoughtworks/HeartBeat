export interface VerifySourceControlReq {
  type: string
  token: string
  startTime: string | number | null
  endTime: string | number | null
}
