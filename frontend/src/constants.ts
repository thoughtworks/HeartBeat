import { ReportDataWithThreeColumns, ReportDataWithTwoColumns } from '@src/hooks/reportMapper/reportUIDataStructure'

export const PROJECT_NAME = 'Heartbeat'
export const DEFAULT_HELPER_TEXT = ' '

export const FIVE_HUNDRED = 500

export const ZERO = 0

export const EMPTY_STRING = ''

export const REGULAR_CALENDAR = 'Regular Calendar(Weekend Considered)'

export const CHINA_CALENDAR = 'Calendar with Chinese Holiday'

export const STEPS = ['Config', 'Metrics', 'Report']

export enum REQUIRED_DATA {
  All = 'All',
  VELOCITY = 'Velocity',
  CYCLE_TIME = 'Cycle time',
  CLASSIFICATION = 'Classification',
  LEAD_TIME_FOR_CHANGES = 'Lead time for changes',
  DEPLOYMENT_FREQUENCY = 'Deployment frequency',
  CHANGE_FAILURE_RATE = 'Change failure rate',
  MEAN_TIME_TO_RECOVERY = 'Mean time to recovery',
}

export enum CONFIG_TITLE {
  BOARD = 'Board',
  PIPELINE_TOOL = 'Pipeline Tool',
  SOURCE_CONTROL = 'Source Control',
}

export const BOARD_TYPES = {
  CLASSIC_JIRA: 'Classic Jira',
  JIRA: 'Jira',
}

export const PIPELINE_TOOL_TYPES = {
  BUILD_KITE: 'BuildKite',
  GO_CD: 'GoCD',
}

export const SOURCE_CONTROL_TYPES = {
  GITHUB: 'GitHub',
}

export enum PIPELINE_SETTING_TYPES {
  DEPLOYMENT_FREQUENCY_SETTINGS_TYPE = 'DeploymentFrequencySettings',
  LEAD_TIME_FOR_CHANGES_TYPE = 'LeadTimeForChanges',
}

export const ASSIGNEE_FILTER_TYPES = {
  LAST_ASSIGNEE: 'lastAssignee',
  HISTORICAL_ASSIGNEE: 'historicalAssignee',
}

export const EMAIL_REG_EXP = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/

export const BOARD_TOKEN_REG_EXP = /^[a-zA-Z0-9\-=_]{1,500}$/

export const BUILDKITE_TOKEN_REGEXP = /^(bkua)?_?([a-zA-Z0-9]{40})$/

export const GITHUB_TOKEN_REGEXP = /^(ghp|gho|ghu|ghs|ghr)+_+([a-zA-Z0-9]{36})$/

export const EMAIL = 'Email'

export const VERIFY_FAILED_ERROR_MESSAGE = 'verify failed'

export const UNKNOWN_ERROR_MESSAGE = 'Unknown'

export const METRICS_CONSTANTS = {
  cycleTimeEmptyStr: '----',
  doneValue: 'Done',
  doneKeyFromBackend: 'done',
  todoValue: 'To do',
  analysisValue: 'Analysis',
  inDevValue: 'In Dev',
  blockValue: 'Block',
  waitingValue: 'Waiting for testing',
  testingValue: 'Testing',
  reviewValue: 'Review',
}

export const CYCLE_TIME_LIST = [
  METRICS_CONSTANTS.cycleTimeEmptyStr,
  METRICS_CONSTANTS.todoValue,
  METRICS_CONSTANTS.analysisValue,
  METRICS_CONSTANTS.inDevValue,
  METRICS_CONSTANTS.blockValue,
  METRICS_CONSTANTS.waitingValue,
  METRICS_CONSTANTS.testingValue,
  METRICS_CONSTANTS.reviewValue,
  METRICS_CONSTANTS.doneValue,
]

export const BOARD_TOKEN = 'Token'

export const ERROR_MESSAGE_TIME_DURATION = 4000

export const TOKEN_HELPER_TEXT = {
  RequiredTokenText: 'Token is required',
  InvalidTokenText: 'Token is invalid',
}

export const DONE = 'Done'

export const SELECTED_VALUE_SEPARATOR = ', '

export const SAVE_CONFIG_TIPS =
  'Note: When you save the settings, some tokens might be saved, please save it safely (e.g. by 1 password, vault), Rotate the tokens regularly. (e.g. every 3 months)'

export enum VELOCITY_METRICS_NAME {
  VELOCITY_SP = 'Velocity(Story Point)',
  THROUGHPUT_CARDS_COUNT = 'Throughput(Cards Count)',
}

export enum CYCLE_TIME_METRICS_NAME {
  AVERAGE_CYCLE_TIME = 'Average cycle time',
  DEVELOPMENT_PROPORTION = 'Total development time / Total cycle time',
  WAITING_PROPORTION = 'Total waiting for testing time / Total cycle time',
  BLOCK_PROPORTION = 'Total block time / Total cycle time',
  REVIEW_PROPORTION = 'Total review time / Total cycle time',
  TESTING_PROPORTION = 'Total testing time / Total cycle time',
  AVERAGE_DEVELOPMENT_TIME = 'Average development time',
  AVERAGE_WAITING_TIME = 'Average waiting for testing time',
  AVERAGE_BLOCK_TIME = 'Average block time',
  AVERAGE_REVIEW_TIME = 'Average review time',
  AVERAGE_TESTING_TIME = 'Average testing time',
}

export const DEPLOYMENT_FREQUENCY_NAME = 'Deployment frequency(deployments/day)'

export const FAILURE_RATE_NAME = 'Failure rate'

export const MEAN_TIME_TO_RECOVERY_NAME = 'Mean Time To Recovery'

export const PIPELINE_STEP = 'Pipeline/step'

export const NAME = 'Name'

export const AVERAGE_FIELD = 'Average'

export enum Unit {
  PER_SP = '(days/SP)',
  PER_CARD = '(days/card)',
  HOURS = '(hours)',
}

export const INIT_REPORT_DATA_WITH_TWO_COLUMNS: ReportDataWithTwoColumns[] = [
  {
    id: 1,
    name: '',
    valueList: [{ value: 0, unit: '' }],
  },
]

export const INIT_REPORT_DATA_WITH_THREE_COLUMNS: ReportDataWithThreeColumns[] = [
  {
    id: 1,
    name: '',
    valuesList: [
      {
        name: '',
        value: '',
      },
    ],
  },
]

export const GET_STEPS_FAILED_MESSAGE = 'get steps failed'

export const HOME_VERIFY_IMPORT_WARNING_MESSAGE =
  'The content of the imported JSON file is empty. Please confirm carefully'

export const CONFIG_PAGE_VERIFY_IMPORT_ERROR_MESSAGE =
  'Imported data is not perfectly matched. Please review carefully before going next!'

export const CLASSIFICATION_WARNING_MESSAGE = `Some classifications in import data might be removed.`

export const REAL_DONE_WARNING_MESSAGE = 'Some selected doneStatus in import data might be removed'

export const ORGANIZATION_WARNING_MESSAGE = 'This organization in import data might be removed'

export const PIPELINE_NAME_WARNING_MESSAGE = 'This Pipeline in import data might be removed'

export const STEP_WARNING_MESSAGE = 'Selected step of this pipeline in import data might be removed'

export const NO_STEP_WARNING_MESSAGE =
  'There is no step during this period for this pipeline! Please change the search time in the Config page!'

export const HOME_PAGE_ROUTE = '/home'

export const ERROR_PAGE_ROUTE = '/error-page'

export const METRICS_PAGE_ROUTE = '/metrics'

export const ERROR_PAGE_MESSAGE =
  'Something on internet is not quite right. Perhaps head back to our homepage and try again.'

export const Z_INDEX = {
  DEFAULT: 0,
  BUTTONS: 1,
  INPUTS: 2,
  INPUT_GROUPS: 3,
  DROPDOWN: 1000,
  SNACKBARS: 1010,
  MODAL_BACKDROP: 1020,
  MODAL: 1030,
  POPOVER: 1040,
  TOOLTIP: 1050,
  STICKY: 1060,
  FIXED: 1070,
}

export const METRICS_STEPS = {
  CONFIG: 0,
  METRICS: 1,
  REPORT: 2,
}

export const HEADER_NOTIFICATION_MESSAGE = {
  FIRST_REPORT: 'The file needs to be exported within %s minutes, otherwise it will expire.',
  EXPIRE_IN_FIVE_MINUTES: 'The file will expire in 5 minutes, please download it in time.',
}

export const REPORT_LOADING_MESSAGE =
  'Report is being generated, please do not refresh the page otherwise all the data will be disappear.'
