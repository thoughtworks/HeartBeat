import { CHINA_CALENDAR, REGULAR_CALENDAR } from '@src/constants'

export interface OldFileConfig {
  projectName: string
  metrics: string[]
  startDate: string
  endDate: string
  considerHoliday: boolean
  board?: {
    type?: string
    verifyToken?: string
    boardId?: string
    token?: string
    site?: string
    email?: string
    projectKey?: string
  }
  pipelineTool?: {
    type?: string
    verifyToken?: string
    token?: string
  }
  sourceControl?: {
    type?: string
    verifyToken?: string
    token?: string
  }
  crews?: string[]
  cycleTime?: unknown
  doneStatus?: string[]
  classifications?: string[]
  deployment?: OldConfigSetting[]
  leadTime?: OldConfigSetting[]
}

interface OldConfigSetting {
  pipelineId?: string
  step?: string
  orgId?: string
}

interface NewConfigSetting {
  id: number
  organization?: string
  pipelineName?: string
  step?: string
}

export interface NewFileConfig {
  projectName: string
  dateRange: {
    startDate: string
    endDate: string
  }
  calendarType: string
  metrics: string[]
  board?: {
    type?: string
    boardId?: string
    email?: string
    projectKey?: string
    site?: string
    token?: string
  }
  pipelineTool?: {
    type?: string
    token?: string
  }
  sourceControl?: {
    type?: string
    token?: string
  }
  crews?: string[]
  cycleTime?: unknown
  doneStatus?: string[]
  classification?: string[]
  deployment?: NewConfigSetting[]
  leadTime?: NewConfigSetting[]
}
export const convertToNewFileConfig = (fileConfig: OldFileConfig | NewFileConfig): NewFileConfig => {
  if ('considerHoliday' in fileConfig) {
    const {
      projectName,
      metrics,
      startDate,
      endDate,
      considerHoliday,
      board,
      pipelineTool,
      sourceControl,
      crews,
      cycleTime,
      doneStatus,
      classifications,
      deployment,
      leadTime,
    } = fileConfig
    return {
      projectName,
      dateRange: { startDate, endDate },
      calendarType: considerHoliday ? CHINA_CALENDAR : REGULAR_CALENDAR,
      metrics,
      board: {
        type: board?.type,
        boardId: board?.boardId,
        email: board?.email,
        projectKey: board?.projectKey,
        site: board?.site,
        token: board?.token,
      },
      pipelineTool: {
        type: pipelineTool?.type,
        token: pipelineTool?.token,
      },
      sourceControl: {
        type: sourceControl?.type,
        token: sourceControl?.token,
      },
      crews,
      cycleTime,
      doneStatus,
      classification: classifications,
      deployment: deployment?.map((item, index) => ({
        id: index,
        organization: item?.orgId,
        pipelineName: item?.pipelineId,
        step: item?.step,
      })),
      leadTime: leadTime?.map((item, index) => ({
        id: index,
        organization: item?.orgId,
        pipelineName: item?.pipelineId,
        step: item?.step,
      })),
    }
  }
  return fileConfig
}
