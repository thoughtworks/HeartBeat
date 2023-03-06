export const PROJECT_NAME = 'Heartbeat'

export const FIVE_HUNDRED = 500

export const ZERO = 0

export const REGULAR_CALENDAR = 'Regular Calendar(Weekend Considered)'

export const CHINA_CALENDAR = 'Calendar with Chinese Holiday'

export const STEPS = ['Config', 'Metrics', 'Export']

export enum DATE_RANGE {
  START_DATE = 0,
  END_DATE = 1,
}

export enum CONFIG_TITLE {
  BOARD = 'Board',
  PIPELINE_TOOL = 'PipelineTool',
}

export const SELECT_OR_WRITE_DATE = 'Select Or Write Date'

export const REQUIRED_DATA_LIST = [
  'Velocity',
  'Cycle time',
  'Classification',
  'Lead time for changes',
  'Deployment frequency',
  'Change failure rate',
  'Mean time to recovery',
]

export const BOARD_TYPES = {
  CLASSIC_JIRA: 'Classic Jira',
  JIRA: 'Jira',
  LINEAR: 'Linear',
}

export const PIPELINE_TOOL_TYPES = {
  BUILD_KITE: 'BuildKite',
  GO_CD: 'GoCD',
}

export const emailRegExp = /^[a-zA-Z0-9_-]+@[a-zA-Z0-9_-]+(\.[a-zA-Z0-9_-]+)+$/

export const EMAIL = 'Email'

export const TOKEN_ERROR_MESSAGE = 'Token is required'
