import saveMetricsSettingReducer, {
  addADeploymentFrequencySetting,
  deleteADeploymentFrequencySetting,
  initDeploymentFrequencySettings,
  saveCycleTimeSettings,
  saveDoneColumn,
  saveTargetFields,
  saveUsers,
  selectDeploymentFrequencySettings,
  selectOrganizationWarningMessage,
  selectPipelineNameWarningMessage,
  selectStepWarningMessage,
  updateDeploymentFrequencySettings,
  updateMetricsImportedData,
  updateMetricsState,
  updatePipelineSettings,
  updatePipelineStep,
  updateTreatFlagCardAsBlock,
} from '@src/context/Metrics/metricsSlice';
import { ASSIGNEE_FILTER_TYPES, CYCLE_TIME_SETTINGS_TYPES, MESSAGE } from '@src/constants/resources';
import { CLASSIFICATION_WARNING_MESSAGE, NO_RESULT_DASH, PIPELINE_SETTING_TYPES } from '../fixtures';
import { setupStore } from '../utils/setupStoreUtil';
import { store } from '@src/store';

const initState = {
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
  },
  cycleTimeWarningMessage: null,
  classificationWarningMessage: null,
  realDoneWarningMessage: null,
  deploymentWarningMessage: [],
  leadTimeWarningMessage: [],
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
      saveCycleTimeSettings({
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
            importedDeployment: [],
            importedLeadTime: [],
          },
        },
        expectSetting: {
          deploymentFrequencySettings: [{ id: 0, organization: '', pipelineName: '', step: '', branches: [] }],
          leadTimeForChanges: [{ id: 0, organization: '', pipelineName: '', step: '', branches: [] }],
          deploymentWarningMessage: [],
          leadTimeWarningMessage: [],
        },
      },
    ];

    beforeEach(jest.clearAllMocks);

    testCases.forEach(({ isProjectCreated, expectSetting, initialState }) => {
      it(`should update pipeline settings When call updatePipelineSettings given isProjectCreated ${isProjectCreated}`, () => {
        const savedMetricsSetting = saveMetricsSettingReducer(
          initialState,
          updatePipelineSettings({ pipelineList: mockPipelineList, isProjectCreated }),
        );

        expect(savedMetricsSetting.deploymentFrequencySettings).toEqual(expectSetting.deploymentFrequencySettings);
        expect(savedMetricsSetting.deploymentWarningMessage).toEqual(expectSetting.deploymentWarningMessage);
      });
    });
  });

  describe('updatePipelineSteps', () => {
    const mockImportedDeployment = [
      { id: 0, organization: 'mockOrganization1', pipelineName: 'mockPipelineName1', step: 'mockStep1', branches: [] },
      { id: 1, organization: 'mockOrganization1', pipelineName: 'mockPipelineName2', step: 'mockStep2', branches: [] },
      { id: 2, organization: 'mockOrganization2', pipelineName: 'mockPipelineName3', step: 'mockStep3', branches: [] },
    ];
    const mockImportedLeadTime = [
      { id: 0, organization: 'mockOrganization1', pipelineName: 'mockPipelineName1', step: 'mockStep1', branches: [] },
    ];
    const mockInitState = {
      ...initState,
      deploymentFrequencySettings: [
        { id: 0, organization: 'mockOrganization1', pipelineName: 'mockPipelineName1', step: '', branches: [] },
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
        type: PIPELINE_SETTING_TYPES.DEPLOYMENT_FREQUENCY_SETTINGS_TYPE,
        expectedSettings: [
          { id: 0, organization: 'mockOrganization1', pipelineName: 'mockPipelineName1', step: '', branches: [] },
          { id: 1, organization: 'mockOrganization1', pipelineName: 'mockPipelineName2', step: '', branches: [] },
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
    ];

    testSettingsCases.forEach(({ id, type, steps, expectedSettings, expectedWarning }) => {
      const settingsKey = 'deploymentFrequencySettings';
      const warningKey = 'deploymentWarningMessage';

      it(`should update ${settingsKey} step when call updatePipelineSteps with id ${id}`, () => {
        const savedMetricsSetting = saveMetricsSettingReducer(
          mockInitState,
          updatePipelineStep({
            steps: steps,
            id: id,
            type: type,
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
