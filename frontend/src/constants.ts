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

export const SELECT_OR_WRITE_DATE = 'Select Or Write Date'

export const REQUIRE_DATA = [
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

export const BOARD_FIELDS = ['board', 'boardId', 'email', 'projectKey', 'site', 'token']
export const emailRegExp = /^[a-zA-Z0-9_-]+@[a-zA-Z0-9_-]+(\.[a-zA-Z0-9_-]+)+$/

export const INIT_BOARD_BOARD_STATE = {
  board: { value: BOARD_TYPES.JIRA, isError: false, helpText: '' },
  boardId: { value: '', isError: false, helpText: '' },
  email: { value: '', isError: false, helpText: '' },
  projectKey: { value: '', isError: false, helpText: '' },
  site: { value: '', isError: false, helpText: '' },
  token: { value: '', isError: false, helpText: '' },
}

export const EMAIL = 'email'
