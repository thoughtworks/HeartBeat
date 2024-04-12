import saveMetricsSettingReducer, {
  addADeploymentFrequencySetting,
  deleteADeploymentFrequencySetting,
  initDeploymentFrequencySettings,
  resetMetricData,
  saveDoneColumn,
  savePipelineCrews,
  saveTargetFields,
  saveUsers,
  selectAdvancedSettings,
  selectAssigneeFilter,
  selectClassificationWarningMessage,
  selectCycleTimeSettings,
  selectCycleTimeWarningMessage,
  selectDeploymentFrequencySettings,
  selectMetricsContent,
  selectOrganizationWarningMessage,
  selectPipelineNameWarningMessage,
  selectRealDoneWarningMessage,
  selectReworkTimesSettings,
  selectShouldGetBoardConfig,
  selectShouldGetPipelineConfig,
  selectStepWarningMessage,
  selectTreatFlagCardAsBlock,
  setCycleTimeSettingsType,
  updateAdvancedSettings,
  updateAssigneeFilter,
  updateCycleTimeSettings,
  updateDeploymentFrequencySettings,
  updateMetricsImportedData,
  updateMetricsState,
  updatePipelineSettings,
  updatePipelineStep,
  updateReworkTimesSettings,
  updateShouldGetBoardConfig,
  updateShouldGetPipelineConfig,
  updateTreatFlagCardAsBlock,
} from '@src/context/Metrics/metricsSlice';
import {
  CLASSIFICATION_WARNING_MESSAGE,
  DEFAULT_REWORK_SETTINGS,
  NO_RESULT_DASH,
  PIPELINE_SETTING_TYPES,
} from '../fixtures';
import { ASSIGNEE_FILTER_TYPES, CYCLE_TIME_SETTINGS_TYPES, MESSAGE } from '@src/constants/resources';
import { setupStore } from '../utils/setupStoreUtil';
import { store } from '@src/store';

const initState = {
  shouldGetBoardConfig: true,
  shouldGetPipeLineConfig: true,
  jiraColumns: [],
  targetFields: [],
  users: [],
  pipelineCrews: [],
  doneColumn: [],
  cycleTimeSettingsType: CYCLE_TIME_SETTINGS_TYPES.BY_COLUMN,
  cycleTimeSettings: [],
  deploymentFrequencySettings: [],
  leadTimeForChanges: [{ id: 0, organization: '', pipelineName: '', step: '', branches: [] }],
  classification: [],
  treatFlagCardAsBlock: true,
  assigneeFilter: ASSIGNEE_FILTER_TYPES.LAST_ASSIGNEE,
  displayFlagCardDropWarning: true,
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
    importedLeadTime: [],
    importedAdvancedSettings: null,
    reworkTimesSettings: DEFAULT_REWORK_SETTINGS,
  },
  cycleTimeWarningMessage: null,
  classificationWarningMessage: null,
  realDoneWarningMessage: null,
  deploymentWarningMessage: [],
  leadTimeWarningMessage: [],
  firstTimeRoadMetricData: true,
};

const mockJiraResponse = {
  targetFields: [{ key: 'issuetype', name: 'Issue Type', flag: false }],
  ignoredTargetFields: [{ key: 'issuecolor', name: 'Issue Color', flag: false }],
  users: ['User A', 'User B'],
  jiraColumns: [
    {
      key: 'indeterminate',
      value: {
        name: 'Done',
        statuses: ['DONE', 'CLOSED'],
      },
    },
    {
      key: 'indeterminate',
      value: {
        name: 'Doing',
        statuses: ['ANALYSIS'],
      },
    },
    {
      key: 'indeterminate',
      value: {
        name: 'Testing',
        statuses: ['TESTING'],
      },
    },
  ],
};

describe('saveMetricsSetting reducer', () => {
  it('should show empty array when handle initial state', () => {
    const savedMetricsSetting = saveMetricsSettingReducer(undefined, { type: 'unknown' });

    expect(savedMetricsSetting.users).toEqual([]);
    expect(savedMetricsSetting.targetFields).toEqual([]);
    expect(savedMetricsSetting.jiraColumns).toEqual([]);
    expect(savedMetricsSetting.doneColumn).toEqual([]);
    expect(savedMetricsSetting.cycleTimeSettings).toEqual([]);
    expect(savedMetricsSetting.deploymentFrequencySettings).toEqual([]);
    expect(savedMetricsSetting.treatFlagCardAsBlock).toBe(true);
    expect(savedMetricsSetting.assigneeFilter).toBe(ASSIGNEE_FILTER_TYPES.LAST_ASSIGNEE);
    expect(savedMetricsSetting.importedData).toEqual({
      importedCrews: [],
      importedAssigneeFilter: ASSIGNEE_FILTER_TYPES.LAST_ASSIGNEE,
      importedCycleTime: {
        importedCycleTimeSettings: [],
        importedTreatFlagCardAsBlock: true,
      },
      importedDoneStatus: [],
      importedClassification: [],
      importedDeployment: [],
      importedPipelineCrews: [],
      importedAdvancedSettings: null,
      reworkTimesSettings: DEFAULT_REWORK_SETTINGS,
    });
  });

  it('should store updated targetFields when its value changed', () => {
    const mockUpdatedTargetFields = {
      targetFields: [
        { key: 'issuetype', name: 'Issue Type', flag: true },
        { key: 'parent', name: 'Parent', flag: false },
        { key: 'customfield_10020', name: 'Sprint', flag: false },
      ],
    };
    const savedMetricsSetting = saveMetricsSettingReducer(
      initState,
      saveTargetFields({
        targetFields: mockUpdatedTargetFields.targetFields,
      }),
    );

    expect(savedMetricsSetting.targetFields).toEqual(mockUpdatedTargetFields);
    expect(savedMetricsSetting.users).toEqual([]);
    expect(savedMetricsSetting.jiraColumns).toEqual([]);
  });

  it('should store updated doneColumn when its value changed', () => {
    const mockUpdatedDoneColumn = {
      doneColumn: ['DONE', 'CANCELLED'],
    };
    const savedMetricsSetting = saveMetricsSettingReducer(
      initState,
      saveDoneColumn({
        doneColumn: mockUpdatedDoneColumn.doneColumn,
      }),
    );

    expect(savedMetricsSetting.doneColumn).toEqual(mockUpdatedDoneColumn);
  });

  it('should store updated users when its value changed', () => {
    const mockUpdatedUsers = {
      users: ['userOne', 'userTwo', 'userThree'],
    };
    const savedMetricsSetting = saveMetricsSettingReducer(
      initState,
      saveUsers({
        users: mockUpdatedUsers.users,
      }),
    );

    expect(savedMetricsSetting.users).toEqual(mockUpdatedUsers);
  });

  it('should store saved cycleTimeSettings when its value changed', () => {
    const mockSavedCycleTimeSettings = {
      cycleTimeSettings: [{ name: 'TODO', value: 'To do' }],
    };
    const savedMetricsSetting = saveMetricsSettingReducer(
      initState,
      updateCycleTimeSettings({
        cycleTimeSettings: mockSavedCycleTimeSettings.cycleTimeSettings,
      }),
    );

    expect(savedMetricsSetting.cycleTimeSettings).toEqual(mockSavedCycleTimeSettings);
  });

  it('should update metricsImportedData when its value changed given initial state', () => {
    const mockMetricsImportedData = {
      crews: ['mockUser'],
      assigneeFilter: ASSIGNEE_FILTER_TYPES.HISTORICAL_ASSIGNEE,
      cycleTime: {
        jiraColumns: ['mockCycleTimeSettings'],
        treatFlagCardAsBlock: true,
      },
      doneStatus: ['mockDoneStatus'],
      classification: ['mockClassification'],
      deployment: [{ id: 0, organization: 'organization', pipelineName: 'pipelineName', step: 'step' }],
      leadTime: [],
      pipelineCrews: [],
      advancedSettings: {
        storyPoint: '1',
        flag: '2',
      },
      reworkTimesSettings: DEFAULT_REWORK_SETTINGS,
    };
    const savedMetricsSetting = saveMetricsSettingReducer(
      initState,
      updateMetricsImportedData(mockMetricsImportedData),
    );

    expect(savedMetricsSetting.importedData).toEqual({
      importedCrews: mockMetricsImportedData.crews,
      importedAssigneeFilter: ASSIGNEE_FILTER_TYPES.HISTORICAL_ASSIGNEE,
      importedPipelineCrews: mockMetricsImportedData.pipelineCrews,
      importedCycleTime: {
        importedCycleTimeSettings: mockMetricsImportedData.cycleTime.jiraColumns,
        importedTreatFlagCardAsBlock: mockMetricsImportedData.cycleTime.treatFlagCardAsBlock,
      },
      importedDoneStatus: mockMetricsImportedData.doneStatus,
      importedClassification: mockMetricsImportedData.classification,
      importedDeployment: mockMetricsImportedData.deployment,
      importedLeadTime: mockMetricsImportedData.leadTime,
      importedAdvancedSettings: mockMetricsImportedData.advancedSettings,
      reworkTimesSettings: mockMetricsImportedData.reworkTimesSettings,
    });
  });

  it('should not update metricsImportedData when imported data is broken given initial state', () => {
    const mockMetricsImportedData = {
      crews: null,
      cycleTime: {
        jiraColumns: null,
        treatFlagCardAsBlock: null,
      },
      doneStatus: null,
      classification: null,
      deployment: null,
      leadTime: null,
    };

    const savedMetricsSetting = saveMetricsSettingReducer(
      initState,
      updateMetricsImportedData(mockMetricsImportedData),
    );

    expect(savedMetricsSetting.users).toEqual([]);
    expect(savedMetricsSetting.targetFields).toEqual([]);
    expect(savedMetricsSetting.jiraColumns).toEqual([]);
    expect(savedMetricsSetting.doneColumn).toEqual([]);
    expect(savedMetricsSetting.cycleTimeSettings).toEqual([]);
    expect(savedMetricsSetting.treatFlagCardAsBlock).toEqual(true);
    expect(savedMetricsSetting.deploymentFrequencySettings).toEqual([]);
  });

  it('should update metricsState when its value changed given isProjectCreated is false and selectedDoneColumns', () => {
    const mockUpdateMetricsStateArguments = {
      ...mockJiraResponse,
      isProjectCreated: false,
    };
    const savedMetricsSetting = saveMetricsSettingReducer(
      {
        ...initState,
        importedData: {
          ...initState.importedData,
          importedCrews: ['User B', 'User C'],
          importedClassification: ['issuetype'],
          importedCycleTime: {
            importedCycleTimeSettings: [{ Done: 'Done' }, { Testing: 'mockOption' }],
            importedTreatFlagCardAsBlock: true,
          },
          importedDoneStatus: ['DONE'],
        },
      },
      updateMetricsState(mockUpdateMetricsStateArguments),
    );

    expect(savedMetricsSetting.targetFields).toEqual([{ key: 'issuetype', name: 'Issue Type', flag: true }]);
    expect(savedMetricsSetting.users).toEqual(['User B']);
    expect(savedMetricsSetting.cycleTimeSettings).toEqual([
      { column: 'Done', status: 'DONE', value: 'Done' },
      { column: 'Done', status: 'CLOSED', value: 'Done' },
      { column: 'Doing', status: 'ANALYSIS', value: NO_RESULT_DASH },
      { column: 'Testing', status: 'TESTING', value: NO_RESULT_DASH },
    ]);
    expect(savedMetricsSetting.doneColumn).toEqual(['DONE']);
  });

  it('should not be able to show conflict warning and check the flag card as block', () => {
    const mockUpdateMetricsStateArguments = {
      ...mockJiraResponse,
      isProjectCreated: true,
    };
    const savedMetricsSetting = saveMetricsSettingReducer(
      {
        ...initState,
        cycleTimeSettingsType: CYCLE_TIME_SETTINGS_TYPES.BY_STATUS,
        importedData: {
          ...initState.importedData,
          importedCrews: ['User B', 'User C'],
          importedClassification: ['issuetype'],
          importedCycleTime: {
            importedCycleTimeSettings: [{ DOING: 'Doing' }, { TESTING: 'Testing' }, { DONE: 'Done' }],
            importedTreatFlagCardAsBlock: false,
          },
          importedDoneStatus: ['DONE'],
        },
      },
      updateMetricsState(mockUpdateMetricsStateArguments),
    );
    expect(savedMetricsSetting.displayFlagCardDropWarning).toEqual(false);
    expect(savedMetricsSetting.treatFlagCardAsBlock).toEqual(true);
  });

  it('should update metricsState given cycleTimeSettingsType is by status', () => {
    const mockUpdateMetricsStateArguments = {
      ...mockJiraResponse,
      isProjectCreated: false,
    };
    const savedMetricsSetting = saveMetricsSettingReducer(
      {
        ...initState,
        cycleTimeSettingsType: CYCLE_TIME_SETTINGS_TYPES.BY_STATUS,
        importedData: {
          ...initState.importedData,
          importedCrews: ['User B', 'User C'],
          importedClassification: ['issuetype'],
          importedCycleTime: {
            importedCycleTimeSettings: [{ DOING: 'Doing' }, { TESTING: 'Testing' }, { DONE: 'Done' }],
            importedTreatFlagCardAsBlock: true,
          },
          importedDoneStatus: ['DONE'],
        },
      },
      updateMetricsState(mockUpdateMetricsStateArguments),
    );

    expect(savedMetricsSetting.targetFields).toEqual([{ key: 'issuetype', name: 'Issue Type', flag: true }]);
    expect(savedMetricsSetting.users).toEqual(['User B']);
    expect(savedMetricsSetting.cycleTimeSettings).toEqual([
      { column: 'Done', status: 'DONE', value: 'Done' },
      { column: 'Done', status: 'CLOSED', value: NO_RESULT_DASH },
      { column: 'Doing', status: 'ANALYSIS', value: NO_RESULT_DASH },
      { column: 'Testing', status: 'TESTING', value: 'Testing' },
    ]);
    expect(savedMetricsSetting.doneColumn).toEqual(['DONE']);
    expect(savedMetricsSetting.displayFlagCardDropWarning).toEqual(true);
  });

  it('should update metricsState given its value changed given isProjectCreated is false and selectedDoneColumns and cycleTimeSettingsType is byStatus', () => {
    const mockUpdateMetricsStateArguments = {
      ...mockJiraResponse,
      isProjectCreated: false,
    };
    const savedMetricsSetting = saveMetricsSettingReducer(
      {
        ...initState,
        cycleTimeSettingsType: CYCLE_TIME_SETTINGS_TYPES.BY_STATUS,
        importedData: {
          ...initState.importedData,
          importedCrews: ['User B', 'User C'],
          importedClassification: ['issuetype'],
          importedCycleTime: {
            importedCycleTimeSettings: [{ Done: 'Done' }, { Testing: 'mockOption' }],
            importedTreatFlagCardAsBlock: true,
          },
          importedDoneStatus: ['DONE'],
        },
      },
      updateMetricsState(mockUpdateMetricsStateArguments),
    );

    expect(savedMetricsSetting.targetFields).toEqual([{ key: 'issuetype', name: 'Issue Type', flag: true }]);
    expect(savedMetricsSetting.users).toEqual(['User B']);
    expect(savedMetricsSetting.cycleTimeSettings).toEqual([
      { column: 'Done', status: 'DONE', value: NO_RESULT_DASH },
      { column: 'Done', status: 'CLOSED', value: NO_RESULT_DASH },
      { column: 'Doing', status: 'ANALYSIS', value: NO_RESULT_DASH },
      { column: 'Testing', status: 'TESTING', value: NO_RESULT_DASH },
    ]);
    expect(savedMetricsSetting.doneColumn).toEqual([]);
  });

  it('should update metricsState when its value changed given isProjectCreated is false and no selectedDoneColumns', () => {
    const mockUpdateMetricsStateArguments = {
      ...mockJiraResponse,
      isProjectCreated: false,
    };

    const savedMetricsSetting = saveMetricsSettingReducer(
      {
        ...initState,
        importedData: {
          ...initState.importedData,
          importedCycleTime: {
            importedCycleTimeSettings: [{ Done: 'Review' }, { Testing: 'mockOption' }],
            importedTreatFlagCardAsBlock: true,
          },
          importedDoneStatus: ['DONE'],
        },
      },
      updateMetricsState(mockUpdateMetricsStateArguments),
    );

    expect(savedMetricsSetting.doneColumn).toEqual([]);
  });

  it('should update metricsState given importedCycleTime.importedTreatFlagCardAsBlock is string true', () => {
    const mockUpdateMetricsStateArguments = {
      ...mockJiraResponse,
      isProjectCreated: false,
    };

    const savedMetricsSetting = saveMetricsSettingReducer(
      {
        ...initState,
        importedData: {
          ...initState.importedData,
          importedCycleTime: {
            importedCycleTimeSettings: [{ Done: 'Review' }, { Testing: 'mockOption' }],
            importedTreatFlagCardAsBlock: 'true' as unknown as boolean,
          },
          importedDoneStatus: ['DONE'],
          importedAssigneeFilter: '',
        },
      },
      updateMetricsState(mockUpdateMetricsStateArguments),
    );

    expect(savedMetricsSetting.importedData.importedCycleTime.importedTreatFlagCardAsBlock).toBeTruthy();
  });

  it('should update metricsState when its value changed given isProjectCreated is true', () => {
    const mockUpdateMetricsStateArguments = {
      ...mockJiraResponse,
      isProjectCreated: true,
    };
    const savedMetricsSetting = saveMetricsSettingReducer(
      initState,
      updateMetricsState(mockUpdateMetricsStateArguments),
    );

    expect(savedMetricsSetting.targetFields).toEqual([{ key: 'issuetype', name: 'Issue Type', flag: false }]);
    expect(savedMetricsSetting.users).toEqual(['User A', 'User B']);
    expect(savedMetricsSetting.cycleTimeSettings).toEqual([
      { column: 'Done', status: 'DONE', value: NO_RESULT_DASH },
      { column: 'Done', status: 'CLOSED', value: NO_RESULT_DASH },
      { column: 'Doing', status: 'ANALYSIS', value: NO_RESULT_DASH },
      { column: 'Testing', status: 'TESTING', value: NO_RESULT_DASH },
    ]);
    expect(savedMetricsSetting.doneColumn).toEqual([]);
  });

  it('should keep empty array when handle updateDeploymentFrequencySettings given initial state', () => {
    const savedMetricsSetting = saveMetricsSettingReducer(
      initState,
      updateDeploymentFrequencySettings({ updateId: 0, label: 'Steps', value: 'step1' }),
    );

    expect(savedMetricsSetting.deploymentFrequencySettings).toEqual([]);
  });

  it('should update a deploymentFrequencySetting when handle updateDeploymentFrequencySettings given multiple deploymentFrequencySettings', () => {
    const multipleDeploymentFrequencySettingsInitState = {
      ...initState,
      deploymentFrequencySettings: [
        { id: 0, organization: '', pipelineName: '', step: '', branches: [] },
        { id: 1, organization: '', pipelineName: '', step: '', branches: [] },
      ],
    };
    const updatedDeploymentFrequencySettings = [
      { id: 0, organization: 'mock new organization', pipelineName: '', step: '', branches: [] },
      { id: 1, organization: '', pipelineName: '', step: '', branches: [] },
    ];
    const savedMetricsSetting = saveMetricsSettingReducer(
      multipleDeploymentFrequencySettingsInitState,
      updateDeploymentFrequencySettings({ updateId: 0, label: 'organization', value: 'mock new organization' }),
    );

    expect(savedMetricsSetting.deploymentFrequencySettings).toEqual(updatedDeploymentFrequencySettings);
  });

  it('should add a deploymentFrequencySetting when handle addADeploymentFrequencySettings given initial state', () => {
    const addedDeploymentFrequencySettings = [{ id: 1, organization: '', pipelineName: '', step: '', branches: [] }];

    const savedMetricsSetting = saveMetricsSettingReducer(initState, addADeploymentFrequencySetting());

    expect(savedMetricsSetting.deploymentFrequencySettings).toEqual(addedDeploymentFrequencySettings);
  });

  it('should delete deploymentFrequencySetting when delete deploymentFrequencySettings given id', () => {
    const deploymentFrequencySettings = [{ id: 1, organization: '', pipelineName: '', step: '', branches: [] }];
    const mockState = {
      ...initState,
      deploymentFrequencySettings,
    };

    const deleteADeploymentFrequencySettingResult = saveMetricsSettingReducer(
      mockState,
      deleteADeploymentFrequencySetting(1),
    );

    expect(deleteADeploymentFrequencySettingResult.deploymentFrequencySettings.length).toEqual(0);
  });

  it('should add a deploymentFrequencySetting when handle addADeploymentFrequencySettings but initState dont have DeploymentFrequencySettings', () => {
    const addedDeploymentFrequencySettings = [{ id: 1, organization: '', pipelineName: '', step: '', branches: [] }];

    const initStateWithoutDeploymentFrequencySettings = {
      ...initState,
      deploymentFrequencySettings: [],
    };

    const savedMetricsSetting = saveMetricsSettingReducer(
      initStateWithoutDeploymentFrequencySettings,
      addADeploymentFrequencySetting(),
    );

    expect(savedMetricsSetting.deploymentFrequencySettings).toEqual(addedDeploymentFrequencySettings);
  });

  it('should delete a deploymentFrequencySetting when handle deleteADeploymentFrequencySettings given initial state', () => {
    const savedMetricsSetting = saveMetricsSettingReducer(initState, deleteADeploymentFrequencySetting(0));

    expect(savedMetricsSetting.deploymentFrequencySettings).toEqual([]);
  });

  it('should return deploymentFrequencySettings when call selectDeploymentFrequencySettings functions', () => {
    expect(selectDeploymentFrequencySettings(store.getState())).toEqual(initState.deploymentFrequencySettings);
  });

  it('should init deploymentFrequencySettings when handle initDeploymentFrequencySettings given multiple deploymentFrequencySettings', () => {
    const multipleDeploymentFrequencySettingsInitState = {
      ...initState,
      deploymentFrequencySettings: [
        { id: 0, organization: 'mockOrgName1', pipelineName: 'mockName1', step: 'step1', branches: [] },
        { id: 1, organization: 'mockOrgName2', pipelineName: 'mockName2', step: 'step2', branches: [] },
      ],
    };

    const savedMetricsSetting = saveMetricsSettingReducer(
      multipleDeploymentFrequencySettingsInitState,
      initDeploymentFrequencySettings(),
    );

    expect(savedMetricsSetting.deploymentFrequencySettings).toEqual(initState.deploymentFrequencySettings);
  });

  it('should return false when update TreatFlagCardAsBlock value  given false', () => {
    const savedMetricsSetting = saveMetricsSettingReducer(initState, updateTreatFlagCardAsBlock(false));

    expect(savedMetricsSetting.treatFlagCardAsBlock).toBe(false);
  });

  it('should update assignee filter given assignee filter string', () => {
    const savedMetricsSetting = saveMetricsSettingReducer(initState, updateAssigneeFilter('filter'));

    expect(savedMetricsSetting.assigneeFilter).toBe('filter');
  });

  it('should reset metric data given initial state', () => {
    const resetMetricDataResult = saveMetricsSettingReducer(initState, resetMetricData());

    expect(resetMetricDataResult.assigneeFilter).toBe('lastAssignee');
  });

  it('should pipeline crew given crews', () => {
    const crews = ['crew1', 'crew2'];
    const savedPipelineCrews = saveMetricsSettingReducer(initState, savePipelineCrews(crews));

    expect(savedPipelineCrews.pipelineCrews).toBe(crews);
  });

  it('should set cycle time setting type', () => {
    const setCycleTimeSettingsTypeResult = saveMetricsSettingReducer(
      initState,
      setCycleTimeSettingsType(CYCLE_TIME_SETTINGS_TYPES.BY_COLUMN),
    );

    expect(setCycleTimeSettingsTypeResult.cycleTimeSettingsType).toBe(CYCLE_TIME_SETTINGS_TYPES.BY_COLUMN);
  });

  it('should update get board config info', () => {
    const updateShouldGetBoardConfigResult = saveMetricsSettingReducer(initState, updateShouldGetBoardConfig(true));

    expect(updateShouldGetBoardConfigResult.shouldGetBoardConfig).toBe(true);
  });

  it('should update get pipeline config info', () => {
    const updateShouldGetPipelineConfigResult = saveMetricsSettingReducer(
      initState,
      updateShouldGetPipelineConfig(true),
    );

    expect(updateShouldGetPipelineConfigResult.shouldGetPipeLineConfig).toBe(true);
  });

  it('should update advanced setting', () => {
    const updateAdvancedSettingsResult = saveMetricsSettingReducer(
      initState,
      updateAdvancedSettings({ storyPoint: 'storyPoint', flag: 'flag' }),
    );

    expect(updateAdvancedSettingsResult.importedData.importedAdvancedSettings?.storyPoint).toBe('storyPoint');
    expect(updateAdvancedSettingsResult.importedData.importedAdvancedSettings?.flag).toBe('flag');
  });

  it('should update rework time setting', () => {
    const updateReworkTimesSettingsResult = saveMetricsSettingReducer(
      initState,
      updateReworkTimesSettings({ reworkState: 'reworkState', excludeStates: ['excludeStates'] }),
    );

    const rework = updateReworkTimesSettingsResult.importedData.reworkTimesSettings;
    expect(rework.reworkState).toBe('reworkState');
    expect(rework.excludeStates.length).toEqual(1);
    expect(rework.excludeStates).toContain('excludeStates');
  });

  it('should update deployment frequency settings', () => {
    const updateDeploymentFrequencySettingsResult = saveMetricsSettingReducer(
      {
        ...initState,
        deploymentFrequencySettings: [{ id: 1, organization: '', pipelineName: '', step: '', branches: [] }],
      },
      updateDeploymentFrequencySettings({ updateId: 1, label: 'Steps', value: 'value' }),
    );

    expect(updateDeploymentFrequencySettingsResult.deploymentFrequencySettings[0].step).toEqual('value');
  });

  describe('updatePipelineSettings', () => {
    const mockPipelineList = [
      {
        id: 'mockId1',
        name: 'mockPipelineName1',
        orgId: 'mockOrgId1',
        orgName: 'mockOrganization1',
        repository: 'mockRepository1',
        steps: ['mock step 1', 'mock step 2'],
        branches: [],
      },
    ];
    const testCases = [
      {
        isProjectCreated: false,
        initialState: {
          ...initState,
          importedData: {
            ...initState.importedData,
            importedDeployment: [
              {
                id: 0,
                organization: 'mockOrganization1',
                pipelineName: 'mockPipelineName1',
                step: 'mockStep1',
                branches: [],
              },
              {
                id: 1,
                organization: 'mockOrganization1',
                pipelineName: 'mockPipelineName2',
                step: 'mockStep2',
                branches: [],
              },
              {
                id: 2,
                organization: 'mockOrganization2',
                pipelineName: 'mockPipelineName3',
                step: 'mockStep3',
                branches: [],
              },
            ],
            importedLeadTime: [
              {
                id: 0,
                organization: 'mockOrganization1',
                pipelineName: 'mockPipelineName1',
                step: 'mockStep1',
                branches: [],
              },
            ],
          },
        },
        pipelineCrews: ['crew1', 'crew2'],
        expectSetting: {
          deploymentFrequencySettings: [
            {
              id: 0,
              organization: 'mockOrganization1',
              pipelineName: 'mockPipelineName1',
              step: 'mockStep1',
              branches: [],
            },
            { id: 1, organization: 'mockOrganization1', pipelineName: '', step: 'mockStep2', branches: [] },
            { id: 2, organization: '', pipelineName: '', step: 'mockStep3', branches: [] },
          ],
          leadTimeForChanges: [
            { id: 0, organization: 'mockOrganization1', pipelineName: 'mockPipelineName1', step: '', branches: [] },
          ],
          deploymentWarningMessage: [
            { id: 0, organization: null, pipelineName: null, step: null },
            { id: 1, organization: null, pipelineName: MESSAGE.PIPELINE_NAME_WARNING, step: null },
            { id: 2, organization: MESSAGE.ORGANIZATION_WARNING, pipelineName: null, step: null },
          ],
          leadTimeWarningMessage: [{ id: 0, organization: null, pipelineName: null, step: null }],
        },
      },
      {
        isProjectCreated: true,
        initialState: {
          ...initState,
          importedData: {
            ...initState.importedData,
            importedDeployment: [
              {
                id: 0,
                organization: 'mockOrganization1',
                pipelineName: 'mockPipelineName1',
                step: 'mockStep1',
                branches: [],
              },
              {
                id: 1,
                organization: 'mockOrganization1',
                pipelineName: 'mockPipelineName2',
                step: 'mockStep2',
                branches: [],
              },
              {
                id: 2,
                organization: 'mockOrganization2',
                pipelineName: 'mockPipelineName3',
                step: 'mockStep3',
                branches: [],
              },
            ],
            importedLeadTime: [
              {
                id: 0,
                organization: 'mockOrganization1',
                pipelineName: 'mockPipelineName1',
                step: 'mockStep1',
                branches: [],
              },
            ],
          },
        },
        pipelineCrews: ['crew1', 'crew2'],
        expectSetting: {
          deploymentFrequencySettings: [
            {
              id: 0,
              organization: 'mockOrganization1',
              pipelineName: 'mockPipelineName1',
              step: 'mockStep1',
              branches: [],
            },
            { id: 1, organization: 'mockOrganization1', pipelineName: '', step: 'mockStep2', branches: [] },
            { id: 2, organization: '', pipelineName: '', step: 'mockStep3', branches: [] },
          ],
          leadTimeForChanges: [
            { id: 0, organization: 'mockOrganization1', pipelineName: 'mockPipelineName1', step: '', branches: [] },
          ],
          deploymentWarningMessage: [],
          leadTimeWarningMessage: [{ id: 0, organization: null, pipelineName: null, step: null }],
        },
      },
      {
        isProjectCreated: true,
        initialState: {
          ...initState,
          importedData: {
            ...initState.importedData,
            importedDeployment: [],
            importedLeadTime: [],
          },
        },
        pipelineCrews: [],
        expectSetting: {
          deploymentFrequencySettings: [{ id: 0, organization: '', pipelineName: '', step: '', branches: [] }],
          leadTimeForChanges: [{ id: 0, organization: '', pipelineName: '', step: '', branches: [] }],
          deploymentWarningMessage: [],
          leadTimeWarningMessage: [],
        },
      },
      {
        isProjectCreated: true,
        initialState: {
          ...initState,
          deploymentFrequencySettings: [{ id: 1, organization: '', pipelineName: '', step: '', branches: [] }],
          importedData: {
            ...initState.importedData,
            importedDeployment: [],
            importedLeadTime: [],
          },
        },
        pipelineCrews: [],
        expectSetting: {
          deploymentFrequencySettings: [{ id: 1, organization: '', pipelineName: '', step: '', branches: [] }],
          leadTimeForChanges: [{ id: 0, organization: '', pipelineName: '', step: '', branches: [] }],
          deploymentWarningMessage: [],
          leadTimeWarningMessage: [],
        },
      },
    ];

    beforeEach(jest.clearAllMocks);

    testCases.forEach(({ isProjectCreated, initialState, pipelineCrews, expectSetting }) => {
      it(`should update pipeline settings When call updatePipelineSettings given isProjectCreated ${isProjectCreated}`, () => {
        const savedMetricsSetting = saveMetricsSettingReducer(
          initialState,
          updatePipelineSettings({ pipelineList: mockPipelineList, isProjectCreated, pipelineCrews }),
        );

        expect(savedMetricsSetting.deploymentFrequencySettings).toEqual(expectSetting.deploymentFrequencySettings);
        expect(savedMetricsSetting.deploymentWarningMessage).toEqual(expectSetting.deploymentWarningMessage);
      });
    });
  });

  describe('updatePipelineSteps', () => {
    const mockImportedDeployment = [
      {
        id: 0,
        organization: 'mockOrganization1',
        pipelineName: 'mockPipelineName1',
        step: 'mockStep1',
        branches: ['branch1'],
      },
      {
        id: 1,
        organization: 'mockOrganization1',
        pipelineName: 'mockPipelineName2',
        step: 'mockStep2',
        branches: ['branch1'],
      },
      {
        id: 2,
        organization: 'mockOrganization2',
        pipelineName: 'mockPipelineName3',
        step: 'mockStep3',
        branches: ['branch1'],
      },
    ];
    const mockImportedLeadTime = [
      {
        id: 0,
        organization: 'mockOrganization1',
        pipelineName: 'mockPipelineName1',
        step: 'mockStep1',
        branches: ['branch1'],
      },
    ];
    const mockInitState = {
      ...initState,
      deploymentFrequencySettings: [
        {
          id: 0,
          organization: 'mockOrganization1',
          pipelineName: 'mockPipelineName1',
          step: '',
          branches: ['branch1'],
        },
        { id: 1, organization: 'mockOrganization1', pipelineName: 'mockPipelineName2', step: '', branches: [] },
      ],
      leadTimeForChanges: [
        {
          id: 0,
          organization: 'mockOrganization1',
          pipelineName: 'mockPipelineName1',
          step: '',
          branches: [],
        },
      ],
      importedData: {
        ...initState.importedData,
        importedPipelineCrews: ['crew1'],
        importedDeployment: mockImportedDeployment,
        importedLeadTime: mockImportedLeadTime,
      },
      deploymentWarningMessage: [
        { id: 0, organization: null, pipelineName: null, step: null },
        { id: 1, organization: null, pipelineName: null, step: null },
      ],
      leadTimeWarningMessage: [{ id: 0, organization: null, pipelineName: null, step: null }],
    };
    const mockSteps = ['mockStep1'];
    const testSettingsCases = [
      {
        id: 0,
        steps: mockSteps,
        pipelineCrews: ['crew1'],
        branches: [],
        type: PIPELINE_SETTING_TYPES.DEPLOYMENT_FREQUENCY_SETTINGS_TYPE,
        expectedSettings: [
          {
            id: 0,
            organization: 'mockOrganization1',
            pipelineName: 'mockPipelineName1',
            step: 'mockStep1',
            branches: [],
          },
          { id: 1, organization: 'mockOrganization1', pipelineName: 'mockPipelineName2', step: '', branches: [] },
        ],
        expectedWarning: [
          { id: 0, organization: null, pipelineName: null, step: null },
          { id: 1, organization: null, pipelineName: null, step: null },
        ],
      },
      {
        id: 1,
        steps: mockSteps,
        pipelineCrews: ['crew1'],
        branches: ['branch1'],
        type: PIPELINE_SETTING_TYPES.DEPLOYMENT_FREQUENCY_SETTINGS_TYPE,
        expectedSettings: [
          {
            id: 0,
            organization: 'mockOrganization1',
            pipelineName: 'mockPipelineName1',
            step: '',
            branches: ['branch1'],
          },
          {
            id: 1,
            organization: 'mockOrganization1',
            pipelineName: 'mockPipelineName2',
            step: '',
            branches: ['branch1'],
          },
        ],
        expectedWarning: [
          { id: 0, organization: null, pipelineName: null, step: null },
          {
            id: 1,
            organization: null,
            pipelineName: null,
            step: 'Selected step of this pipeline in import data might be removed',
          },
        ],
      },
      {
        id: 10,
        steps: mockSteps,
        pipelineCrews: ['crew1'],
        branches: ['branch1'],
        type: PIPELINE_SETTING_TYPES.DEPLOYMENT_FREQUENCY_SETTINGS_TYPE,
        expectedSettings: [
          {
            id: 0,
            organization: 'mockOrganization1',
            pipelineName: 'mockPipelineName1',
            step: '',
            branches: ['branch1'],
          },
          { id: 1, organization: 'mockOrganization1', pipelineName: 'mockPipelineName2', step: '', branches: [] },
        ],
        expectedWarning: [
          { id: 0, organization: null, pipelineName: null, step: null },
          {
            id: 1,
            organization: null,
            pipelineName: null,
            step: null,
          },
        ],
      },
      {
        id: 11,
        steps: mockSteps,
        pipelineCrews: ['crew1'],
        branches: ['branch1'],
        type: PIPELINE_SETTING_TYPES.DEPLOYMENT_FREQUENCY_SETTINGS_TYPE,
        expectedSettings: [
          {
            id: 0,
            organization: 'mockOrganization1',
            pipelineName: 'mockPipelineName1',
            step: '',
            branches: ['branch1'],
          },
          { id: 1, organization: 'mockOrganization1', pipelineName: 'mockPipelineName2', step: '', branches: [] },
        ],
        expectedWarning: [
          { id: 0, organization: null, pipelineName: null, step: null },
          {
            id: 1,
            organization: null,
            pipelineName: null,
            step: null,
          },
        ],
      },
    ];

    testSettingsCases.forEach(({ id, type, steps, pipelineCrews, branches, expectedSettings, expectedWarning }) => {
      const settingsKey = 'deploymentFrequencySettings';
      const warningKey = 'deploymentWarningMessage';

      it(`should update ${settingsKey} step when call updatePipelineSteps with id ${id}`, () => {
        const savedMetricsSetting = saveMetricsSettingReducer(
          mockInitState,
          updatePipelineStep({
            steps: steps,
            id: id,
            type: type,
            pipelineCrews: pipelineCrews,
            branches: branches,
          }),
        );

        expect(savedMetricsSetting[settingsKey]).toEqual(expectedSettings);
        expect(savedMetricsSetting[warningKey]).toEqual(expectedWarning);
      });
    });
  });

  it('should set warningMessage have value when there are more values in the import file than in the response', () => {
    const mockUpdateMetricsStateArguments = {
      ...mockJiraResponse,
      isProjectCreated: false,
    };
    const savedMetricsSetting = saveMetricsSettingReducer(
      {
        ...initState,
        importedData: {
          ...initState.importedData,
          importedCycleTime: {
            importedCycleTimeSettings: [
              { ToDo: 'mockOption' },
              { Doing: 'Analysis' },
              { Testing: 'Testing' },
              { Done: 'Done' },
            ],
            importedTreatFlagCardAsBlock: true,
          },
        },
      },
      updateMetricsState(mockUpdateMetricsStateArguments),
    );

    expect(savedMetricsSetting.cycleTimeWarningMessage).toEqual(
      'The column of ToDo is a deleted column, which means this column existed the time you saved config, but was deleted. Please confirm!',
    );
  });

  describe('should update metrics when reload metric page', () => {
    it.each([{ isProjectCreated: false }, { isProjectCreated: true }])(
      'should update classification correctly when reload metrics page',
      (mockData) => {
        const savedMetricsSetting = saveMetricsSettingReducer(
          {
            ...initState,
            firstTimeRoadMetricData: false,
            targetFields: [
              { key: 'issuetype', name: 'Issue Type', flag: false },
              { key: 'parent', name: 'Parent', flag: true },
            ],
          },
          updateMetricsState({
            ...mockJiraResponse,
            ...mockData,
            targetFields: [
              {
                key: 'parent',
                name: 'Parent',
                flag: false,
              },
              {
                key: 'customfield_10061',
                name: 'Story testing',
                flag: false,
              },
            ],
          }),
        );
        expect(savedMetricsSetting.targetFields).toEqual([
          { key: 'parent', name: 'Parent', flag: true },
          { key: 'customfield_10061', name: 'Story testing', flag: false },
        ]);
      },
    );

    it.each([{ isProjectCreated: true }, { isProjectCreated: false }])(
      'should update board crews user correctly when reload metrics page',
      (mockData) => {
        const savedMetricsSetting = saveMetricsSettingReducer(
          {
            ...initState,
            firstTimeRoadMetricData: false,
            users: ['User A', 'User B', 'C'],
          },
          updateMetricsState({ ...mockJiraResponse, ...mockData }),
        );
        expect(savedMetricsSetting.users).toEqual(['User A', 'User B']);
      },
    );

    it.each([CYCLE_TIME_SETTINGS_TYPES.BY_COLUMN, CYCLE_TIME_SETTINGS_TYPES.BY_STATUS])(
      'should update cycle time settings correctly when reload metrics page',
      (cycleTimeSettingsType) => {
        const savedMetricsSetting = saveMetricsSettingReducer(
          {
            ...initState,
            firstTimeRoadMetricData: false,
            cycleTimeSettingsType,
            cycleTimeSettings: [
              {
                column: 'TODO',
                status: 'TODO',
                value: 'To do',
              },
              {
                column: 'Doing',
                status: 'DOING',
                value: 'In Dev',
              },
              {
                column: 'Blocked',
                status: 'BLOCKED',
                value: 'Block',
              },
            ],
          },
          updateMetricsState({
            ...mockJiraResponse,
            jiraColumns: [
              {
                key: 'To Do',
                value: {
                  name: 'TODO',
                  statuses: ['TODO'],
                },
              },
              {
                key: 'In Progress',
                value: {
                  name: 'Doing',
                  statuses: ['DOING'],
                },
              },
            ],
          }),
        );
        expect(savedMetricsSetting.cycleTimeSettings).toEqual([
          {
            column: 'TODO',
            status: 'TODO',
            value: 'To do',
          },
          {
            column: 'Doing',
            status: 'DOING',
            value: 'In Dev',
          },
        ]);
      },
    );
  });

  it('should set warningMessage have value when the values in the import file are less than those in the response', () => {
    const mockUpdateMetricsStateArguments = {
      ...mockJiraResponse,
      isProjectCreated: false,
    };
    const savedMetricsSetting = saveMetricsSettingReducer(
      {
        ...initState,
        importedData: {
          ...initState.importedData,
          importedCycleTime: {
            importedCycleTimeSettings: [{ Doing: 'Analysis' }, { Done: 'Done' }],
            importedTreatFlagCardAsBlock: true,
          },
        },
      },
      updateMetricsState(mockUpdateMetricsStateArguments),
    );

    expect(savedMetricsSetting.cycleTimeWarningMessage).toEqual(
      'The column of Testing is a new column. Please select a value for it!',
    );
  });

  it('should set warningMessage have value when the key value in the import file matches the value in the response, but the value does not match the fixed column', () => {
    const mockUpdateMetricsStateArguments = {
      ...mockJiraResponse,
      isProjectCreated: false,
    };
    const savedMetricsSetting = saveMetricsSettingReducer(
      {
        ...initState,
        importedData: {
          ...initState.importedData,
          importedCycleTime: {
            importedCycleTimeSettings: [{ Doing: 'mockOption' }, { Testing: 'Analysis' }, { Done: 'Done' }],
            importedTreatFlagCardAsBlock: true,
          },
        },
      },
      updateMetricsState(mockUpdateMetricsStateArguments),
    );

    expect(savedMetricsSetting.cycleTimeWarningMessage).toEqual(
      'The value of Doing in imported json is not in dropdown list now. Please select a value for it!',
    );
  });

  it('should set warningMessage null when the key value in the imported file matches the value in the response and the value matches the fixed column', () => {
    const mockUpdateMetricsStateArguments = {
      ...mockJiraResponse,
      isProjectCreated: false,
    };
    const savedMetricsSetting = saveMetricsSettingReducer(
      {
        ...initState,
        importedData: {
          ...initState.importedData,
          importedCycleTime: {
            importedCycleTimeSettings: [{ Testing: 'Testing' }, { Doing: 'Done' }, { Done: 'Done' }],
            importedTreatFlagCardAsBlock: true,
          },
        },
      },
      updateMetricsState(mockUpdateMetricsStateArguments),
    );

    expect(savedMetricsSetting.cycleTimeWarningMessage).toBeNull();
  });

  it('should set warningMessage null when importedCycleTimeSettings in the imported file matches is empty', () => {
    const mockUpdateMetricsStateArguments = {
      ...mockJiraResponse,
      isProjectCreated: false,
    };
    const savedMetricsSetting = saveMetricsSettingReducer(
      {
        ...initState,
        importedData: {
          ...initState.importedData,
          importedCycleTime: {
            importedCycleTimeSettings: [],
            importedTreatFlagCardAsBlock: true,
          },
        },
      },
      updateMetricsState(mockUpdateMetricsStateArguments),
    );

    expect(savedMetricsSetting.cycleTimeWarningMessage).toBeNull();
  });

  it('should set classification warningMessage null when the key value in the imported file matches the value in the response and the value matches the fixed column', () => {
    const mockUpdateMetricsStateArguments = {
      ...mockJiraResponse,
      isProjectCreated: false,
    };
    const savedMetricsSetting = saveMetricsSettingReducer(
      {
        ...initState,
        importedData: {
          ...initState.importedData,
          importedClassification: ['issuetype'],
        },
      },
      updateMetricsState(mockUpdateMetricsStateArguments),
    );

    expect(savedMetricsSetting.classificationWarningMessage).toBeNull();
  });

  it('should set classification warningMessage have value when the key value in the imported file matches the value in the response and the value matches the fixed column', () => {
    const mockUpdateMetricsStateArguments = {
      ...mockJiraResponse,
      isProjectCreated: false,
    };
    const savedMetricsSetting = saveMetricsSettingReducer(
      {
        ...initState,
        importedData: {
          ...initState.importedData,
          importedClassification: ['test'],
        },
      },
      updateMetricsState(mockUpdateMetricsStateArguments),
    );

    expect(savedMetricsSetting.classificationWarningMessage).toEqual(CLASSIFICATION_WARNING_MESSAGE);
  });

  it('should set realDone warning message null when doneColumns in imported file matches the value in the response', () => {
    const mockUpdateMetricsStateArguments = {
      ...mockJiraResponse,
      jiraColumns: [
        {
          key: 'done',
          value: {
            name: 'Done',
            statuses: ['DONE', 'CLOSED'],
          },
        },
      ],
      isProjectCreated: false,
    };
    const savedMetricsSetting = saveMetricsSettingReducer(
      {
        ...initState,
        importedData: {
          ...initState.importedData,
          importedDoneStatus: ['DONE'],
        },
      },
      updateMetricsState(mockUpdateMetricsStateArguments),
    );

    expect(savedMetricsSetting.realDoneWarningMessage).toBeNull();
  });

  it('should set realDone warning message have value when doneColumns in imported file not matches the value in the response', () => {
    const mockUpdateMetricsStateArguments = {
      ...mockJiraResponse,
      jiraColumns: [
        {
          key: 'done',
          value: {
            name: 'Done',
            statuses: ['DONE', 'CLOSED'],
          },
        },
      ],
      isProjectCreated: false,
    };
    const savedMetricsSetting = saveMetricsSettingReducer(
      {
        ...initState,
        importedData: {
          ...initState.importedData,
          importedDoneStatus: ['CANCELED'],
        },
      },
      updateMetricsState(mockUpdateMetricsStateArguments),
    );

    expect(savedMetricsSetting.realDoneWarningMessage).toEqual(MESSAGE.REAL_DONE_WARNING);
  });

  it('should set realDone warning message null when doneColumns in imported file matches the value in cycleTimeSettings', () => {
    const mockUpdateMetricsStateArguments = {
      ...mockJiraResponse,
      jiraColumns: [
        {
          key: 'done',
          value: {
            name: 'Done',
            statuses: ['DONE', 'CLOSED'],
          },
        },
      ],
      isProjectCreated: false,
    };
    const savedMetricsSetting = saveMetricsSettingReducer(
      {
        ...initState,
        cycleTimeSettings: [{ column: 'Done', status: 'DONE', value: 'Done' }],
        importedData: {
          ...initState.importedData,
          importedDoneStatus: ['DONE', 'CLOSED'],
        },
      },
      updateMetricsState(mockUpdateMetricsStateArguments),
    );

    expect(savedMetricsSetting.realDoneWarningMessage).toBeNull();
  });

  it('should set realDone warning message have value when doneColumns in imported file not matches the value in cycleTimeSettings', () => {
    const mockUpdateMetricsStateArguments = {
      ...mockJiraResponse,
      jiraColumns: [
        {
          key: 'done',
          value: {
            name: 'Done',
            statuses: ['DONE', 'CLOSED'],
          },
        },
      ],
      isProjectCreated: false,
    };
    const savedMetricsSetting = saveMetricsSettingReducer(
      {
        ...initState,
        cycleTimeSettings: [{ column: 'Done', status: 'DONE', value: 'Done' }],
        importedData: {
          ...initState.importedData,
          importedDoneStatus: ['DONE', 'CLOSED', 'CANCELED'],
        },
      },
      updateMetricsState(mockUpdateMetricsStateArguments),
    );

    expect(savedMetricsSetting.realDoneWarningMessage).toEqual(MESSAGE.REAL_DONE_WARNING);
  });

  describe('select pipeline settings warning message', () => {
    const mockPipelineSettings = [
      {
        id: 0,
        organization: 'mockOrganization2',
        pipelineName: 'mockPipelineName1',
        step: 'mockStep',
      },
      {
        id: 1,
        organization: 'mockOrganization1',
        pipelineName: 'mockPipelineName2',
        step: ' mockStep1',
      },
    ];
    const mockImportData = {
      deployment: mockPipelineSettings,
      leadTime: mockPipelineSettings,
    };
    const mockPipelineList = [
      {
        id: 'mockId1',
        name: 'mockPipelineName1',
        orgId: 'mockOrgId1',
        orgName: 'mockOrganization1',
        repository: 'mockRepository1',
        steps: ['mock step 1', 'mock step 2'],
      },
    ];
    const mockSteps = ['mockStep'];
    const ORGANIZATION_WARNING_MESSAGE = 'This organization in import data might be removed';
    const PIPELINE_NAME_WARNING_MESSAGE = 'This Pipeline in import data might be removed';
    const STEP_WARNING_MESSAGE = 'Selected step of this pipeline in import data might be removed';

    let store = setupStore();
    beforeEach(async () => {
      store = setupStore();
      await store.dispatch(updateMetricsImportedData(mockImportData));
      await store.dispatch(updatePipelineSettings({ pipelineList: mockPipelineList, isProjectCreated: false }));
      await store.dispatch(
        updatePipelineStep({
          steps: mockSteps,
          id: 0,
          type: PIPELINE_SETTING_TYPES.DEPLOYMENT_FREQUENCY_SETTINGS_TYPE,
        }),
      );
      await store.dispatch(
        updatePipelineStep({
          steps: mockSteps,
          id: 1,
          type: PIPELINE_SETTING_TYPES.DEPLOYMENT_FREQUENCY_SETTINGS_TYPE,
        }),
      );
    });
    afterEach(() => {
      jest.clearAllMocks();
    });
    it('should return organization warning message given its id and type', () => {
      expect(selectOrganizationWarningMessage(store.getState(), 0)).toEqual(ORGANIZATION_WARNING_MESSAGE);
      expect(selectOrganizationWarningMessage(store.getState(), 1)).toBeNull();
    });

    it('should return status of initial state', () => {
      expect(selectShouldGetBoardConfig(store.getState())).toBeFalsy();
      expect(selectShouldGetPipelineConfig(store.getState())).toBeFalsy();
      expect(selectDeploymentFrequencySettings(store.getState()).length).toBeGreaterThan(1);
      expect(selectReworkTimesSettings(store.getState())).toStrictEqual({ excludeStates: [], reworkState: null });
      expect(selectCycleTimeSettings(store.getState())).toEqual([]);
      expect(selectMetricsContent(store.getState()).assigneeFilter).toEqual('lastAssignee');
      expect(selectAdvancedSettings(store.getState())).toEqual(null);
      expect(selectTreatFlagCardAsBlock(store.getState())).toBeTruthy();
      expect(selectAssigneeFilter(store.getState())).toEqual('lastAssignee');
      expect(selectCycleTimeWarningMessage(store.getState())).toEqual(null);
      expect(selectClassificationWarningMessage(store.getState())).toEqual(null);
      expect(selectRealDoneWarningMessage(store.getState())).toEqual(null);
      expect(selectTreatFlagCardAsBlock(store.getState())).toBeTruthy();
    });

    it('should return pipelineName warning message given its id and type', () => {
      expect(selectPipelineNameWarningMessage(store.getState(), 0)).toBeNull();
      expect(selectPipelineNameWarningMessage(store.getState(), 1)).toEqual(PIPELINE_NAME_WARNING_MESSAGE);
    });

    it('should return step warning message given its id and type', () => {
      expect(selectStepWarningMessage(store.getState(), 0)).toBeNull();
      expect(selectStepWarningMessage(store.getState(), 1)).toEqual(STEP_WARNING_MESSAGE);
    });
  });
});
