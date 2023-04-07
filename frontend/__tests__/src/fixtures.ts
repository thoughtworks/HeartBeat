export const PROJECT_NAME = 'Heartbeat'
export const PROJECT_DESCRIPTION =
  'Heartbeat is a tool for tracking project delivery metrics that can help you get a better understanding of delivery performance. This product allows you easily get all aspects of source data faster and more accurate to analyze team delivery performance which enables delivery teams and team leaders focusing on driving continuous improvement and enhancing team productivity and efficiency.'

export const ZERO = 0

export const REGULAR_CALENDAR = 'Regular Calendar(Weekend Considered)'

export const CHINA_CALENDAR = 'Calendar with Chinese Holiday'

export const NEXT = 'Next'

export const BACK = 'Back'

export const SAVE = 'Save'

export const VERIFY = 'Verify'

export const RESET = 'Reset'

export const VERIFIED = 'Verified'

export const TOKEN_ERROR_MESSAGE = ['Token is invalid', 'Token is required']

export const PROJECT_NAME_LABEL = 'Project Name'

export const EXPORT_BOARD_DATA = 'Export board data'

export const STEPS = ['Config', 'Metrics', 'Report']

export const REQUIRED_DATA_LIST = [
  'Velocity',
  'Cycle time',
  'Classification',
  'Lead time for changes',
  'Deployment frequency',
  'Change failure rate',
  'Mean time to recovery',
]
export const VELOCITY = 'Velocity'
export const CYCLE_TIME = 'Cycle time'
export const REQUIRED_DATA = 'Required Data'
export const LEAD_TIME_FOR_CHANGES = 'Lead time for changes'
export const TEST_PROJECT_NAME = 'test project Name'
export const ERROR_MESSAGE_COLOR = 'color: #d32f2f'
export const ERROR_DATE = '02/03/'
export const PAST_DATE = '08/02/2022'
export const CREATE_NEW_PROJECT = 'Create a new project'
export const IMPORT_PROJECT_FROM_FILE = 'Import project from file'

export const BOARD_TYPES = {
  CLASSIC_JIRA: 'Classic Jira',
  JIRA: 'Jira',
  LINEAR: 'Linear',
}

export const PIPELINE_TOOL_TYPES = {
  BUILD_KITE: 'BuildKite',
  GO_CD: 'GoCD',
}

export const SOURCE_CONTROL_TYPES = {
  GITHUB: 'GitHub',
}

export enum CONFIG_TITLE {
  BOARD = 'Board',
  PIPELINE_TOOL = 'Pipeline Tool',
  SOURCE_CONTROL = 'Source Control',
}

export const BOARD_FIELDS = ['Board', 'Board Id', 'Email', 'Project Key', 'Site', 'Token']
export const PIPELINE_TOOL_FIELDS = ['Pipeline Tool', 'Token']
export const SOURCE_CONTROL_FIELDS = ['Source Control', 'Token']

const BASE_URL = 'api/v1'
export const MOCK_BOARD_URL_FOR_JIRA = `${BASE_URL}/boards/jira`
export const MOCK_BOARD_URL_FOR_CLASSIC_JIRA = `${BASE_URL}/boards/classic-jira`
export const MOCK_PIPELINE_URL = `${BASE_URL}/pipelines/buildkite`
export const MOCK_SOURCE_CONTROL_URL = `${BASE_URL}/source-control`
export const MOCK_REPORT_URL = `${BASE_URL}/report`

export enum VERIFY_ERROR_MESSAGE {
  BAD_REQUEST = 'Please reconfirm the input',
  UNAUTHORIZED = 'Token is incorrect',
  INTERNAL_SERVER_ERROR = 'Internal server error',
  NOT_FOUND = '404 Not Found',
  UNKNOWN = 'Unknown',
}
export const VERIFY_FAILED = 'verify failed'

export const MOCK_BOARD_VERIFY_REQUEST_PARAMS = {
  token: 'mockToken',
  type: BOARD_TYPES.JIRA,
  site: '1',
  projectKey: '1',
  startTime: '1613664000000',
  endTime: '1614873600000',
  boardId: '1',
}

export const MOCK_CLASSIC_JIRA_BOARD_VERIFY_REQUEST_PARAMS = {
  token: 'mockToken',
  type: BOARD_TYPES.CLASSIC_JIRA,
  site: '2',
  projectKey: '2',
  startTime: '1613664000000',
  endTime: '1614873600000',
  boardId: '2',
}

export const MOCK_PIPELINE_VERIFY_REQUEST_PARAMS = {
  token: 'mockToken',
  type: PIPELINE_TOOL_TYPES.BUILD_KITE,
  startTime: '1613664000000',
  endTime: '1614873600000',
}

export const MOCK_SOURCE_CONTROL_VERIFY_REQUEST_PARAMS = {
  token: 'mockToken',
  type: SOURCE_CONTROL_TYPES.GITHUB,
  startTime: '1613664000000',
  endTime: '1614873600000',
}

export const MOCK_GENERATE_REPORT_REQUEST_PARAMS = {
  metrics: [],
  pipeline: {
    token: 'mockToken',
    type: PIPELINE_TOOL_TYPES.BUILD_KITE,
  },
  board: {
    token: 'mockToken',
    type: BOARD_TYPES.CLASSIC_JIRA,
    site: '2',
    email: '1@qq.com',
    projectKey: '2',
    boardId: '2',
  },
  sourceControl: {
    token: 'mockToken',
    type: SOURCE_CONTROL_TYPES.GITHUB,
  },
  calendarType: REGULAR_CALENDAR,
  startTime: '1613664000000',
  endTime: '1614873600000',
}

export const MOCK_IMPORT_FILE = {
  projectName: 'Mock Project Name',
  calendarType: CHINA_CALENDAR,
  dateRange: {
    startDate: '2023-03-15T16:00:00.000Z',
    endDate: '2023-03-29T16:00:00.000Z',
  },
  metrics: [],
}

export const MOCK_RESPONSE_SLICE_INIT_STATE = {
  board: {
    jira: {
      jiraColumns: [],
      users: [],
      targetFields: [],
    },
  },
  pipelineTool: {
    buildKite: {
      pipelineList: [],
    },
  },
  sourceControl: {
    github: {
      githubRepos: [],
    },
  },
}

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
}

export const MOCK_BUILD_KITE_VERIFY_RESPONSE = {
  pipelineList: {
    id: 'mock id',
    name: 'mock name',
    orgId: 'mock id',
    orgName: 'mock orgName',
    repository: 'mock repository url',
    steps: [],
  },
}

export const MOCK_GITHUB_VERIFY_RESPONSE = {
  githubRepos: ['https://github.com/xxxx1/repo1', 'https://github.com/xxxx1/repo2'],
}

export const CREWS_SETTING = 'Crews Setting'
export const CYCLE_TIME_SETTINGS = 'Cycle Time Settings'
export const CLASSIFICATION_SETTING = 'Classification Setting'
export const REAL_DONE = 'Real Done'
export const DEPLOYMENT_FREQUENCY_SETTINGS = 'Deployment Frequency Settings'
export const CONFIRM_DIALOG_DESCRIPTION = 'All the filled data will be cleared. Continue to Home page?'

export enum VelocityMetric {
  VELOCITY_SP = 'Velocity(SP)',
  THROUGHPUT_CARDS_COUNT = 'ThroughPut(Cards Count)',
}
