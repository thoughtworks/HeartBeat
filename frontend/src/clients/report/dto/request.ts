export interface ReportRequestDTO {
  metrics: string[]
  startTime: string | null
  endTime: string | null
  considerHoliday: boolean
  pipeline?: {
    type: string
    token: string
  }
  jiraBoardSetting?: {
    token: string
    type: string
    site: string
    projectKey: string
    boardId: string
    boardColumns: { name: string; value: string }[]
    treatFlagCardAsBlock: boolean
    users: string[]
    targetFields: { key: string; name: string; flag: boolean }[]
    doneColumn: string[]
  }
}
