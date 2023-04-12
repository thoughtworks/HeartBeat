export interface VerifyPipelineReq {
  type: string
  token: string
  startTime: string | number | null
  endTime: string | number | null
}
