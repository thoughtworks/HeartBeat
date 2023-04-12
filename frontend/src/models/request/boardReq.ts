export interface VerifyBoardReq {
  token: string
  type: string
  site: string
  projectKey: string
  startTime: string | number | null
  endTime: string | number | null
  boardId: string
}
