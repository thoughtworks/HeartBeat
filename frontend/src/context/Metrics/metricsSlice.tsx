import { createSlice } from '@reduxjs/toolkit'
import camelCase from 'lodash.camelcase'
import { RootState } from '@src/store'
import { CLASSIFICATION_WARNING_MESSAGE, CYCLE_TIME_LIST, METRICS_CONSTANTS } from '@src/constants'

export interface IPipelineConfig {
  id: number
  organization: string
  pipelineName: string
  step: string
}

export interface savedMetricsSettingState {
  jiraColumns: { key: string; value: { name: string; statuses: string[] } }[]
  targetFields: { name: string; key: string; flag: boolean }[]
  users: string[]
  doneColumn: string[]
  cycleTimeSettings: { name: string; value: string }[]
  deploymentFrequencySettings: IPipelineConfig[]
  leadTimeForChanges: IPipelineConfig[]
  treatFlagCardAsBlock: boolean
  importedData: {
    importedCrews: string[]
    importedCycleTime: {
      importedCycleTimeSettings: { [key: string]: string }[]
      importedTreatFlagCardAsBlock: boolean
    }
    importedDoneStatus: string[]
    importedClassification: string[]
    importedDeployment: IPipelineConfig[]
    importedLeadTime: IPipelineConfig[]
  }
  cycleTimeWarningMessage: string | null
  classificationWarningMessage: string | null
}

const initialState: savedMetricsSettingState = {
  jiraColumns: [],
  targetFields: [],
  users: [],
  doneColumn: [],
  cycleTimeSettings: [],
  deploymentFrequencySettings: [{ id: 0, organization: '', pipelineName: '', step: '' }],
  leadTimeForChanges: [{ id: 0, organization: '', pipelineName: '', step: '' }],
  treatFlagCardAsBlock: true,
  importedData: {
    importedCrews: [],
    importedCycleTime: {
      importedCycleTimeSettings: [],
      importedTreatFlagCardAsBlock: true,
    },
    importedDoneStatus: [],
    importedClassification: [],
    importedDeployment: [],
    importedLeadTime: [],
  },
  cycleTimeWarningMessage: null,
  classificationWarningMessage: null,
}

const compareArrays = (arrayA: string[], arrayB: string[]): string | null => {
  if (arrayA?.length > arrayB?.length) {
    const differentValues = arrayA?.filter((value) => !arrayB.includes(value))
    return `The column of ${differentValues} is a deleted column, which means this column existed the time you saved config, but was deleted. Please confirm!`
  } else {
    const differentValues = arrayB?.filter((value) => !arrayA.includes(value))
    return differentValues?.length > 0
      ? `The column of ${differentValues} is a new column. Please select a value for it!`
      : null
  }
}
const findDifferentValues = (arrayA: string[], arrayB: string[]): string[] | null => {
  const diffInArrayA = arrayA?.filter((value) => !arrayB.includes(value))
  if (diffInArrayA?.length === 0) {
    return null
  } else {
    return diffInArrayA
  }
}
const findKeyByValues = (arrayA: { [key: string]: string }[], arrayB: string[]): string | null => {
  const matchingKeys: string[] = []

  for (const setting of arrayA) {
    const key = Object.keys(setting)[0]
    const value = setting[key]
    if (arrayB.includes(value)) {
      matchingKeys.push(key)
    }
  }
  return `The value of ${matchingKeys} in imported json is not in dropdown list now. Please select a value for it!`
}
export const metricsSlice = createSlice({
  name: 'metrics',
  initialState,
  reducers: {
    saveTargetFields: (state, action) => {
      state.targetFields = action.payload
    },
    saveDoneColumn: (state, action) => {
      state.doneColumn = action.payload
    },
    saveUsers: (state, action) => {
      state.users = action.payload
    },
    saveCycleTimeSettings: (state, action) => {
      state.cycleTimeSettings = action.payload
    },
    addADeploymentFrequencySetting: (state) => {
      const newId = state.deploymentFrequencySettings[state.deploymentFrequencySettings.length - 1].id + 1
      state.deploymentFrequencySettings = [
        ...state.deploymentFrequencySettings,
        { id: newId, organization: '', pipelineName: '', step: '' },
      ]
    },

    updateDeploymentFrequencySettings: (state, action) => {
      const { updateId, label, value } = action.payload

      state.deploymentFrequencySettings = state.deploymentFrequencySettings.map((deploymentFrequencySetting) => {
        return deploymentFrequencySetting.id === updateId
          ? {
              ...deploymentFrequencySetting,
              [label === 'Steps' ? 'step' : camelCase(label)]: value,
            }
          : deploymentFrequencySetting
      })
    },

    updateMetricsImportedData: (state, action) => {
      const { crews, cycleTime, doneStatus, classification, deployment, leadTime } = action.payload
      state.importedData.importedCrews = crews
      state.importedData.importedCycleTime.importedCycleTimeSettings = cycleTime?.jiraColumns
      state.importedData.importedCycleTime.importedTreatFlagCardAsBlock = cycleTime?.treatFlagCardAsBlock
      state.importedData.importedDoneStatus = doneStatus
      state.importedData.importedClassification = classification
      state.importedData.importedDeployment = deployment
      state.importedData.importedLeadTime = leadTime
    },

    updateMetricsState: (state, action) => {
      const { targetFields, users, jiraColumns, isProjectCreated } = action.payload
      const { importedCrews, importedClassification, importedCycleTime } = state.importedData
      state.users = isProjectCreated ? users : users?.filter((item: string) => importedCrews?.includes(item))
      state.targetFields = isProjectCreated
        ? targetFields
        : targetFields?.map((item: { name: string; key: string; flag: boolean }) => ({
            ...item,
            flag: importedClassification?.includes(item.key),
          }))
      //cycleTime warningMessage
      const importedCycleTimeSettingsKeys = importedCycleTime.importedCycleTimeSettings?.flatMap((obj) =>
        Object.keys(obj)
      )
      const importedCycleTimeSettingsValues = importedCycleTime.importedCycleTimeSettings?.flatMap((obj) =>
        Object.values(obj)
      )
      const jiraColumnsNames = jiraColumns?.map(
        (obj: { key: string; value: { name: string; statuses: string[] } }) => obj.value.name
      )
      const metricsContainsValues = Object.values(METRICS_CONSTANTS)

      const importedKeyMismatchWarning = compareArrays(importedCycleTimeSettingsKeys, jiraColumnsNames)
      const importedValueMismatchWarning = findDifferentValues(importedCycleTimeSettingsValues, metricsContainsValues)

      const getWarningMessage = (): string | null => {
        if (importedKeyMismatchWarning?.length) {
          return compareArrays(importedCycleTimeSettingsKeys, jiraColumnsNames)
        }
        if (importedValueMismatchWarning?.length) {
          return findKeyByValues(importedCycleTime.importedCycleTimeSettings, importedValueMismatchWarning)
        }
        return null
      }
      state.cycleTimeWarningMessage = getWarningMessage()

      //classification warningMessage
      const keyArray = targetFields?.map((field: { key: string; name: string; flag: boolean }) => field.key)

      if (importedClassification?.every((item) => keyArray.includes(item))) {
        state.classificationWarningMessage = null
      } else {
        state.classificationWarningMessage = CLASSIFICATION_WARNING_MESSAGE
      }

      state.cycleTimeSettings = jiraColumns?.map(
        (item: { key: string; value: { name: string; statuses: string[] } }) => {
          const controlName = item.value.name
          let defaultOptionValue = METRICS_CONSTANTS.cycleTimeEmptyStr
          const validImportValue = importedCycleTime.importedCycleTimeSettings?.find(
            (i) => Object.keys(i)[0] === controlName
          )
          if (validImportValue && CYCLE_TIME_LIST.includes(Object.values(validImportValue)[0])) {
            defaultOptionValue = Object.values(validImportValue)[0]
          }
          return { name: controlName, value: defaultOptionValue }
        }
      )
    },

    deleteADeploymentFrequencySetting: (state, action) => {
      const deleteId = action.payload
      state.deploymentFrequencySettings = [...state.deploymentFrequencySettings.filter(({ id }) => id !== deleteId)]
    },

    initDeploymentFrequencySettings: (state) => {
      state.deploymentFrequencySettings = initialState.deploymentFrequencySettings
    },

    addALeadTimeForChanges: (state) => {
      const newId = state.leadTimeForChanges[state.leadTimeForChanges.length - 1].id + 1
      state.leadTimeForChanges = [
        ...state.leadTimeForChanges,
        { id: newId, organization: '', pipelineName: '', step: '' },
      ]
    },

    updateLeadTimeForChanges: (state, action) => {
      const { updateId, label, value } = action.payload

      state.leadTimeForChanges = state.leadTimeForChanges.map((leadTimeForChange) => {
        return leadTimeForChange.id === updateId
          ? {
              ...leadTimeForChange,
              [label === 'Steps' ? 'step' : camelCase(label)]: value,
            }
          : leadTimeForChange
      })
    },

    deleteALeadTimeForChange: (state, action) => {
      const deleteId = action.payload
      state.leadTimeForChanges = [...state.leadTimeForChanges.filter(({ id }) => id !== deleteId)]
    },

    initLeadTimeForChanges: (state) => {
      state.leadTimeForChanges = initialState.leadTimeForChanges
    },

    updateTreatFlagCardAsBlock: (state, action) => {
      state.treatFlagCardAsBlock = action.payload
    },
  },
})

export const {
  saveTargetFields,
  saveDoneColumn,
  saveUsers,
  saveCycleTimeSettings,
  addADeploymentFrequencySetting,
  updateDeploymentFrequencySettings,
  deleteADeploymentFrequencySetting,
  updateMetricsImportedData,
  addALeadTimeForChanges,
  updateLeadTimeForChanges,
  deleteALeadTimeForChange,
  initDeploymentFrequencySettings,
  initLeadTimeForChanges,
  updateTreatFlagCardAsBlock,
  updateMetricsState,
} = metricsSlice.actions

export const selectDeploymentFrequencySettings = (state: RootState) => state.metrics.deploymentFrequencySettings
export const selectLeadTimeForChanges = (state: RootState) => state.metrics.leadTimeForChanges

export const selectCycleTimeSettings = (state: RootState) => state.metrics.cycleTimeSettings
export const selectMetricsContent = (state: RootState) => state.metrics
export const selectTreatFlagCardAsBlock = (state: RootState) => state.metrics.treatFlagCardAsBlock
export const selectCycleTimeWarningMessage = (state: RootState) => state.metrics.cycleTimeWarningMessage
export const selectClassificationWarningMessage = (state: RootState) => state.metrics.classificationWarningMessage

export default metricsSlice.reducer
