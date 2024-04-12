import { CSVReportRequestDTO, ReportRequestDTO } from '@src/clients/report/dto/request';
import { ReportResponseDTO } from '@src/clients/report/dto/response';
import { SOURCE_CONTROL_TYPES } from '@src/constants/resources';
import { METRIC_TYPES } from '@src/constants/commons';

export const PROJECT_NAME = 'Heartbeat';
export const PROJECT_DESCRIPTION =
  'Heartbeat is a tool for tracking project delivery metrics that can help you get a better understanding of delivery performance. This product allows you easily get all aspects of source data faster and more accurate to analyze team delivery performance which enables delivery teams and team leaders focusing on driving continuous improvement and enhancing team productivity and efficiency.';

export const ZERO = 0;

export const REGULAR_CALENDAR = 'Regular Calendar(Weekend Considered)';

export const CHINA_CALENDAR = 'Calendar with Chinese Holiday';

export const NEXT = 'Next';

export const CONFIRM = 'Confirm';

export const LOADING = 'loading';

export const PREVIOUS = 'Previous';

export const SAVE = 'Save';

export const SHOW_MORE = 'show more >';

export const RETRY = 'retry';

export const BACK = 'Back';

export const BOARD_METRICS_TITLE = 'Board Metrics';

export const VERIFY = 'Verify';

export const REVERIFY = 'Reverify';

export const RESET = 'Reset';

export const EXPORT_PIPELINE_DATA = 'Export pipeline data';

export const EXPORT_BOARD_DATA = 'Export board data';

export const EXPORT_METRIC_DATA = 'Export metric data';

export const VERIFIED = 'Verified';

export const TOKEN_ERROR_MESSAGE = ['Token is invalid!', 'Token is required!'];

export const PROJECT_NAME_LABEL = 'Project name';

export const STEPPER = ['Config', 'Metrics', 'Report'];

export const REQUIRED_DATA_LIST = [
  'All',
  'Velocity',
  'Cycle time',
  'Classification',
  'Rework times',
  'Lead time for changes',
  'Deployment frequency',
  'Dev change failure rate',
  'Dev mean time to recovery',
];
export const ALL = 'All';
export const VELOCITY = 'Velocity';
export const CYCLE_TIME = 'Cycle time';
export const CLASSIFICATION = 'Classification';
export const REWORK_TIMES = 'Rework times';
export const LEAD_TIME_FOR_CHANGES = 'Lead time for changes';
export const DEPLOYMENT_FREQUENCY = 'Deployment frequency';
export const DEV_CHANGE_FAILURE_RATE = 'Dev change failure rate';
export const DEV_MEAN_TIME_TO_RECOVERY = 'Dev mean time to recovery';
export const REQUIRED_DATA = 'Required metrics';
export const TEST_PROJECT_NAME = 'test project Name';
export const ERROR_MESSAGE_COLOR = 'color: #d32f2f';
export const ERROR_DATE = '02/03/';
export const CREATE_NEW_PROJECT = 'Create a new project';
export const IMPORT_PROJECT_FROM_FILE = 'Import project from file';
export const EXPORT_EXPIRED_CSV_MESSAGE = 'The report has been expired, please generate it again';

export const BOARD_TYPES = {
  JIRA: 'Jira',
};

export const PIPELINE_TOOL_TYPES = {
  BUILD_KITE: 'BuildKite',
};

export enum CONFIG_TITLE {
  BOARD = 'Board',
  PIPELINE_TOOL = 'Pipeline Tool',
  SOURCE_CONTROL = 'Source Control',
}

export const BOARD_FIELDS = ['Board', 'Board Id', 'Email', 'Site', 'Token'];
export const PIPELINE_TOOL_FIELDS = ['Pipeline Tool', 'Token'];
export const SOURCE_CONTROL_FIELDS = ['Source Control', 'Token'];

export const BASE_URL = 'api/v1';
export const MOCK_BOARD_URL_FOR_JIRA = `${BASE_URL}/boards/jira/verify`;
export const MOCK_BOARD_INFO_URL = `${BASE_URL}/boards/jira/info`;
export const MOCK_PIPELINE_URL = `${BASE_URL}/pipelines/buildkite`;
export const MOCK_PIPELINE_VERIFY_URL = `${BASE_URL}/pipelines/buildkite/verify`;
export const MOCK_PIPELINE_GET_INFO_URL = `${BASE_URL}/pipelines/buildkite/info`;
export const MOCK_JIRA_URL = `${BASE_URL}/pipelines/jira`;
export const MOCK_SOURCE_CONTROL_VERIFY_TOKEN_URL = `${BASE_URL}/source-control/:type/verify`;
export const MOCK_SOURCE_CONTROL_VERIFY_BRANCH_URL = `${BASE_URL}/source-control/:type/repos/branches/verify`;
export const MOCK_REPORT_URL = `${BASE_URL}/reports`;
export const MOCK_VERSION_URL = `${BASE_URL}/version`;
export const MOCK_EXPORT_CSV_URL = `${BASE_URL}/reports/:dataType/:fileName`;

export const VERSION_RESPONSE = {
  version: '1.11',
};

export enum VERIFY_ERROR_MESSAGE {
  BAD_REQUEST = 'Please reconfirm the input',
  UNAUTHORIZED = 'Token is incorrect',
  INTERNAL_SERVER_ERROR = 'Internal server error',
  NOT_FOUND = 'Not found',
  PERMISSION_DENIED = 'Permission denied',
  REQUEST_TIMEOUT = 'Request Timeout',
  UNKNOWN = 'Unknown',
}

export enum AXIOS_ERROR_MESSAGE {
  ERR_NETWORK = 'Network Error',
}

export const VERIFY_FAILED = 'verify failed';

export const MOCK_BOARD_VERIFY_REQUEST_PARAMS = {
  token: 'mockToken',
  type: BOARD_TYPES.JIRA,
  site: '1',
  projectKey: '1',
  email: 'fake@mail.com',
  startTime: 1613664000000,
  endTime: 1614873600000,
  boardId: '1',
};

export const MOCK_JIRA_BOARD_VERIFY_REQUEST_PARAMS = {
  token: 'mockToken',
  type: BOARD_TYPES.JIRA,
  site: '2',
  email: 'fake@mail.com',
  projectKey: '2',
  startTime: 1613664000000,
  endTime: 1614873600000,
  boardId: '2',
};

export const MOCK_PIPELINE_VERIFY_REQUEST_PARAMS = {
  token: 'mockToken',
  type: PIPELINE_TOOL_TYPES.BUILD_KITE,
  startTime: 1613664000000,
  endTime: 1614873600000,
};

export const MOCK_SOURCE_CONTROL_VERIFY_REQUEST_PARAMS = {
  token: 'mockToken',
  type: SOURCE_CONTROL_TYPES.GITHUB,
};

export const MOCK_GENERATE_REPORT_REQUEST_PARAMS: ReportRequestDTO = {
  metrics: [],
  startTime: '1613664000000',
  endTime: '1614873600000',
  considerHoliday: true,
  buildKiteSetting: {
    token: 'mockToken',
    type: PIPELINE_TOOL_TYPES.BUILD_KITE,
    pipelineCrews: [],
    deploymentEnvList: [
      {
        id: 'mockPipelineId',
        name: 'mockPipelineName',
        orgId: 'mockOrgId',
        orgName: 'mockOrgName',
        repository: 'mockRep',
        step: 'step',
        branches: [],
      },
    ],
  },
  codebaseSetting: {
    type: 'github',
    token: 'mockToken',
    leadTime: [
      {
        id: 'mockPipelineId',
        name: 'mockPipelineName',
        orgId: 'mockOrgId',
        orgName: 'mockOrgName',
        repository: 'mockRep',
        step: 'step',
        branches: [],
      },
    ],
  },
  jiraBoardSetting: {
    token: 'mockToken',
    type: BOARD_TYPES.JIRA,
    site: '2',
    projectKey: '2',
    boardId: '2',
    boardColumns: [{ name: 'In Analysis', value: 'In Analysis' }],
    treatFlagCardAsBlock: true,
    users: ['user1', 'user2'],
    assigneeFilter: 'lastAssignee',
    targetFields: [{ key: 'parent', name: 'Parent', flag: false }],
    doneColumn: ['Done'],
    overrideFields: [{ key: '123', name: 'Story Point', flag: true }],
    reworkTimesSetting: {
      reworkState: 'Done',
      excludedStates: [],
    },
  },
  metricTypes: [METRIC_TYPES.BOARD, METRIC_TYPES.DORA],
};

export const IMPORTED_NEW_CONFIG_FIXTURE = {
  projectName: 'ConfigFileForImporting',
  metrics: ['Velocity', 'Cycle time', 'Classification', 'Lead time for changes'],
  dateRange: [
    {
      startDate: '2023-03-16T00:00:00.000+08:00',
      endDate: '2023-03-30T23:59:59.999+08:00',
    },
  ],
  calendarType: 'Calendar with Chinese Holiday',
  board: {
    type: 'Jira',
    verifyToken: 'mockVerifyToken',
    boardId: '1963',
    token: 'mockToken',
    site: 'mockSite',
    email: 'test@test.com',
    projectKey: 'PLL',
  },
  pipeline: 'mockToken',
  pipelineTool: {
    type: 'BuildKite',
    token: 'mockToken',
  },
  sourceControl: {
    type: 'GitHub',
    token: '',
  },
  crews: ['lucy', 'hi hi', 'Yu Zhang'],
  classification: ['type', 'Parent'],
  cycleTime: {
    type: 'byColumn',
    jiraColumns: [
      {
        'In Analysis': 'To do',
      },
      {
        'Ready For Dev': 'Analysis',
      },
    ],
  },
  reworkTimesSettings: {
    reworkState: null,
    excludeStates: [],
  },
};

export const MOCK_EXPORT_CSV_REQUEST_PARAMS: CSVReportRequestDTO = {
  csvTimeStamp: 1613664000000,
  dataType: 'pipeline',
  startDate: IMPORTED_NEW_CONFIG_FIXTURE.dateRange[0].startDate,
  endDate: IMPORTED_NEW_CONFIG_FIXTURE.dateRange[0].endDate,
};

export const MOCK_IMPORT_FILE = {
  projectName: 'Mock Project Name',
  calendarType: CHINA_CALENDAR,
  dateRange: {
    startDate: '2023-03-15T16:00:00.000Z',
    endDate: '2023-03-29T16:00:00.000Z',
  },
  metrics: [],
};

export const MOCK_DATE_RANGE = [
  {
    startDate: '2023-04-04T00:00:00+08:00',
    endDate: '2023-04-18T00:00:00+08:00',
  },
];

export const MOCK_JIRA_VERIFY_RESPONSE = {
  jiraColumns: [
    { key: 'indeterminate', value: { name: 'Doing', statuses: ['DOING'] } },
    { key: 'indeterminate', value: { name: 'TODO', statuses: ['TODO'] } },
    { key: 'indeterminate', value: { name: 'Testing', statuses: ['TESTING'] } },
    { key: 'indeterminate', value: { name: 'Blocked', statuses: ['BLOCKED'] } },
    { key: 'done', value: { name: 'Done', statuses: ['DONE', 'CANCELLED'] } },
  ],
  users: ['user 1', 'user 2', 'user 3'],
  targetFields: [
    { key: 'issuetype', name: '事务类型', flag: false },
    { key: 'parent', name: '父级', flag: false },
    { key: 'customfield_10020', name: 'Sprint', flag: false },
    { key: 'project', name: '项目', flag: false },
    { key: 'customfield_10021', name: 'Flagged', flag: false },
    { key: 'fixVersions', name: '修复版本', flag: false },
    { key: 'customfield_10000', name: 'development', flag: false },
    { key: 'priority', name: '优先级', flag: false },
    { key: 'customfield_10037', name: 'Partner', flag: false },
    { key: 'labels', name: '标签', flag: false },
    { key: 'timetracking', name: '时间跟踪', flag: false },
    { key: 'customfield_10015', name: 'Start date', flag: false },
    { key: 'customfield_10016', name: 'Story point estimate', flag: false },
    { key: 'customfield_10038', name: 'QA', flag: false },
    { key: 'customfield_10019', name: 'Rank', flag: false },
    { key: 'assignee', name: '经办人', flag: false },
    { key: 'customfield_10017', name: 'Issue color', flag: false },
    { key: 'customfield_10027', name: 'Feature/Operation', flag: false },
  ],
};

export const MOCK_BUILD_KITE_VERIFY_RESPONSE = {
  pipelineList: [
    {
      id: 'mock id',
      name: 'mock name',
      orgId: 'mock id',
      orgName: 'mock orgName',
      repository: 'mock repository url',
      steps: [],
    },
  ],
};

export const MOCK_BUILD_KITE_GET_INFO_RESPONSE = {
  pipelineList: [
    {
      id: 'mock id',
      name: 'mock name',
      orgId: 'mock id',
      orgName: 'mock orgName',
      repository: 'mock repository url',
      steps: [],
    },
  ],
};

export const MOCK_GITHUB_VERIFY_RESPONSE = {
  githubRepos: ['https://github.com/xxxx1/repo1', 'https://github.com/xxxx1/repo2'],
};

export const CREWS_SETTING = 'Crew settings';
export const BOARD_MAPPING = 'Board mappings';
export const CLASSIFICATION_SETTING = 'Classification setting';
export const REAL_DONE = 'Real done setting';
export const DEPLOYMENT_FREQUENCY_SETTINGS = 'Pipeline settings';

export enum PIPELINE_SETTING_TYPES {
  DEPLOYMENT_FREQUENCY_SETTINGS_TYPE = 'DeploymentFrequencySettings',
}

export const CONFIRM_DIALOG_DESCRIPTION = 'All the filled data will be cleared. Continue to Home page?';

export const MOCK_GET_STEPS_PARAMS = {
  params: {
    pipelineName: 'mock pipeline name',
    repository: 'mock repository',
    orgName: 'mock orgName',
    startTime: 1212112121212,
    endTime: 1313131313131,
  },
  buildId: 'mockBuildId',
  organizationId: 'mockOrganizationId',
  pipelineType: 'BuildKite',
  token: 'mockToken',
};

export const REMOVE_BUTTON = 'Remove';
export const ORGANIZATION = 'Organization';
export const PIPELINE_NAME = 'Pipeline Name';
export const STEP = 'Step';
export const BRANCH = 'Branches';

export const PR_LEAD_TIME = 'PR Lead Time';
export const PIPELINE_LEAD_TIME = 'Pipeline Lead Time';
export const TOTAL_DELAY_TIME = 'Total Lead Time';

const reportMetricsError = {
  boardMetricsError: null,
  pipelineMetricsError: null,
  sourceControlMetricsError: null,
};

export const MOCK_REPORT_RESPONSE: ReportResponseDTO = {
  velocity: {
    velocityForSP: 20,
    velocityForCards: 14,
  },
  cycleTime: {
    averageCycleTimePerCard: 30.26,
    averageCycleTimePerSP: 21.18,
    totalTimeForCards: 423.59,
    swimlaneList: [
      {
        optionalItemName: 'Analysis',
        averageTimeForSP: 8.36,
        averageTimeForCards: 11.95,
        totalTime: 167.27,
      },
      {
        optionalItemName: 'In Dev',
        averageTimeForSP: 12.13,
        averageTimeForCards: 17.32,
        totalTime: 242.51,
      },
    ],
  },
  deploymentFrequency: {
    avgDeploymentFrequency: {
      name: 'Average',
      deploymentFrequency: 0.4,
    },
    deploymentFrequencyOfPipelines: [
      {
        name: 'fs-platform-onboarding',
        step: ' :shipit: deploy to PROD',
        deploymentFrequency: 0.3,
        dailyDeploymentCounts: [
          {
            date: '9/9/2022',
            count: 1,
          },
        ],
      },
    ],
  },
  devMeanTimeToRecovery: {
    avgDevMeanTimeToRecovery: {
      name: 'Average',
      timeToRecovery: 14396108.777777776,
    },
    devMeanTimeToRecoveryOfPipelines: [
      {
        name: 'Heartbeat',
        step: ':react: Build Frontend',
        timeToRecovery: 15560177,
      },
      {
        name: 'Heartbeat',
        step: ':cloudformation: Deploy infra',
        timeToRecovery: 0,
      },
      {
        name: 'Heartbeat',
        step: ':rocket: Run e2e',
        timeToRecovery: 27628149.333333332,
      },
    ],
  },
  rework: {
    totalReworkTimes: 111,
    reworkState: 'In Dev',
    fromAnalysis: null,
    fromInDev: null,
    fromBlock: 111,
    fromFlag: null,
    fromReview: 111,
    fromWaitingForTesting: 111,
    fromTesting: null,
    fromDone: 111,
    totalReworkCards: 111,
    reworkCardsRatio: 0.8888,
    throughput: 1110,
  },
  leadTimeForChanges: {
    leadTimeForChangesOfPipelines: [
      {
        name: 'fs-platform-payment-selector',
        step: 'RECORD RELEASE TO PROD',
        prLeadTime: 2702.53,
        pipelineLeadTime: 2587.42,
        totalDelayTime: 5289.95,
      },
    ],
    avgLeadTimeForChanges: {
      name: 'Average',
      prLeadTime: 3647.51,
      pipelineLeadTime: 2341.72,
      totalDelayTime: 5989.22,
    },
  },
  devChangeFailureRate: {
    avgDevChangeFailureRate: {
      name: 'Average',
      totalTimes: 6,
      totalFailedTimes: 0,
      failureRate: 0.0,
    },
    devChangeFailureRateOfPipelines: [
      {
        name: 'fs-platform-onboarding',
        step: ' :shipit: deploy to PROD',
        failedTimesOfPipeline: 0,
        totalTimesOfPipeline: 2,
        failureRate: 0.0,
      },
    ],
  },
  classificationList: [
    {
      fieldName: 'FS Work Type',
      pairList: [
        {
          name: 'Feature Work - Planned',
          value: 0.5714,
        },
      ],
    },
  ],
  exportValidityTime: 1800000,
  boardMetricsCompleted: true,
  doraMetricsCompleted: true,
  overallMetricsCompleted: true,
  allMetricsCompleted: true,
  isSuccessfulCreateCsvFile: true,
  reportMetricsError,
};

export const MOCK_RETRIEVE_REPORT_RESPONSE = {
  callbackUrl: 'reports/123',
  interval: 10,
};

export const EMPTY_REPORT_VALUES: ReportResponseDTO = {
  velocity: null,
  classificationList: null,
  cycleTime: null,
  rework: null,
  deploymentFrequency: null,
  devChangeFailureRate: null,
  devMeanTimeToRecovery: null,
  leadTimeForChanges: null,
  exportValidityTime: null,
  boardMetricsCompleted: false,
  doraMetricsCompleted: false,
  overallMetricsCompleted: false,
  allMetricsCompleted: false,
  isSuccessfulCreateCsvFile: false,
  reportMetricsError,
};

export const CONFIG_PAGE_VERIFY_IMPORT_ERROR_MESSAGE =
  'Imported data is not perfectly matched. Please review carefully before going next!';

export const BASIC_IMPORTED_OLD_CONFIG_FIXTURE = {
  projectName: 'ConfigFileForImporting',
  metrics: ['Velocity', 'Cycle time', 'Classification', 'Lead time for changes'],
  dateRange: [{ startDate: '2023-03-16T00:00:00.000+08:00', endDate: '2023-03-30T23:59:59.999+08:00' }],
  board: {
    type: 'Classic Jira',
    verifyToken: 'mockVerifyToken',
    boardId: '1963',
    token: 'mockToken',
    site: 'mockSite',
    email: 'test@test.com',
    projectKey: 'PLL',
  },
  pipelineTool: {
    type: 'BuildKite',
    verifyToken: 'mockVerifyToken',
    token: 'mockToken',
  },
  sourceControl: {
    type: 'GitHub',
    verifyToken: 'mockVerifyToken',
    token: '',
  },
  crews: ['lucy', 'hi hi', 'Yu Zhang'],
  classifications: ['type', 'Parent'],
  cycleTime: {},
  doneStatus: ['DONE'],
  deployment: [
    {
      pipelineId: 'Heartbeat',
      step: ':rocket: Deploy prod',
      orgId: 'Thoughtworks-Heartbeat',
    },
  ],
  leadTime: [
    {
      pipelineId: 'Heartbeat',
      step: ':rocket: Deploy prod',
      orgId: 'Thoughtworks-Heartbeat',
    },
  ],
  reworkTimesSettings: {
    reworkState: null,
    excludeStates: [],
  },
};

export const ERROR_MESSAGE_TIME_DURATION = 4000;
export const CLASSIFICATION_WARNING_MESSAGE = `Some classifications in import data might be removed.`;

export const HOME_VERIFY_IMPORT_WARNING_MESSAGE =
  'The content of the imported JSON file is empty. Please confirm carefully';

export const INTERNAL_SERVER_ERROR_MESSAGE = 'Internal server error';

export const BASE_PAGE_ROUTE = '/';

export const ERROR_PAGE_ROUTE = '/error-page';

export const METRICS_PAGE_ROUTE = '/metrics';

export const ERROR_PAGE_MESSAGE =
  'Something on internet is not quite right. Perhaps head back to our homepage and try again.';

export const RETRY_BUTTON = 'Go to homepage';

export const NO_CARD_ERROR_MESSAGE =
  'Sorry there is no card within selected date range, please change your collection date!';

export const LIST_OPEN = 'Open';

export const NO_RESULT_DASH = '----';

export const MOCK_AUTOCOMPLETE_LIST = ['Option 1', 'Option 2', 'Option 3'];

export const TIME_DISPLAY_TITTLE_START = 'START';
export const TIME_DISPLAY_TITTLE_END = 'END';
export const CYCLE_TIME_SETTINGS_SECTION = 'Cycle time settings section';
export const REAL_DONE_SETTING_SECTION = 'Real done setting section';
export const SELECT_CONSIDER_AS_DONE_MESSAGE = 'Must select which you want to consider as Done';
export const MOCK_SOURCE_CONTROL_VERIFY_ERROR_CASE_TEXT = 'Token is incorrect!';
export const MOCK_PIPELINE_VERIFY_UNAUTHORIZED_TEXT = 'Token is incorrect!';
export const MOCK_PIPELINE_VERIFY_FORBIDDEN_ERROR_TEXT =
  'Forbidden request, please change your token with correct access permission.';

export const FAKE_TOKEN = 'fake-token';

export const FAKE_PIPELINE_TOKEN = 'bkua_mockTokenMockTokenMockTokenMockToken1234';

export const ADVANCED_SETTINGS_TITLE = 'Advanced settings';

export const REWORK_SETTINGS_TITLE = 'Rework times settings';
export const REWORK_TO_WHICH_STATE = 'Rework to which state';
export const REWORK_EXCLUDE_WHICH_STATE = 'Exclude which states (optional)';

export const DEFAULT_REWORK_SETTINGS = {
  reworkState: null,
  excludeStates: [],
};

export const REWORK_DIALOG_NOTE = {
  REWORK_EXPLANATION:
    'Rework to which state means going back to the selected state from any state after the selected state.',
  REWORK_NOTE:
    'The selectable states in the "rework to which state" drop-down list are the heartbeat states you matched in the board mapping.',
  EXCLUDE_EXPLANATION:
    'Exclude which states means going back to the 1st selected state from any state after the 1st selected state except the selected state.',
  EXCLUDE_NOTE:
    'The selectable states in the "Exclude which states(optional)" drop-down list are all states after the state selected in "rework to which state".',
};

export const TIME_RANGE_ERROR_MESSAGE = {
  START_DATE_INVALID_TEXT: 'Start date is invalid',
  END_DATE_INVALID_TEXT: 'End date is invalid',
};

export const COMMON_TIME_FORMAT = 'YYYY-MM-DDTHH:mm:ss.SSSZ';
