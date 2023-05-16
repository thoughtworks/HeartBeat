import saveMetricsSettingReducer, {
  saveBoardColumns,
  saveTargetFields,
  saveUsers,
  saveDoneColumn,
  updateDeploymentFrequencySettings,
  addADeploymentFrequencySetting,
  deleteADeploymentFrequencySetting,
  selectDeploymentFrequencySettings,
  addALeadTimeForChanges,
  deleteALeadTimeForChange,
  updateLeadTimeForChanges,
  initDeploymentFrequencySettings,
  initLeadTimeForChanges,
  updateTreatFlagCardAsBlock,
  updateClassification,
} from '@src/context/Metrics/metricsSlice'
import { store } from '@src/store'

const initState = {
  jiraColumns: [],
  targetFields: [],
  users: [],
  doneColumn: [],
  boardColumns: [],
  deploymentFrequencySettings: [{ id: 0, organization: '', pipelineName: '', step: '' }],
  leadTimeForChanges: [{ id: 0, organization: '', pipelineName: '', step: '' }],
  importFile: [],
  isProjectCreated: true,
  classification: [],
  treatFlagCardAsBlock: true,
}

describe('saveMetricsSetting reducer', () => {
  it('should show empty array when handle initial state', () => {
    const savedMetricsSetting = saveMetricsSettingReducer(undefined, { type: 'unknown' })

    expect(savedMetricsSetting.users).toEqual([])
    expect(savedMetricsSetting.targetFields).toEqual([])
    expect(savedMetricsSetting.jiraColumns).toEqual([])
    expect(savedMetricsSetting.doneColumn).toEqual([])
    expect(savedMetricsSetting.boardColumns).toEqual([])
    expect(savedMetricsSetting.deploymentFrequencySettings).toEqual([
      { id: 0, organization: '', pipelineName: '', step: '' },
    ])
    expect(savedMetricsSetting.leadTimeForChanges).toEqual([{ id: 0, organization: '', pipelineName: '', step: '' }])
    expect(savedMetricsSetting.treatFlagCardAsBlock).toBe(true)
  })

  it('should store updated targetFields when its value changed', () => {
    const mockUpdatedTargetFields = {
      targetFields: [
        { key: 'issuetype', name: 'Issue Type', flag: true },
        { key: 'parent', name: 'Parent', flag: false },
        { key: 'customfield_10020', name: 'Sprint', flag: false },
      ],
    }
    const savedMetricsSetting = saveMetricsSettingReducer(
      initState,
      saveTargetFields({
        targetFields: mockUpdatedTargetFields.targetFields,
      })
    )

    expect(savedMetricsSetting.targetFields).toEqual(mockUpdatedTargetFields)
    expect(savedMetricsSetting.users).toEqual([])
    expect(savedMetricsSetting.jiraColumns).toEqual([])
  })

  it('should store updated doneColumn when its value changed', () => {
    const mockUpdatedDoneColumn = {
      doneColumn: ['DONE', 'CANCELLED'],
    }
    const savedMetricsSetting = saveMetricsSettingReducer(
      initState,
      saveDoneColumn({
        doneColumn: mockUpdatedDoneColumn.doneColumn,
      })
    )

    expect(savedMetricsSetting.doneColumn).toEqual(mockUpdatedDoneColumn)
  })

  it('should store updated users when its value changed', () => {
    const mockUpdatedUsers = {
      users: ['userOne', 'userTwo', 'userThree'],
    }
    const savedMetricsSetting = saveMetricsSettingReducer(
      initState,
      saveUsers({
        users: mockUpdatedUsers.users,
      })
    )

    expect(savedMetricsSetting.users).toEqual(mockUpdatedUsers)
  })

  it('should store saved boardColumns when its value changed', () => {
    const mockSavedBoardColumns = {
      boardColumns: [{ name: 'TODO', value: 'To do' }],
    }
    const savedMetricsSetting = saveMetricsSettingReducer(
      initState,
      saveBoardColumns({
        boardColumns: mockSavedBoardColumns.boardColumns,
      })
    )

    expect(savedMetricsSetting.boardColumns).toEqual(mockSavedBoardColumns)
  })

  it('should update classification settings when its value changed given initial state', () => {
    const mockClassification = ['classification1', 'classification2']
    const savedMetricsSetting = saveMetricsSettingReducer(initState, updateClassification(mockClassification))

    expect(savedMetricsSetting.classification).toEqual(mockClassification)
  })

  it('should update deploymentFrequencySettings when handle updateDeploymentFrequencySettings given initial state', () => {
    const savedMetricsSetting = saveMetricsSettingReducer(
      initState,
      updateDeploymentFrequencySettings({ updateId: 0, label: 'Steps', value: 'step1' })
    )

    expect(savedMetricsSetting.deploymentFrequencySettings).toEqual([
      { id: 0, organization: '', pipelineName: '', step: 'step1' },
    ])
  })

  it('should update a deploymentFrequencySetting when handle updateDeploymentFrequencySettings given multiple deploymentFrequencySettings', () => {
    const multipleDeploymentFrequencySettingsInitState = {
      ...initState,
      deploymentFrequencySettings: [
        { id: 0, organization: '', pipelineName: '', step: '' },
        { id: 1, organization: '', pipelineName: '', step: '' },
      ],
    }
    const updatedDeploymentFrequencySettings = [
      { id: 0, organization: 'mock new organization', pipelineName: '', step: '' },
      { id: 1, organization: '', pipelineName: '', step: '' },
    ]
    const savedMetricsSetting = saveMetricsSettingReducer(
      multipleDeploymentFrequencySettingsInitState,
      updateDeploymentFrequencySettings({ updateId: 0, label: 'organization', value: 'mock new organization' })
    )

    expect(savedMetricsSetting.deploymentFrequencySettings).toEqual(updatedDeploymentFrequencySettings)
  })

  it('should add a deploymentFrequencySetting when handle addADeploymentFrequencySettings given initial state', () => {
    const addedDeploymentFrequencySettings = [
      { id: 0, organization: '', pipelineName: '', step: '' },
      { id: 1, organization: '', pipelineName: '', step: '' },
    ]

    const savedMetricsSetting = saveMetricsSettingReducer(initState, addADeploymentFrequencySetting())

    expect(savedMetricsSetting.deploymentFrequencySettings).toEqual(addedDeploymentFrequencySettings)
  })

  it('should delete a deploymentFrequencySetting when handle deleteADeploymentFrequencySettings given initial state', () => {
    const savedMetricsSetting = saveMetricsSettingReducer(initState, deleteADeploymentFrequencySetting(0))

    expect(savedMetricsSetting.deploymentFrequencySettings).toEqual([])
  })

  it('should return deploymentFrequencySettings when call selectDeploymentFrequencySettings functions', () => {
    expect(selectDeploymentFrequencySettings(store.getState())).toEqual(initState.deploymentFrequencySettings)
  })

  it('should init deploymentFrequencySettings when handle initDeploymentFrequencySettings given multiple deploymentFrequencySettings', () => {
    const multipleDeploymentFrequencySettingsInitState = {
      ...initState,
      deploymentFrequencySettings: [
        { id: 0, organization: 'mockOrgName1', pipelineName: 'mockName1', step: 'step1' },
        { id: 1, organization: 'mockOrgName2', pipelineName: 'mockName2', step: 'step2' },
      ],
    }

    const savedMetricsSetting = saveMetricsSettingReducer(
      multipleDeploymentFrequencySettingsInitState,
      initDeploymentFrequencySettings()
    )

    expect(savedMetricsSetting.deploymentFrequencySettings).toEqual(initState.deploymentFrequencySettings)
  })

  it('should add a leadTimeForChange when handle leadTimeForChanges given initial state', () => {
    const addedLeadTimeForChanges = [
      { id: 0, organization: '', pipelineName: '', step: '' },
      { id: 1, organization: '', pipelineName: '', step: '' },
    ]

    const savedMetricsSetting = saveMetricsSettingReducer(initState, addALeadTimeForChanges())

    expect(savedMetricsSetting.leadTimeForChanges).toEqual(addedLeadTimeForChanges)
  })

  it('should delete a leadTimeForChange when handle deleteALeadTimeForChange given initial state', async () => {
    const savedMetricsSetting = saveMetricsSettingReducer(initState, deleteALeadTimeForChange(0))

    expect(savedMetricsSetting.leadTimeForChanges).toEqual([])
  })

  it('should update a leadTimeForChange when handle updateLeadTimeForChanges given multiple leadTimeForChanges', () => {
    const multipleLeadTimeForChangesInitState = {
      ...initState,
      leadTimeForChanges: [
        { id: 0, organization: '', pipelineName: '', step: '' },
        { id: 1, organization: '', pipelineName: '', step: '' },
      ],
    }
    const updatedLeadTimeForChanges = [
      { id: 0, organization: '', pipelineName: '', step: 'step1' },
      { id: 1, organization: '', pipelineName: '', step: '' },
    ]
    const savedMetricsSetting = saveMetricsSettingReducer(
      multipleLeadTimeForChangesInitState,
      updateLeadTimeForChanges({ updateId: 0, label: 'Steps', value: 'step1' })
    )

    expect(savedMetricsSetting.leadTimeForChanges).toEqual(updatedLeadTimeForChanges)
  })

  it('should init leadTimeForChanges when handle initLeadTimeForChanges given multiple leadTimeForChanges', () => {
    const multipleLeadTimeForChangesInitState = {
      ...initState,
      leadTimeForChanges: [
        { id: 0, organization: 'mockOrgName1', pipelineName: 'mockName1', step: 'step1' },
        { id: 1, organization: 'mockOrgName2', pipelineName: 'mockName2', step: 'step2' },
      ],
    }

    const savedMetricsSetting = saveMetricsSettingReducer(multipleLeadTimeForChangesInitState, initLeadTimeForChanges())

    expect(savedMetricsSetting.leadTimeForChanges).toEqual(initState.leadTimeForChanges)
  })

  it('should return false when update TreatFlagCardAsBlock value  given false', () => {
    const savedMetricsSetting = saveMetricsSettingReducer(initState, updateTreatFlagCardAsBlock(false))

    expect(savedMetricsSetting.treatFlagCardAsBlock).toBe(false)
  })
})
