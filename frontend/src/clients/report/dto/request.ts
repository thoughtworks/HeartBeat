export interface ReportRequestDTO {
  metrics: string[];
  startTime: string | null;
  endTime: string | null;
  considerHoliday: boolean;
  buildKiteSetting?: {
    type: string;
    token: string;
    pipelineCrews: string[];
    deploymentEnvList:
      | {
          id: string;
          name: string;
          orgId: string;
          orgName: string;
          repository: string;
          step: string;
          branches: string[];
        }[]
      | [];
  };
  codebaseSetting?: {
    type: string;
    token: string;
    leadTime: {
      id: string;
      name: string;
      orgId: string;
      orgName: string;
      repository: string;
      step: string;
      branches: string[];
    }[];
  };
  jiraBoardSetting?: {
    token: string;
    type: string;
    site: string;
    projectKey: string;
    boardId: string;
    boardColumns: { name: string; value: string }[];
    treatFlagCardAsBlock: boolean;
    users: string[];
    assigneeFilter: string;
    targetFields: { key: string; name: string; flag: boolean }[];
    overrideFields: { key: string; name: string; flag: boolean }[];
    reworkTimesSetting: ReworkSettingsRequest;
    doneColumn: string[];
  };
  csvTimeStamp?: number;
}

interface ReworkSettingsRequest {
  reworkState?: string | null;
  excludedStates?: string[];
}

export interface BoardReportRequestDTO {
  considerHoliday: boolean;
  startTime: string | null;
  endTime: string | null;
  metrics: string[];
  jiraBoardSetting?: {
    token: string;
    type: string;
    site: string;
    projectKey: string;
    boardId: string;
    boardColumns: { name: string; value: string }[];
    treatFlagCardAsBlock: boolean;
    users: string[];
    assigneeFilter: string;
    targetFields: { key: string; name: string; flag: boolean }[];
    overrideFields: { key: string; name: string; flag: boolean }[];
    reworkTimesSetting: ReworkSettingsRequest;
    doneColumn: string[];
  };
  csvTimeStamp?: number;
}

export interface CSVReportRequestDTO {
  dataType: string;
  csvTimeStamp: number;
  startDate: string;
  endDate: string;
}
