export interface ReportRequestDTO {
  metrics: string[]
  pipeline?: {
    type: string
    token: string
  }
  board?: {
    token: string
    type: string
    site: string
    email: string
    projectKey: string
    boardId: string
  }
  sourceControl?: {
    type: string
    token: string
  }
  calendarType: string
  startTime: string | null
  endTime: string | null
}
