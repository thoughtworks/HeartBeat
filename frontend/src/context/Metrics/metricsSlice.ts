/* istanbul ignore file */
import { ASSIGNEE_FILTER_TYPES, CYCLE_TIME_LIST, MESSAGE, METRICS_CONSTANTS } from '@src/constants/resources';
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

export interface IPipelineWarningMessageConfig {
  id: number | null;
  organization: string | null;
  pipelineName: string | null;
  step: string | null;
}

export interface ICycleTimeSetting {
  name: string;
  value: string;
}
export interface IJiraColumnsWithValue {
  name: string;
  statuses: string[];
}

export interface savedMetricsSettingState {
  jiraColumns: { key: string; value: { name: string; statuses: string[] } }[];
  targetFields: { name: string; key: string; flag: boolean }[];
  users: string[];
  pipelineCrews: string[];
  doneColumn: string[];
  cycleTimeSettings: ICycleTimeSetting[];
  deploymentFrequencySettings: IPipelineConfig[];
  leadTimeForChanges: IPipelineConfig[];
  treatFlagCardAsBlock: boolean;
  assigneeFilter: string;
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
  };
  cycleTimeWarningMessage: string | null;
  classificationWarningMessage: string | null;
  realDoneWarningMessage: string | null;
  deploymentWarningMessage: IPipelineWarningMessageConfig[];
}

const initialState: savedMetricsSettingState = {
  jiraColumns: [],
  targetFields: [],
  users: [],
  pipelineCrews: [],
  doneColumn: [],
  cycleTimeSettings: [],
  deploymentFrequencySettings: [{ id: 0, organization: '', pipelineName: '', step: '', branches: [] }],
  leadTimeForChanges: [{ id: 0, organization: '', pipelineName: '', step: '', branches: [] }],
  treatFlagCardAsBlock: true,
  assigneeFilter: ASSIGNEE_FILTER_TYPES.LAST_ASSIGNEE,
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
  },
  cycleTimeWarningMessage: null,
  classificationWarningMessage: null,
  realDoneWarningMessage: null,
  deploymentWarningMessage: [],
};

const compareArrays = (arrayA: string[], arrayB: string[]): string | null => {
  if (arrayA?.length > arrayB?.length) {
    const differentValues = arrayA?.filter((value) => !arrayB.includes(value));
    return `The column of ${differentValues} is a deleted column, which means this column existed the time you saved config, but was deleted. Please confirm!`;
  } else {
    const differentValues = arrayB?.filter((value) => !arrayA.includes(value));
    return differentValues?.length > 0
      ? `The column of ${differentValues} is a new column. Please select a value for it!`
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

const setSelectUsers = (users: string[], importedCrews: string[]) =>
  users.filter((item: string) => importedCrews?.includes(item));

const setPipelineCrews = (pipelineCrews: string[], importedPipelineCrews: string[]) => {
  if (_.isEmpty(pipelineCrews)) {
    return [];
  }
  return pipelineCrews.filter((item: string) => importedPipelineCrews?.includes(item));
};

const setSelectTargetFields = (
  targetFields: { name: string; key: string; flag: boolean }[],
  importedClassification: string[],
) =>
  targetFields.map((item: { name: string; key: string; flag: boolean }) => ({
    ...item,
    flag: importedClassification?.includes(item.key),
  }));

const setCycleTimeSettings = (
  jiraColumns: { key: string; value: { name: string; statuses: string[] } }[],
  importedCycleTimeSettings: { [key: string]: string }[],
) => {
  return jiraColumns?.map((item: { key: string; value: { name: string; statuses: string[] } }) => {
    const controlName = item.value.name;
    let defaultOptionValue = METRICS_CONSTANTS.cycleTimeEmptyStr;
    const validImportValue = importedCycleTimeSettings?.find((i) => Object.keys(i)[0] === controlName);
    if (validImportValue && CYCLE_TIME_LIST.includes(Object.values(validImportValue)[0])) {
      defaultOptionValue = Object.values(validImportValue)[0];
    }
    return { name: controlName, value: defaultOptionValue };
  });
};

const setSelectDoneColumns = (
  jiraColumns: { key: string; value: { name: string; statuses: string[] } }[],
  cycleTimeSettings: { name: string; value: string }[],
  importedDoneStatus: string[],
) => {
  const doneStatus =
    jiraColumns?.find((item) => item.key === METRICS_CONSTANTS.doneKeyFromBackend)?.value.statuses ?? [];
  const selectedDoneColumns = cycleTimeSettings
    ?.filter(({ value }) => value === METRICS_CONSTANTS.doneValue)
    .map(({ name }) => name);
  const filteredStatus = jiraColumns
    ?.filter(({ value }) => selectedDoneColumns.includes(value.name))
    .flatMap(({ value }) => value.statuses);
  const status = selectedDoneColumns?.length < 1 ? doneStatus : filteredStatus;
  return status.filter((item: string) => importedDoneStatus?.includes(item));
};

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
    saveCycleTimeSettings: (state, action) => {
      state.cycleTimeSettings = action.payload;
    },
    addADeploymentFrequencySetting: (state) => {
      const newId =
        state.deploymentFrequencySettings.length >= 1
          ? state.deploymentFrequencySettings[state.deploymentFrequencySettings.length - 1].id + 1
          : 0;
      state.deploymentFrequencySettings = [
        ...state.deploymentFrequencySettings,
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

    updateMetricsImportedData: (state, action) => {
      const { crews, cycleTime, doneStatus, classification, deployment, leadTime, assigneeFilter, pipelineCrews } =
        action.payload;
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
    },

    updateMetricsState: (state, action) => {
      const { targetFields, users, jiraColumns, isProjectCreated, ignoredTargetFields } = action.payload;
      const { importedCrews, importedClassification, importedCycleTime, importedDoneStatus, importedAssigneeFilter } =
        state.importedData;
      state.users = isProjectCreated ? users : setSelectUsers(users, importedCrews);
      state.targetFields = isProjectCreated
        ? targetFields
        : setSelectTargetFields(targetFields, importedClassification);

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
        const metricsContainsValues = Object.values(METRICS_CONSTANTS);
        const importedKeyMismatchWarning = compareArrays(importedCycleTimeSettingsKeys, jiraColumnsNames);
        const importedValueMismatchWarning = findDifferentValues(
          importedCycleTimeSettingsValues,
          metricsContainsValues,
        );

        const getWarningMessage = (): string | null => {
          if (importedKeyMismatchWarning?.length) {
            return compareArrays(importedCycleTimeSettingsKeys, jiraColumnsNames);
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

      state.cycleTimeSettings = setCycleTimeSettings(jiraColumns, importedCycleTime.importedCycleTimeSettings);
      if (!isProjectCreated && !!importedDoneStatus.length) {
        setSelectDoneColumns(jiraColumns, state.cycleTimeSettings, importedDoneStatus).length <
        importedDoneStatus.length
          ? (state.realDoneWarningMessage = MESSAGE.REAL_DONE_WARNING)
          : (state.realDoneWarningMessage = null);
      }
      state.doneColumn = isProjectCreated
        ? []
        : setSelectDoneColumns(jiraColumns, state.cycleTimeSettings, importedDoneStatus);

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
      state.pipelineCrews = isProjectCreated ? pipelineCrews : setPipelineCrews(pipelineCrews, importedPipelineCrews);
      const orgNames: Array<string> = _.uniq(pipelineList.map((item: pipeline) => item.orgName));
      const filteredPipelineNames = (organization: string) =>
        pipelineList
          .filter((pipeline: pipeline) => pipeline.orgName.toLowerCase() === organization.toLowerCase())
          .map((item: pipeline) => item.name);
      const getValidPipelines = (pipelines: IPipelineConfig[]) =>
        !pipelines.length || isProjectCreated
          ? [{ id: 0, organization: '', pipelineName: '', step: '', branches: [] }]
          : pipelines.map(({ id, organization, pipelineName }) => ({
              id,
              organization: orgNames.find((i) => (i as string).toLowerCase() === organization.toLowerCase()) || '',
              pipelineName: filteredPipelineNames(organization).includes(pipelineName) ? pipelineName : '',
              step: '',
              branches: [],
            }));

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
        if (!pipelines.length || isProjectCreated) {
          return [];
        }
        return pipelines.map((pipeline) => createPipelineWarning(pipeline));
      };

      state.deploymentFrequencySettings = getValidPipelines(importedDeployment);
      state.deploymentWarningMessage = getPipelinesWarningMessage(importedDeployment);
    },

    updatePipelineStep: (state, action) => {
      const { steps, id, branches, pipelineCrews } = action.payload;
      const { importedDeployment, importedPipelineCrews } = state.importedData;
      const updatedImportedPipeline = importedDeployment;
      const updatedImportedPipelineStep = updatedImportedPipeline.find((pipeline) => pipeline.id === id)?.step ?? '';
      const updatedImportedPipelineBranches =
        updatedImportedPipeline.find((pipeline) => pipeline.id === id)?.branches ?? [];
      const validStep = steps.includes(updatedImportedPipelineStep) ? updatedImportedPipelineStep : '';
      const validBranches = _.filter(branches, (branch) => updatedImportedPipelineBranches.includes(branch));
      const validPipelineCrews = _.filter(pipelineCrews, (crew) => importedPipelineCrews.includes(crew));
      state.pipelineCrews = validPipelineCrews;
      const stepWarningMessage = steps.includes(updatedImportedPipelineStep) ? null : MESSAGE.STEP_WARNING;

      const getPipelineSettings = (pipelines: IPipelineConfig[]) =>
        pipelines.map((pipeline) =>
          pipeline.id === id
            ? {
                ...pipeline,
                step: validStep,
                branches: validBranches,
              }
            : pipeline,
        );

      const getStepWarningMessage = (pipelines: IPipelineWarningMessageConfig[]) => {
        return pipelines.map((pipeline) =>
          pipeline?.id === id
            ? {
                ...pipeline,
                step: stepWarningMessage,
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
  },
});

export const {
  saveTargetFields,
  saveDoneColumn,
  saveUsers,
  savePipelineCrews,
  saveCycleTimeSettings,
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
} = metricsSlice.actions;

export const selectDeploymentFrequencySettings = (state: RootState) => state.metrics.deploymentFrequencySettings;

export const selectCycleTimeSettings = (state: RootState) => state.metrics.cycleTimeSettings;
export const selectMetricsContent = (state: RootState) => state.metrics;
export const selectTreatFlagCardAsBlock = (state: RootState) => state.metrics.treatFlagCardAsBlock;
export const selectAssigneeFilter = (state: RootState) => state.metrics.assigneeFilter;
export const selectCycleTimeWarningMessage = (state: RootState) => state.metrics.cycleTimeWarningMessage;
export const selectClassificationWarningMessage = (state: RootState) => state.metrics.classificationWarningMessage;
export const selectRealDoneWarningMessage = (state: RootState) => state.metrics.realDoneWarningMessage;

export const selectOrganizationWarningMessage = (state: RootState, id: number) => {
  const { deploymentWarningMessage } = state.metrics;
  const warningMessage = deploymentWarningMessage;
  return warningMessage.find((item) => item.id === id)?.organization;
};

export const selectPipelineNameWarningMessage = (state: RootState, id: number) => {
  const { deploymentWarningMessage } = state.metrics;
  const warningMessage = deploymentWarningMessage;
  return warningMessage.find((item) => item.id === id)?.pipelineName;
};

export const selectStepWarningMessage = (state: RootState, id: number) => {
  const { deploymentWarningMessage } = state.metrics;
  const warningMessage = deploymentWarningMessage;
  return warningMessage.find((item) => item.id === id)?.step;
};

export default metricsSlice.reducer;
