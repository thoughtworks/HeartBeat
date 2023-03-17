export const PROJECT_NAME = 'Heartbeat'
export const PROJECT_DESCRIPTION =
  'Heartbeat is a tool for tracking project delivery metrics that can help you get a better understanding of delivery performance. This product allows you easily get all aspects of source data faster and more accurate to analyze team delivery performance which enables delivery teams and team leaders focusing on driving continuous improvement and enhancing team productivity and efficiency.'

export const ZERO = 0

export const REGULAR_CALENDAR = 'Regular Calendar(Weekend Considered)'

export const CHINA_CALENDAR = 'Calendar with Chinese Holiday'

export const NEXT = 'Next'

export const BACK = 'Back'

export const VERIFY = 'Verify'

export const RESET = 'Reset'

export const VERIFIED = 'Verified'

export const TOKEN_ERROR_MESSAGE = ['Token is invalid', 'Token is required']

export const PROJECT_NAME_LABEL = 'Project Name'

export const EXPORT_BOARD_DATA = 'Export board data'

export const STEPS = ['Config', 'Metrics', 'Export']

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

export enum CONFIG_TITLE {
  BOARD = 'Board',
  PIPELINE_TOOL = 'Pipeline Tool',
  SOURCE_CONTROL = 'Source Control',
}

export const BOARD_FIELDS = ['Board', 'Board Id', 'Email', 'Project Key', 'Site', 'Token']
export const PIPELINE_TOOL_FIELDS = ['Pipeline Tool', 'Token']
export const SOURCE_CONTROL_FIELDS = ['Source Control', 'Token']

export const MOCK_BOARD_URL = '/api/v1/boards/jira'
export const MOCK_PIPELINE_URL = '/api/v1/pipelines/buildkite'
export const MOCK_SOURCE_CONTROL_URL = '/api/v1/source-control'

export enum JIRA_VERIFY_ERROR_MESSAGE {
  BAD_REQUEST = 'Jira verify failed: Please reconfirm the input',
  UNAUTHORIZED = 'Jira verify failed: Token is incorrect',
  INTERNAL_SERVER_ERROR = 'Jira verify failed: Internal server error',
}

export enum PIPELINE_TOOL_VERIFY_ERROR_MESSAGE {
  BAD_REQUEST = 'BuildKite verify failed: Bad request',
  UNAUTHORIZED = 'BuildKite verify failed: Token is incorrect',
  INTERNAL_SERVER_ERROR = 'BuildKite verify failed: Internal server error',
}

export enum GITHUB_VERIFY_ERROR_MESSAGE {
  BAD_REQUEST = 'Github verify failed: Bad request',
  UNAUTHORIZED = 'Github verify failed: Token is incorrect',
  INTERNAL_SERVER_ERROR = 'Github verify failed: Internal server error',
}

export const MOCK_BOARD_VERIFY_REQUEST_PARAMS = {
  token: 'mockToken',
  type: BOARD_TYPES.JIRA,
  site: '1',
  projectKey: '1',
  startTime: '1613664000000',
  endTime: '1614873600000',
  boardId: '1',
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

export const CREWS_SETTING = 'Crews Setting'
export const CYCLE_TIME_SETTINGS = 'Cycle Time Settings'
export const CLASSIFICATION_SETTING = 'Classification Setting'
export const REAL_DONE = 'Real Done'
