import { CALENDAR } from '@src/constants/resources';

export interface OldFileConfig {
  projectName: string;
  metrics: string[];
  startDate: string;
  endDate: string;
  considerHoliday: boolean;
  board?: {
    type?: string;
    verifyToken?: string;
    boardId?: string;
    token?: string;
    site?: string;
    email?: string;
    projectKey?: string;
  };
  pipelineTool?: {
    type?: string;
    verifyToken?: string;
    token?: string;
  };
  sourceControl?: {
    type?: string;
    verifyToken?: string;
    token?: string;
  };
  crews?: string[];
  assigneeFilter?: string;
  cycleTime?: unknown;
  doneStatus?: string[];
  classifications?: string[];
  deployment?: OldConfigSetting[];
  leadTime?: OldConfigSetting[];
  pipelineCrews?: string[];
}

interface OldConfigSetting {
  pipelineId?: string;
  step?: string;
  orgId?: string;
  branches?: string[];
}

interface NewConfigSetting {
  id: number;
  organization?: string;
  pipelineName?: string;
  step?: string;
  branch?: string[];
}

export interface NewFileConfig {
  projectName: string;
  dateRange: {
    startDate: string;
    endDate: string;
  };
  calendarType: string;
  metrics: string[];
  board?: {
    type?: string;
    boardId?: string;
    email?: string;
    projectKey?: string;
    site?: string;
    token?: string;
  };
  pipelineTool?: {
    type?: string;
    token?: string;
  };
  sourceControl?: {
    type?: string;
    token?: string;
  };
  crews?: string[];
  assigneeFilter?: string;
  cycleTime?: unknown;
  doneStatus?: string[];
  classification?: string[];
  deployment?: NewConfigSetting[];
  leadTime?: NewConfigSetting[];
  pipelineCrews?: string[];
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
      assigneeFilter,
      cycleTime,
      doneStatus,
      classifications,
      deployment,
      pipelineCrews,
    } = fileConfig;
    return {
      projectName,
      dateRange: { startDate, endDate },
      calendarType: considerHoliday ? CALENDAR.CHINA : CALENDAR.REGULAR,
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
      assigneeFilter,
      pipelineCrews,
      cycleTime,
      doneStatus,
      classification: classifications,
      deployment: deployment?.map((item, index) => ({
        id: index,
        organization: item?.orgId,
        pipelineName: item?.pipelineId,
        step: item?.step,
        branches: item?.branches,
      })),
    };
  }
  return fileConfig;
};
