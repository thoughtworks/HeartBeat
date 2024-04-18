import { CALENDAR, REWORK_TIME_LIST } from '@src/constants/resources';
import { IReworkConfig } from '@src/context/Metrics/metricsSlice';

export interface OldFileConfig {
  projectName: string;
  metrics: string[];
  dateRange: {
    startDate: string;
    endDate: string;
  }[];
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
  cycleTime?: {
    jiraColumns?: unknown;
  };
  doneStatus?: string[];
  classifications?: string[];
  deployment?: OldConfigSetting[];
  leadTime?: OldConfigSetting[];
  pipelineCrews?: string[];
  reworkTimesSettings?: IReworkConfig;
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
  }[];
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
  cycleTime?: {
    jiraColumns?: unknown;
    type?: string;
  };
  doneStatus?: string[];
  classification?: string[];
  deployment?: NewConfigSetting[];
  leadTime?: NewConfigSetting[];
  pipelineCrews?: string[];
  reworkTimesSettings?: IReworkConfig;
}

const filterExcludeReworkStatus = (reworkTimesSettings: IReworkConfig | undefined) => {
  if (!reworkTimesSettings) return;
  const reworkState = REWORK_TIME_LIST.includes(reworkTimesSettings?.reworkState as string)
    ? reworkTimesSettings.reworkState
    : null;
  const excludeStates = reworkTimesSettings?.excludeStates.filter((value) => {
    return REWORK_TIME_LIST.includes(value);
  });
  return {
    reworkState,
    excludeStates: reworkState ? excludeStates : [],
  };
};

export const convertToNewFileConfig = (fileConfig: OldFileConfig | NewFileConfig): NewFileConfig => {
  if ('considerHoliday' in fileConfig) {
    const {
      projectName,
      metrics,
      dateRange,
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
      reworkTimesSettings,
    } = fileConfig;
    return {
      projectName,
      dateRange,
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
      reworkTimesSettings: filterExcludeReworkStatus(reworkTimesSettings),
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
  return { ...fileConfig, reworkTimesSettings: filterExcludeReworkStatus(fileConfig.reworkTimesSettings) };
};
