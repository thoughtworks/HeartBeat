import {
  ASSIGNEE_FILTER_TYPES,
  CYCLE_TIME_LIST,
  CYCLE_TIME_SETTINGS_TYPES,
  MESSAGE,
  METRICS_CONSTANTS,
} from '@src/constants/resources';
import { convertCycleTimeSettings, getSortedAndDeduplicationBoardingMapping } from '@src/utils/util';
import { pipeline } from '@src/context/config/pipelineTool/verifyResponseSlice';
import { createSlice } from '@reduxjs/toolkit';
import camelCase from 'lodash.camelcase';
import { RootState } from '@src/store';
import _ from 'lodash';

export interface IPipelineConfig {
  id: number;
  organization: string;
  pipelineName: string;
  step: string;
  branches: string[];
}

export interface IReworkConfig {
  reworkState: string | null;
  excludeStates: string[];
}

export interface IPipelineWarningMessageConfig {
  id: number | null;
  organization: string | null;
  pipelineName: string | null;
  step: string | null;
}

export interface ICycleTimeSetting {
  column: string;
  status: string;
  value: string;
}

export interface ISavedMetricsSettingState {
  shouldGetBoardConfig: boolean;
  shouldGetPipeLineConfig: boolean;
  jiraColumns: { key: string; value: { name: string; statuses: string[] } }[];
  targetFields: { name: string; key: string; flag: boolean }[];
  users: string[];
  pipelineCrews: string[];
  doneColumn: string[];
  cycleTimeSettingsType: CYCLE_TIME_SETTINGS_TYPES;
  cycleTimeSettings: ICycleTimeSetting[];
  deploymentFrequencySettings: IPipelineConfig[];
  leadTimeForChanges: IPipelineConfig[];
  treatFlagCardAsBlock: boolean;
  assigneeFilter: string;
  firstTimeRoadMetricData: boolean;
  importedData: {
    importedCrews: string[];
    importedAssigneeFilter: string;
    importedPipelineCrews: string[];
    importedCycleTime: {
      importedCycleTimeSettings: { [key: string]: string }[];
      importedTreatFlagCardAsBlock: boolean;
    };
    importedDoneStatus: string[];
    importedClassification: string[];
    importedDeployment: IPipelineConfig[];
    importedAdvancedSettings: { storyPoint: string; flag: string } | null;
    reworkTimesSettings: IReworkConfig;
  };
  cycleTimeWarningMessage: string | null;
  classificationWarningMessage: string | null;
  realDoneWarningMessage: string | null;
  deploymentWarningMessage: IPipelineWarningMessageConfig[];
}

const initialState: ISavedMetricsSettingState = {
  shouldGetBoardConfig: false,
  shouldGetPipeLineConfig: false,
  jiraColumns: [],
  targetFields: [],
  users: [],
  pipelineCrews: [],
  doneColumn: [],
  cycleTimeSettingsType: CYCLE_TIME_SETTINGS_TYPES.BY_COLUMN,
  cycleTimeSettings: [],
  deploymentFrequencySettings: [],
  leadTimeForChanges: [{ id: 0, organization: '', pipelineName: '', step: '', branches: [] }],
  treatFlagCardAsBlock: true,
  assigneeFilter: ASSIGNEE_FILTER_TYPES.LAST_ASSIGNEE,
  firstTimeRoadMetricData: true,
  importedData: {
    importedCrews: [],
    importedAssigneeFilter: ASSIGNEE_FILTER_TYPES.LAST_ASSIGNEE,
    importedPipelineCrews: [],
    importedCycleTime: {
      importedCycleTimeSettings: [],
      importedTreatFlagCardAsBlock: true,
    },
    importedDoneStatus: [],
    importedClassification: [],
    importedDeployment: [],
    importedAdvancedSettings: null,
    reworkTimesSettings: {
      reworkState: null,
      excludeStates: [],
    },
  },
  cycleTimeWarningMessage: null,
  classificationWarningMessage: null,
  realDoneWarningMessage: null,
  deploymentWarningMessage: [],
};

const compareArrays = (arrayA: string[], arrayB: string[], key: string): string | null => {
  if (arrayA?.length > arrayB?.length) {
    const differentValues = arrayA?.filter((value) => !arrayB.includes(value));
    return `The ${key} of ${differentValues} is a deleted ${key}, which means this ${key} existed the time you saved config, but was deleted. Please confirm!`;
  } else {
    const differentValues = arrayB?.filter((value) => !arrayA.includes(value));
    return differentValues?.length > 0
      ? `The ${key} of ${differentValues} is a new ${key}. Please select a value for it!`
      : null;
  }
};
const findDifferentValues = (arrayA: string[], arrayB: string[]): string[] | null => {
  const diffInArrayA = arrayA?.filter((value) => !arrayB.includes(value));
  if (diffInArrayA?.length === 0) {
    return null;
  } else {
    return diffInArrayA;
  }
};
const findKeyByValues = (arrayA: { [key: string]: string }[], arrayB: string[]): string | null => {
  const matchingKeys: string[] = [];

  for (const setting of arrayA) {
    const key = Object.keys(setting)[0];
    const value = setting[key];
    if (arrayB.includes(value)) {
      matchingKeys.push(key);
    }
  }
  return `The value of ${matchingKeys} in imported json is not in dropdown list now. Please select a value for it!`;
};

const setImportSelectUsers = (metricsState: ISavedMetricsSettingState, users: string[], importedCrews: string[]) => {
  if (metricsState.firstTimeRoadMetricData) {
    return users.filter((item: string) => importedCrews?.includes(item));
  } else {
    return users.filter((item: string) => metricsState.users?.includes(item));
  }
};

const setCreateSelectUsers = (metricsState: ISavedMetricsSettingState, users: string[]) => {
  if (metricsState.firstTimeRoadMetricData) {
    return users;
  } else {
    return users.filter((item: string) => metricsState.users?.includes(item));
  }
};

const setPipelineCrews = (isProjectCreated: boolean, pipelineCrews: string[], importedPipelineCrews: string[]) => {
  if (_.isEmpty(pipelineCrews)) {
    return [];
  }
  if (isProjectCreated) {
    return pipelineCrews;
  }
  return pipelineCrews.filter((item: string) => importedPipelineCrews?.includes(item));
};

const setSelectTargetFields = (
  state: ISavedMetricsSettingState,
  targetFields: { name: string; key: string; flag: boolean }[],
  isProjectCreated: boolean,
) => {
  if (isProjectCreated) {
    return setCreateSelectTargetFields(state, targetFields);
  } else {
    return setImportSelectTargetFields(state, targetFields);
  }
};

const setImportSelectTargetFields = (
  state: ISavedMetricsSettingState,
  targetFields: { name: string; key: string; flag: boolean }[],
) => {
  if (state.firstTimeRoadMetricData) {
    return targetFields.map((item: { name: string; key: string; flag: boolean }) => ({
      ...item,
      flag: state.importedData.importedClassification.includes(item.key),
    }));
  } else {
    return getTargetFieldsIntersection(state, targetFields);
  }
};

const setCreateSelectTargetFields = (
  state: ISavedMetricsSettingState,
  targetFields: {
    name: string;
    key: string;
    flag: boolean;
  }[],
) => {
  if (state.firstTimeRoadMetricData) {
    return targetFields;
  } else {
    return getTargetFieldsIntersection(state, targetFields);
  }
};

const getTargetFieldsIntersection = (
  state: ISavedMetricsSettingState,
  targetFields: {
    name: string;
    key: string;
    flag: boolean;
  }[],
) => {
  const selectedFields = state.targetFields.filter((value) => value.flag).map((value) => value.key);
  return targetFields.map((item: { name: string; key: string; flag: boolean }) => ({
    ...item,
    flag: selectedFields.includes(item.key),
  }));
};

const getCycleTimeSettingsByColumn = (
  state: ISavedMetricsSettingState,
  jiraColumns: { key: string; value: { name: string; statuses: string[] } }[],
) => {
  const preCycleTimeSettings = state.firstTimeRoadMetricData
    ? state.importedData.importedCycleTime.importedCycleTimeSettings
    : convertCycleTimeSettings(state.cycleTimeSettingsType, state.cycleTimeSettings);
  return jiraColumns.flatMap(({ value: { name, statuses } }) => {
    const importItem = preCycleTimeSettings.find((i) => Object.keys(i).includes(name));
    const isValidValue = importItem && CYCLE_TIME_LIST.includes(Object.values(importItem)[0]);
    return statuses.map((status) => ({
      column: name,
      status,
      value: isValidValue ? (Object.values(importItem)[0] as string) : METRICS_CONSTANTS.cycleTimeEmptyStr,
    }));
  });
};

const getCycleTimeSettingsByStatus = (
  state: ISavedMetricsSettingState,
  jiraColumns: { key: string; value: { name: string; statuses: string[] } }[],
) => {
  const preCycleTimeSettings = state.firstTimeRoadMetricData
    ? state.importedData.importedCycleTime.importedCycleTimeSettings
    : convertCycleTimeSettings(state.cycleTimeSettingsType, state.cycleTimeSettings);
  return jiraColumns.flatMap(({ value: { name, statuses } }) =>
    statuses.map((status) => {
      const importItem = preCycleTimeSettings.find((i) => Object.keys(i).includes(status));
      const isValidValue = importItem && CYCLE_TIME_LIST.includes(Object.values(importItem)[0]);
      return {
        column: name,
        status,
        value: isValidValue ? (Object.values(importItem)[0] as string) : METRICS_CONSTANTS.cycleTimeEmptyStr,
      };
    }),
  );
};

const getSelectedDoneStatus = (
  jiraColumns: { key: string; value: { name: string; statuses: string[] } }[],
  cycleTimeSettings: ICycleTimeSetting[],
  importedDoneStatus: string[],
) => {
  const doneStatus =
    jiraColumns?.find((item) => item.key === METRICS_CONSTANTS.doneKeyFromBackend)?.value.statuses ?? [];
  const selectedDoneStatus = cycleTimeSettings
    ?.filter(({ value }) => value === METRICS_CONSTANTS.doneValue)
    .map(({ status }) => status);
  const status = selectedDoneStatus?.length < 1 ? doneStatus : selectedDoneStatus;
  return status.filter((item: string) => importedDoneStatus.includes(item));
};

function resetReworkTimeSettingWhenMappingModified(preJiraColumnsValue: string[], state: ISavedMetricsSettingState) {
  const boardingMapping = getSortedAndDeduplicationBoardingMapping(state.cycleTimeSettings).filter(
    (item) => item !== METRICS_CONSTANTS.cycleTimeEmptyStr,
  );
  if (state.firstTimeRoadMetricData || _.isEqual(preJiraColumnsValue, boardingMapping)) {
    return;
  }
  state.importedData.reworkTimesSettings = {
    reworkState: null,
    excludeStates: [],
  };
}

export const metricsSlice = createSlice({
  name: 'metrics',
  initialState,
  reducers: {
    saveTargetFields: (state, action) => {
      state.targetFields = action.payload;
    },
    saveDoneColumn: (state, action) => {
      state.doneColumn = action.payload;
    },
    saveUsers: (state, action) => {
      state.users = action.payload;
    },
    savePipelineCrews: (state, action) => {
      state.pipelineCrews = action.payload;
    },
    updateCycleTimeSettings: (state, action) => {
      state.cycleTimeSettings = action.payload;
    },
    setCycleTimeSettingsType: (state, action) => {
      state.cycleTimeSettingsType = action.payload;
    },
    addADeploymentFrequencySetting: (state) => {
      const { deploymentFrequencySettings, importedData } = state;
      const maxId = Math.max(
        deploymentFrequencySettings[deploymentFrequencySettings.length - 1]?.id ?? 0,
        importedData.importedDeployment[importedData.importedDeployment.length - 1]?.id ?? 0,
      );
      const newId = maxId + 1;
      state.deploymentFrequencySettings = [
        ...deploymentFrequencySettings,
        { id: newId, organization: '', pipelineName: '', step: '', branches: [] },
      ];
    },

    updateDeploymentFrequencySettings: (state, action) => {
      const { updateId, label, value } = action.payload;

      state.deploymentFrequencySettings = state.deploymentFrequencySettings.map((deploymentFrequencySetting) => {
        return deploymentFrequencySetting.id === updateId
          ? {
              ...deploymentFrequencySetting,
              [label === 'Steps' ? 'step' : camelCase(label)]: value,
            }
          : deploymentFrequencySetting;
      });
    },

    updateShouldGetBoardConfig: (state, action) => {
      state.shouldGetBoardConfig = action.payload;
    },

    updateShouldGetPipelineConfig: (state, action) => {
      state.shouldGetPipeLineConfig = action.payload;
    },

    updateMetricsImportedData: (state, action) => {
      const {
        crews,
        cycleTime,
        doneStatus,
        classification,
        deployment,
        advancedSettings,
        leadTime,
        assigneeFilter,
        pipelineCrews,
        reworkTimesSettings,
      } = action.payload;
      state.importedData.importedCrews = crews || state.importedData.importedCrews;
      state.importedData.importedPipelineCrews = pipelineCrews || state.importedData.importedPipelineCrews;
      state.importedData.importedCycleTime.importedCycleTimeSettings =
        cycleTime?.jiraColumns || state.importedData.importedCycleTime.importedCycleTimeSettings;
      state.importedData.importedCycleTime.importedTreatFlagCardAsBlock =
        cycleTime?.treatFlagCardAsBlock && state.importedData.importedCycleTime.importedTreatFlagCardAsBlock;
      state.importedData.importedAssigneeFilter = assigneeFilter || state.importedData.importedAssigneeFilter;
      state.importedData.importedDoneStatus = doneStatus || state.importedData.importedDoneStatus;
      state.importedData.importedClassification = classification || state.importedData.importedClassification;
      state.importedData.importedDeployment = deployment || leadTime || state.importedData.importedDeployment;
      state.importedData.importedAdvancedSettings = advancedSettings || state.importedData.importedAdvancedSettings;
      state.importedData.reworkTimesSettings = reworkTimesSettings || state.importedData.reworkTimesSettings;
    },

    updateMetricsState: (state, action) => {
      const { targetFields, users, jiraColumns, isProjectCreated, ignoredTargetFields } = action.payload;
      const { importedCrews, importedClassification, importedCycleTime, importedDoneStatus, importedAssigneeFilter } =
        state.importedData;
      const preJiraColumnsValue = getSortedAndDeduplicationBoardingMapping(state.cycleTimeSettings).filter(
        (item) => item !== METRICS_CONSTANTS.cycleTimeEmptyStr,
      );
      state.users = isProjectCreated
        ? setCreateSelectUsers(state, users)
        : setImportSelectUsers(state, users, importedCrews);
      state.targetFields = setSelectTargetFields(state, targetFields, isProjectCreated);

      if (!isProjectCreated && importedCycleTime?.importedCycleTimeSettings?.length > 0) {
        const importedCycleTimeSettingsKeys = importedCycleTime.importedCycleTimeSettings.flatMap((obj) =>
          Object.keys(obj),
        );
        const importedCycleTimeSettingsValues = importedCycleTime.importedCycleTimeSettings.flatMap((obj) =>
          Object.values(obj),
        );
        const jiraColumnsNames = jiraColumns?.map(
          (obj: { key: string; value: { name: string; statuses: string[] } }) => obj.value.name,
        );
        const jiraStatuses = jiraColumns?.flatMap(
          (obj: { key: string; value: { name: string; statuses: string[] } }) => obj.value.statuses,
        );
        const metricsContainsValues = Object.values(METRICS_CONSTANTS);
        const importedKeyMismatchWarning =
          state.cycleTimeSettingsType === CYCLE_TIME_SETTINGS_TYPES.BY_COLUMN
            ? compareArrays(importedCycleTimeSettingsKeys, jiraColumnsNames, 'column')
            : compareArrays(importedCycleTimeSettingsKeys, jiraStatuses, 'status');
        const importedValueMismatchWarning = findDifferentValues(
          importedCycleTimeSettingsValues,
          metricsContainsValues,
        );

        const getWarningMessage = (): string | null => {
          if (importedKeyMismatchWarning?.length) {
            return importedKeyMismatchWarning;
          }
          if (importedValueMismatchWarning?.length) {
            return findKeyByValues(importedCycleTime.importedCycleTimeSettings, importedValueMismatchWarning);
          }
          return null;
        };
        state.cycleTimeWarningMessage = getWarningMessage();
      } else {
        state.cycleTimeWarningMessage = null;
      }

      if (!isProjectCreated && importedClassification?.length > 0) {
        const keyArray = targetFields?.map((field: { key: string; name: string; flag: boolean }) => field.key);
        const ignoredKeyArray = ignoredTargetFields?.map(
          (field: { key: string; name: string; flag: boolean }) => field.key,
        );
        const filteredImportedClassification = importedClassification.filter((item) => !ignoredKeyArray.includes(item));
        if (filteredImportedClassification.every((item) => keyArray.includes(item))) {
          state.classificationWarningMessage = null;
        } else {
          state.classificationWarningMessage = MESSAGE.CLASSIFICATION_WARNING;
        }
      } else {
        state.classificationWarningMessage = null;
      }
      if (jiraColumns) {
        state.cycleTimeSettings =
          state.cycleTimeSettingsType === CYCLE_TIME_SETTINGS_TYPES.BY_COLUMN
            ? getCycleTimeSettingsByColumn(state, jiraColumns)
            : getCycleTimeSettingsByStatus(state, jiraColumns);
      }
      resetReworkTimeSettingWhenMappingModified(preJiraColumnsValue, state);

      if (!isProjectCreated && importedDoneStatus.length > 0) {
        const selectedDoneStatus = getSelectedDoneStatus(jiraColumns, state.cycleTimeSettings, importedDoneStatus);
        selectedDoneStatus.length < importedDoneStatus.length
          ? (state.realDoneWarningMessage = MESSAGE.REAL_DONE_WARNING)
          : (state.realDoneWarningMessage = null);
        state.doneColumn = selectedDoneStatus;
      }

      state.assigneeFilter =
        importedAssigneeFilter === ASSIGNEE_FILTER_TYPES.LAST_ASSIGNEE ||
        importedAssigneeFilter === ASSIGNEE_FILTER_TYPES.HISTORICAL_ASSIGNEE
          ? importedAssigneeFilter
          : ASSIGNEE_FILTER_TYPES.LAST_ASSIGNEE;

      state.treatFlagCardAsBlock =
        typeof importedCycleTime.importedTreatFlagCardAsBlock === 'boolean'
          ? importedCycleTime.importedTreatFlagCardAsBlock
          : true;
    },

    updatePipelineSettings: (state, action) => {
      const { pipelineList, isProjectCreated, pipelineCrews } = action.payload;
      const { importedDeployment, importedPipelineCrews } = state.importedData;

      if (pipelineCrews) {
        state.pipelineCrews = setPipelineCrews(isProjectCreated, pipelineCrews, importedPipelineCrews);
      }
      const orgNames: Array<string> = _.uniq(pipelineList.map((item: pipeline) => item.orgName));
      const filteredPipelineNames = (organization: string) =>
        pipelineList
          .filter((pipeline: pipeline) => pipeline.orgName.toLowerCase() === organization.toLowerCase())
          .map((item: pipeline) => item.name);
      const getValidPipelines = (pipelines: IPipelineConfig[]) => {
        const hasPipeline = pipelines.filter(({ id }) => id !== undefined).length;
        return pipelines.length && hasPipeline
          ? pipelines.map(({ id, organization, pipelineName, step, branches }) => ({
              id,
              organization: orgNames.find((i) => (i as string).toLowerCase() === organization.toLowerCase()) || '',
              pipelineName: filteredPipelineNames(organization).includes(pipelineName) ? pipelineName : '',
              step: step || '',
              branches: branches || [],
            }))
          : [{ id: 0, organization: '', pipelineName: '', step: '', branches: [] }];
      };
      const createPipelineWarning = ({ id, organization, pipelineName }: IPipelineConfig) => {
        const orgWarning = orgNames.some((i) => (i as string).toLowerCase() === organization.toLowerCase())
          ? null
          : MESSAGE.ORGANIZATION_WARNING;
        const pipelineNameWarning =
          orgWarning || filteredPipelineNames(organization).includes(pipelineName)
            ? null
            : MESSAGE.PIPELINE_NAME_WARNING;

        return {
          id,
          organization: orgWarning,
          pipelineName: pipelineNameWarning,
          step: null,
        };
      };

      const getPipelinesWarningMessage = (pipelines: IPipelineConfig[]) => {
        const hasPipeline = pipelines.filter(({ id }) => id !== undefined).length;
        if (!pipelines.length || isProjectCreated || !hasPipeline) {
          return [];
        }
        return pipelines.map((pipeline) => createPipelineWarning(pipeline));
      };

      const deploymentSettings =
        state.deploymentFrequencySettings.length > 0 ? state.deploymentFrequencySettings : importedDeployment;

      state.deploymentFrequencySettings = getValidPipelines(deploymentSettings);
      state.deploymentWarningMessage = getPipelinesWarningMessage(deploymentSettings);
    },

    updatePipelineStep: (state, action) => {
      const { steps, id, branches, pipelineCrews } = action.payload;
      const { importedDeployment, importedPipelineCrews } = state.importedData;
      const updatedImportedPipelineStep = importedDeployment.find((pipeline) => pipeline.id === id)?.step ?? '';
      const updatedImportedPipelineBranches = importedDeployment.find((pipeline) => pipeline.id === id)?.branches ?? [];
      const selectedPipelineStep = state.deploymentFrequencySettings.find((pipeline) => pipeline.id === id)?.step ?? '';
      state.pipelineCrews = _.filter(pipelineCrews, (crew) => importedPipelineCrews.includes(crew));
      const stepWarningMessage = (selectedStep: string) => (steps.includes(selectedStep) ? null : MESSAGE.STEP_WARNING);

      const validStep = (selectedStep: string): string => (steps.includes(selectedStep) ? selectedStep : '');

      const validBranches = (selectedBranches: string[]): string[] =>
        _.filter(branches, (branch) => selectedBranches.includes(branch));

      const getPipelineSettings = (pipelines: IPipelineConfig[]) =>
        pipelines.map((pipeline) =>
          pipeline.id === id
            ? {
                ...pipeline,
                step: validStep(pipeline.step || updatedImportedPipelineStep),
                branches: validBranches(
                  pipeline.branches.length > 0 ? pipeline.branches : updatedImportedPipelineBranches,
                ),
              }
            : pipeline,
        );

      const getStepWarningMessage = (pipelines: IPipelineWarningMessageConfig[]) => {
        return pipelines.map((pipeline) =>
          pipeline?.id === id
            ? {
                ...pipeline,
                step: stepWarningMessage(selectedPipelineStep || updatedImportedPipelineStep),
              }
            : pipeline,
        );
      };

      state.deploymentFrequencySettings = getPipelineSettings(state.deploymentFrequencySettings);
      state.deploymentWarningMessage = getStepWarningMessage(state.deploymentWarningMessage);
    },

    deleteADeploymentFrequencySetting: (state, action) => {
      const deleteId = action.payload;
      state.deploymentFrequencySettings = [...state.deploymentFrequencySettings.filter(({ id }) => id !== deleteId)];
    },

    initDeploymentFrequencySettings: (state) => {
      state.deploymentFrequencySettings = initialState.deploymentFrequencySettings;
    },

    updateTreatFlagCardAsBlock: (state, action) => {
      state.treatFlagCardAsBlock = action.payload;
    },

    updateAssigneeFilter: (state, action) => {
      state.assigneeFilter = action.payload;
    },

    resetMetricData: () => initialState,

    updateAdvancedSettings: (state, action) => {
      state.importedData.importedAdvancedSettings = action.payload;
    },

    updateReworkTimesSettings: (state, action) => {
      state.importedData.reworkTimesSettings = action.payload;
    },

    updateFirstTimeRoadMetricsBoardData: (state, action) => {
      state.firstTimeRoadMetricData = action.payload;
    },
  },
});

export const {
  saveTargetFields,
  saveDoneColumn,
  saveUsers,
  savePipelineCrews,
  updateCycleTimeSettings,
  addADeploymentFrequencySetting,
  updateDeploymentFrequencySettings,
  deleteADeploymentFrequencySetting,
  updateMetricsImportedData,
  initDeploymentFrequencySettings,
  updateTreatFlagCardAsBlock,
  updateAssigneeFilter,
  updateMetricsState,
  updatePipelineSettings,
  updatePipelineStep,
  setCycleTimeSettingsType,
  resetMetricData,
  updateAdvancedSettings,
  updateShouldGetBoardConfig,
  updateShouldGetPipelineConfig,
  updateReworkTimesSettings,
  updateFirstTimeRoadMetricsBoardData,
} = metricsSlice.actions;

export const selectShouldGetBoardConfig = (state: RootState) => state.metrics.shouldGetBoardConfig;
export const selectShouldGetPipelineConfig = (state: RootState) => state.metrics.shouldGetPipeLineConfig;

export const selectDeploymentFrequencySettings = (state: RootState) => state.metrics.deploymentFrequencySettings;
export const selectReworkTimesSettings = (state: RootState) => state.metrics.importedData.reworkTimesSettings;

export const selectCycleTimeSettings = (state: RootState) => state.metrics.cycleTimeSettings;
export const selectMetricsContent = (state: RootState) => state.metrics;
export const selectAdvancedSettings = (state: RootState) => state.metrics.importedData.importedAdvancedSettings;
export const selectTreatFlagCardAsBlock = (state: RootState) => state.metrics.treatFlagCardAsBlock;
export const selectAssigneeFilter = (state: RootState) => state.metrics.assigneeFilter;
export const selectCycleTimeWarningMessage = (state: RootState) => state.metrics.cycleTimeWarningMessage;
export const selectClassificationWarningMessage = (state: RootState) => state.metrics.classificationWarningMessage;
export const selectRealDoneWarningMessage = (state: RootState) => state.metrics.realDoneWarningMessage;

export const selectOrganizationWarningMessage = (state: RootState, id: number) => {
  const { deploymentWarningMessage } = state.metrics;
  return deploymentWarningMessage.find((item) => item.id === id)?.organization;
};

export const selectPipelineNameWarningMessage = (state: RootState, id: number) => {
  const { deploymentWarningMessage } = state.metrics;
  return deploymentWarningMessage.find((item) => item.id === id)?.pipelineName;
};

export const selectStepWarningMessage = (state: RootState, id: number) => {
  const { deploymentWarningMessage } = state.metrics;
  return deploymentWarningMessage.find((item) => item.id === id)?.step;
};

export default metricsSlice.reducer;
