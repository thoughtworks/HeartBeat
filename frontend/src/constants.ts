export const PROJECT_NAME = 'Heartbeat'
export const DEFAULT_HELPER_TEXT = ' '

export const FIVE_HUNDRED = 500

export const ZERO = 0

export const EMPTY_STRING = ''

export const REGULAR_CALENDAR = 'Regular Calendar(Weekend Considered)'

export const CHINA_CALENDAR = 'Calendar with Chinese Holiday'

export const STEPS = ['Config', 'Metrics', 'Report']

export enum DATE_RANGE {
  START_DATE = 0,
  END_DATE = 1,
}

export enum CONFIG_TITLE {
  BOARD = 'Board',
  PIPELINE_TOOL = 'Pipeline Tool',
  SOURCE_CONTROL = 'Source Control',
}

export enum REQUIRED_DATA {
  VELOCITY = 'Velocity',
  CYCLE_TIME = 'Cycle time',
  CLASSIFICATION = 'Classification',
  LEAD_TIME_FOR_CHANGES = 'Lead time for changes',
  DEPLOYMENT_FREQUENCY = 'Deployment frequency',
  CHANGE_FAILURE_RATE = 'Change failure rate',
  MEAN_TIME_TO_RECOVERY = 'Mean time to recovery',
}

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
  GITHUB: 'Github',
}

export const EMAIL_REG_EXP = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/

export const BOARD_TOKEN_REG_EXP = /^[a-zA-Z0-9\-=_]{1,500}$/

export const BUILDKITE_TOKEN_REGEXP = /^[A-Za-z0-9]{40}$/

export const GITHUB_TOKEN_REGEXP = /^(ghp|gho|ghu|ghs|ghr)+_+([a-zA-Z0-9]{36})$/

export const EMAIL = 'Email'

export const METRICS_CONSTANTS = {
  cycleTimeEmptyStr: '----',
  doneValue: 'Done',
  doneKeyFromBackend: 'done',
  todoValue: 'To do',
  analysisValue: 'Analysis',
  inDevValue: 'In dev',
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

export const ERROR_MESSAGE_TIME_DURATION = 2000

export const TOKEN_HELPER_TEXT = {
  RequiredTokenText: 'Token is required',
  InvalidTokenText: 'Token is invalid',
}

export const DONE = 'Done'

export const SELECTED_VALUE_SEPARATOR = ', '

export const SAVE_CONFIG_TIPS =
  'Note: When you save the settings, some tokens might be saved, please save it safely (e.g. by 1 password, vault), Rotate the tokens regularly. (e.g. every 3 months)'
