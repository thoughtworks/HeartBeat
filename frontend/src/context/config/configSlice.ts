import {
  BOARD_METRICS,
  CALENDAR,
  DORA_METRICS,
  IMPORT_METRICS_MAPPING,
  MESSAGE,
  REQUIRED_DATA,
  MAX_TIME_RANGE_AMOUNT,
} from '@src/constants/resources';
import { initialPipelineToolState, IPipelineToolState } from '@src/context/config/pipelineTool/pipelineToolSlice';
import { initialSourceControlState, ISourceControl } from '@src/context/config/sourceControl/sourceControlSlice';
import { IBoardState, initialBoardState } from '@src/context/config/board/boardSlice';
import { pipeline } from '@src/context/config/pipelineTool/verifyResponseSlice';
import { createSlice } from '@reduxjs/toolkit';
import type { RootState } from '@src/store';
import union from 'lodash/union';
import merge from 'lodash/merge';
import { isArray } from 'lodash';
import dayjs from 'dayjs';

export type TDateRange = {
  startDate: string | null;
  endDate: string | null;
}[];

export interface BasicConfigState {
  isProjectCreated: boolean;
  basic: {
    projectName: string;
    calendarType: string;
    dateRange: TDateRange;
    metrics: string[];
  };
  board: IBoardState;
  pipelineTool: IPipelineToolState;
  sourceControl: ISourceControl;
  warningMessage: string | null;
}

export const initialBasicConfigState: BasicConfigState = {
  isProjectCreated: true,
  basic: {
    projectName: '',
    calendarType: CALENDAR.REGULAR,
    dateRange: [
      {
        startDate: null,
        endDate: null,
      },
    ],
    metrics: [],
  },
  board: initialBoardState,
  pipelineTool: initialPipelineToolState,
  sourceControl: initialSourceControlState,
  warningMessage: null,
};

const getMetricsInfo = (metrics: string[]) => {
  const {
    VELOCITY,
    CYCLE_TIME,
    CLASSIFICATION,
    LEAD_TIME_FOR_CHANGES,
    DEPLOYMENT_FREQUENCY,
    DEV_CHANGE_FAILURE_RATE,
    DEV_MEAN_TIME_TO_RECOVERY,
    REWORK_TIMES,
  } = REQUIRED_DATA;
  return {
    metrics: metrics
      .map((metric) => IMPORT_METRICS_MAPPING[metric])
      .filter((metric) => (Object.values(REQUIRED_DATA) as string[]).includes(metric)),
    shouldBoardShow: [VELOCITY, CYCLE_TIME, CLASSIFICATION, REWORK_TIMES].some((metric) => metrics.includes(metric)),
    shouldPipelineToolShow: [
      LEAD_TIME_FOR_CHANGES,
      DEPLOYMENT_FREQUENCY,
      DEV_CHANGE_FAILURE_RATE,
      DEV_MEAN_TIME_TO_RECOVERY,
    ].some((metric) => metrics.includes(metric)),
    shouldSourceControlShow: [LEAD_TIME_FOR_CHANGES].some((metric) => metrics.includes(metric)),
  };
};

export const configSlice = createSlice({
  name: 'config',
  initialState: {
    ...initialBasicConfigState,
    board: { ...initialBoardState },
    pipelineTool: { ...initialPipelineToolState },
    sourceControl: { ...initialSourceControlState },
  },
  reducers: {
    updateProjectName: (state, action) => {
      state.basic.projectName = action.payload;
    },
    updateCalendarType: (state, action) => {
      state.basic.calendarType = action.payload;
    },
    updateDateRange: (state, action) => {
      state.basic.dateRange = action.payload;
    },
    updateMetrics: (state, action) => {
      const { metrics, shouldBoardShow, shouldPipelineToolShow, shouldSourceControlShow } = getMetricsInfo(
        action.payload,
      );
      state.basic.metrics = metrics;
      state.board.isShow = shouldBoardShow;
      state.pipelineTool.isShow = shouldPipelineToolShow;
      state.sourceControl.isShow = shouldSourceControlShow;
    },
    updateBasicConfigState: (state, action) => {
      state.basic = action.payload;
      const { metrics, shouldBoardShow, shouldPipelineToolShow, shouldSourceControlShow } = getMetricsInfo(
        action.payload.metrics,
      );
      let importedDateRanges = action.payload.dateRange;
      importedDateRanges =
        importedDateRanges && importedDateRanges?.startDate && importedDateRanges?.endDate
          ? [importedDateRanges]
          : importedDateRanges;
      state.basic.dateRange =
        Array.isArray(importedDateRanges) && importedDateRanges.length > MAX_TIME_RANGE_AMOUNT
          ? importedDateRanges.slice(0, MAX_TIME_RANGE_AMOUNT)
          : importedDateRanges;
      state.basic.metrics = metrics;
      state.board.isShow = shouldBoardShow;
      state.pipelineTool.isShow = shouldPipelineToolShow;
      state.sourceControl.isShow = shouldSourceControlShow;
      const { projectName } = state.basic;
      if (!state.isProjectCreated) {
        state.warningMessage =
          projectName &&
          isArray(importedDateRanges) &&
          importedDateRanges.length > 0 &&
          importedDateRanges.length <= 6 &&
          metrics.length > 0
            ? null
            : MESSAGE.CONFIG_PAGE_VERIFY_IMPORT_ERROR;
      }
      state.board.config = merge(action.payload.board, { type: 'jira' });
      state.pipelineTool.config = action.payload.pipelineTool || state.pipelineTool.config;
      state.sourceControl.config = action.payload.sourceControl || state.sourceControl.config;
    },
    updateProjectCreatedState: (state, action) => {
      state.isProjectCreated = action.payload;
    },
    updateBoardVerifyState: (state, action) => {
      state.board.isVerified = action.payload;
    },
    updateBoard: (state, action) => {
      state.board.config = action.payload;
    },
    updateJiraVerifyResponse: (state, action) => {
      const { jiraColumns, targetFields, users } = action.payload;
      state.board.verifiedResponse.jiraColumns = jiraColumns;
      state.board.verifiedResponse.targetFields = targetFields;
      state.board.verifiedResponse.users = users;
    },

    updatePipelineToolVerifyState: (state, action) => {
      state.pipelineTool.isVerified = action.payload;
    },
    updatePipelineTool: (state, action) => {
      state.pipelineTool.config = action.payload;
    },
    updatePipelineToolVerifyResponse: (state, action) => {
      const { pipelineList } = action.payload;
      state.pipelineTool.verifiedResponse.pipelineList = pipelineList.map((pipeline: pipeline) => ({
        ...pipeline,
        steps: [],
      }));
    },
    updatePipelineToolVerifyResponseSteps: (state, action) => {
      const { organization, pipelineName, steps, branches, pipelineCrews } = action.payload;
      state.pipelineTool.verifiedResponse.pipelineList = state.pipelineTool.verifiedResponse.pipelineList.map(
        (pipeline) =>
          pipeline.name === pipelineName && pipeline.orgName === organization
            ? {
                ...pipeline,
                branches: branches,
                steps: steps,
              }
            : pipeline,
      );

      state.pipelineTool.verifiedResponse.pipelineCrews = union(
        state.pipelineTool.verifiedResponse.pipelineCrews,
        pipelineCrews,
      );
    },
    updateSourceControlVerifyState: (state, action) => {
      state.sourceControl.isVerified = action.payload;
    },
    updateSourceControl: (state, action) => {
      state.sourceControl.config = action.payload;
    },
    updateSourceControlVerifiedResponse: (state, action) => {
      const { githubRepos } = action.payload;
      state.sourceControl.verifiedResponse.repoList = githubRepos;
    },
    resetImportedData: () => initialBasicConfigState,
  },
});
export const {
  updateProjectCreatedState,
  updateProjectName,
  updateCalendarType,
  updateDateRange,
  updateMetrics,
  updateBoard,
  updateBoardVerifyState,
  updateJiraVerifyResponse,
  updateBasicConfigState,
  updatePipelineToolVerifyState,
  updatePipelineTool,
  updatePipelineToolVerifyResponse,
  updateSourceControl,
  updateSourceControlVerifyState,
  updateSourceControlVerifiedResponse,
  updatePipelineToolVerifyResponseSteps,
  resetImportedData,
} = configSlice.actions;

export const selectProjectName = (state: RootState) => state.config.basic.projectName;
export const selectCalendarType = (state: RootState) => state.config.basic.calendarType;
export const selectDateRange = (state: RootState) => state.config.basic.dateRange;
export const selectMetrics = (state: RootState) => state.config.basic.metrics;
export const isSelectBoardMetrics = (state: RootState) =>
  state.config.basic.metrics.some((metric) => BOARD_METRICS.includes(metric));
export const isSelectDoraMetrics = (state: RootState) =>
  state.config.basic.metrics.some((metric) => DORA_METRICS.includes(metric));
export const isOnlySelectClassification = (state: RootState) =>
  state.config.basic.metrics.length === 1 && state.config.basic.metrics[0] === REQUIRED_DATA.CLASSIFICATION;
export const selectBoard = (state: RootState) => state.config.board.config;
export const isPipelineToolVerified = (state: RootState) => state.config.pipelineTool.isVerified;
export const selectPipelineTool = (state: RootState) => state.config.pipelineTool.config;
export const isSourceControlVerified = (state: RootState) => state.config.sourceControl.isVerified;
export const selectSourceControl = (state: RootState) => state.config.sourceControl.config;
export const selectWarningMessage = (state: RootState) => state.config.warningMessage;

export const selectConfig = (state: RootState) => state.config;

export const selectIsBoardVerified = (state: RootState) => state.config.board.isVerified;
export const selectUsers = (state: RootState) => state.config.board.verifiedResponse.users;
export const selectJiraColumns = (state: RootState) => state.config.board.verifiedResponse.jiraColumns;
export const selectIsProjectCreated = (state: RootState) => state.config.isProjectCreated;
export const selectPipelineOrganizations = (state: RootState) => [
  ...new Set(state.config.pipelineTool.verifiedResponse.pipelineList.map((item) => item.orgName)),
];

export const selectPipelineNames = (state: RootState, organization: string) =>
  state.config.pipelineTool.verifiedResponse.pipelineList
    .filter((pipeline) => pipeline.orgName === organization)
    .map((item) => item.name)
    .sort((a, b) => a.localeCompare(b, undefined, { sensitivity: 'base' }));

export const selectStepsParams = (state: RootState, organizationName: string, pipelineName: string) => {
  const pipeline = state.config.pipelineTool.verifiedResponse.pipelineList.find(
    (pipeline) => pipeline.name === pipelineName && pipeline.orgName === organizationName,
  );

  const { startDate, endDate } = state.config.basic.dateRange[0];
  const pipelineType = state.config.pipelineTool.config.type;
  const token = state.config.pipelineTool.config.token;

  return {
    params: {
      pipelineName: pipeline?.name ?? '',
      repository: pipeline?.repository ?? '',
      orgName: pipeline?.orgName ?? '',
      startTime: dayjs(startDate).startOf('date').valueOf(),
      endTime: dayjs(endDate).endOf('date').valueOf(),
    },
    buildId: pipeline?.id ?? '',
    organizationId: pipeline?.orgId ?? '',
    pipelineType,
    token,
  };
};

export const selectPipelineList = (state: RootState) => state.config.pipelineTool.verifiedResponse.pipelineList;

export const selectSteps = (state: RootState, organizationName: string, pipelineName: string) =>
  state.config.pipelineTool.verifiedResponse.pipelineList.find(
    (pipeline) => pipeline.name === pipelineName && pipeline.orgName === organizationName,
  )?.steps ?? [];

export const selectPipelineCrews = (state: RootState) => state.config.pipelineTool.verifiedResponse.pipelineCrews;

export default configSlice.reducer;
