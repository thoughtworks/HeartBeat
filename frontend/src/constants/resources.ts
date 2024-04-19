import { AxiosError } from 'axios';

export const CALENDAR = {
  REGULAR: 'Regular Calendar(Weekend Considered)',
  CHINA: 'Calendar with Chinese Holiday',
};

export const REPORT_PAGE_TYPE = {
  SUMMARY: 'Summary',
  BOARD: 'BoardReport',
  DORA: 'DoraReport',
};

export const SHOW_MORE = 'show more >';
export const BACK = 'Back';
export const RETRY = 'retry';
export const DATA_LOADING_FAILED = 'Data loading failed';
export const DEFAULT_MESSAGE = '';

export const NOTIFICATION_TITLE = {
  HELP_INFORMATION: 'Help Information',
  PLEASE_NOTE_THAT: 'Please note that',
  SUCCESSFULLY_COMPLETED: 'Successfully completed!',
  SOMETHING_WENT_WRONG: 'Something went wrong!',
};

export const BOARD_METRICS_MAPPING: Record<string, string> = {
  'Cycle time': 'cycleTime',
  Velocity: 'velocity',
  Classification: 'classificationList',
  'Rework times': 'rework',
};

export const DORA_METRICS_MAPPING: Record<string, string> = {
  'Lead time for changes': 'leadTimeForChanges',
  'Deployment frequency': 'deploymentFrequency',
  'Dev change failure rate': 'devChangeFailureRate',
  'Dev mean time to recovery': 'devMeanTimeToRecovery',
};

export enum REQUIRED_DATA {
  VELOCITY = 'Velocity',
  CYCLE_TIME = 'Cycle time',
  CLASSIFICATION = 'Classification',
  REWORK_TIMES = 'Rework times',
  LEAD_TIME_FOR_CHANGES = 'Lead time for changes',
  DEPLOYMENT_FREQUENCY = 'Deployment frequency',
  DEV_CHANGE_FAILURE_RATE = 'Dev change failure rate',
  DEV_MEAN_TIME_TO_RECOVERY = 'Dev mean time to recovery',
}

export const IMPORT_METRICS_MAPPING: Record<string, string> = {
  Velocity: 'Velocity',
  'Cycle time': 'Cycle time',
  Classification: 'Classification',
  'Rework times': 'Rework times',
  'Lead time for changes': 'Lead time for changes',
  'Deployment frequency': 'Deployment frequency',
  'Dev change failure rate': 'Dev change failure rate',
  'Dev mean time to recovery': 'Dev mean time to recovery',
  'Change failure rate': 'Dev change failure rate',
  'Mean time to recovery': 'Dev mean time to recovery',
};

export enum METRICS_TITLE {
  VELOCITY = 'Velocity',
  CYCLE_TIME = 'Cycle Time',
  CLASSIFICATION = 'Classification',
  REWORK = 'Rework',
  LEAD_TIME_FOR_CHANGES = 'Lead Time For Changes',
  DEPLOYMENT_FREQUENCY = 'Deployment Frequency',
  DEV_CHANGE_FAILURE_RATE = 'Dev Change Failure Rate',
  DEV_MEAN_TIME_TO_RECOVERY = 'Dev Mean Time To Recovery',
}

export enum METRICS_SUBTITLE {
  PR_LEAD_TIME = 'PR Lead Time(Hours)',
  PIPELINE_LEAD_TIME = 'Pipeline Lead Time(Hours)',
  TOTAL_DELAY_TIME = 'Total Lead Time(Hours)',
  DEPLOYMENT_FREQUENCY = '(Deployments/Days)',
  DEV_MEAN_TIME_TO_RECOVERY_HOURS = '(Hours)',
  FAILURE_RATE = '',
  AVERAGE_CYCLE_TIME_PRE_SP = 'Average Cycle Time(Days/SP)',
  AVERAGE_CYCLE_TIME_PRE_CARD = 'Average Cycle Time(Days/Card)',
  THROUGHPUT = 'Throughput(Cards Count)',
  VELOCITY = 'Velocity(Story Point)',
  TOTAL_REWORK_TIMES = 'Total rework times',
  TOTAL_REWORK_CARDS = 'Total rework cards',
  REWORK_CARDS_RATIO = 'Rework cards ratio',
}

export const SOURCE_CONTROL_METRICS: string[] = [REQUIRED_DATA.LEAD_TIME_FOR_CHANGES];

export const PIPELINE_METRICS: string[] = [
  REQUIRED_DATA.DEPLOYMENT_FREQUENCY,
  REQUIRED_DATA.DEV_CHANGE_FAILURE_RATE,
  REQUIRED_DATA.DEV_MEAN_TIME_TO_RECOVERY,
];

export const DORA_METRICS: string[] = [
  REQUIRED_DATA.LEAD_TIME_FOR_CHANGES,
  REQUIRED_DATA.DEPLOYMENT_FREQUENCY,
  REQUIRED_DATA.DEV_CHANGE_FAILURE_RATE,
  REQUIRED_DATA.DEV_MEAN_TIME_TO_RECOVERY,
];

export const BOARD_METRICS: string[] = [
  REQUIRED_DATA.VELOCITY,
  REQUIRED_DATA.CYCLE_TIME,
  REQUIRED_DATA.CLASSIFICATION,
  REQUIRED_DATA.REWORK_TIMES,
];

export enum CONFIG_TITLE {
  BOARD = 'Board',
  PIPELINE_TOOL = 'Pipeline Tool',
  SOURCE_CONTROL = 'Source Control',
}

export const BOARD_TYPES = {
  JIRA: 'Jira',
};

export const PIPELINE_TOOL_TYPES = {
  BUILD_KITE: 'BuildKite',
};

export enum SOURCE_CONTROL_TYPES {
  GITHUB = 'GitHub',
}

export enum PIPELINE_SETTING_TYPES {
  DEPLOYMENT_FREQUENCY_SETTINGS_TYPE = 'DeploymentFrequencySettings',
  LEAD_TIME_FOR_CHANGES_TYPE = 'LeadTimeForChanges',
}

export const ASSIGNEE_FILTER_TYPES = {
  LAST_ASSIGNEE: 'lastAssignee',
  HISTORICAL_ASSIGNEE: 'historicalAssignee',
};

export const EMAIL = 'Email';

export const BOARD_TOKEN = 'Token';

export const DONE = 'Done';

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
};

export const CYCLE_TIME_LIST = [
  METRICS_CONSTANTS.cycleTimeEmptyStr,
  METRICS_CONSTANTS.todoValue,
  METRICS_CONSTANTS.analysisValue,
  METRICS_CONSTANTS.inDevValue,
  METRICS_CONSTANTS.blockValue,
  METRICS_CONSTANTS.reviewValue,
  METRICS_CONSTANTS.waitingValue,
  METRICS_CONSTANTS.testingValue,
  METRICS_CONSTANTS.doneValue,
];

export const REWORK_TIME_LIST = [
  METRICS_CONSTANTS.todoValue,
  METRICS_CONSTANTS.analysisValue,
  METRICS_CONSTANTS.inDevValue,
  METRICS_CONSTANTS.blockValue,
  METRICS_CONSTANTS.reviewValue,
  METRICS_CONSTANTS.waitingValue,
  METRICS_CONSTANTS.testingValue,
];

export const TOKEN_HELPER_TEXT = {
  RequiredTokenText: 'Token is required!',
  InvalidTokenText: 'Token is invalid!',
};

export const TIPS = {
  SAVE_CONFIG:
    'Note: When you save the settings, some tokens might be saved, please save it safely (e.g. by 1 password, vault), Rotate the tokens regularly. (e.g. every 3 months)',
  CYCLE_TIME: 'The report page will sum all the status in the column for cycletime calculation',
  ADVANCE:
    'If the story point and block related values in the board data are 0 due to token permissions or other reasons, please manually enter the corresponding customized field key.Otherwise, please ignore it.',
  TIME_RANGE_PICKER: 'The report page will generate charts to compare metrics data over multiple time ranges',
};

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

export const REWORK_TIME_MAPPING = {
  totalReworkTimes: 'Total rework',
  fromAnalysis: 'analysis',
  fromInDev: 'in dev',
  fromBlock: 'block',
  fromReview: 'review',
  fromWaitingForTesting: 'waiting for testing',
  fromTesting: 'testing',
  fromDone: 'done',
  totalReworkCards: 'Total rework cards',
  reworkCardsRatio: 'Rework cards ratio',
};

export const REWORK_BOARD_STATUS: string[] = [
  REWORK_TIME_MAPPING.fromAnalysis,
  REWORK_TIME_MAPPING.fromInDev,
  REWORK_TIME_MAPPING.fromBlock,
  REWORK_TIME_MAPPING.fromWaitingForTesting,
  REWORK_TIME_MAPPING.fromTesting,
  REWORK_TIME_MAPPING.fromReview,
  REWORK_TIME_MAPPING.fromDone,
];

export const DEPLOYMENT_FREQUENCY_NAME = 'Deployment frequency';

export const DEV_FAILURE_RATE_NAME = 'Dev change failure rate';

export const DEV_MEAN_TIME_TO_RECOVERY_NAME = 'Dev mean time to recovery';

export const PIPELINE_STEP = 'Pipeline/step';

export const SUBTITLE = 'Subtitle';

export const AVERAGE_FIELD = 'Average';

export enum REPORT_SUFFIX_UNITS {
  PER_SP = '(Days/SP)',
  PER_CARD = '(Days/Card)',
  HOURS = '(Hours)',
  DEPLOYMENTS_DAY = '(Deployments/Day)',
}

export const MESSAGE = {
  VERIFY_FAILED_ERROR: 'verify failed',
  VERIFY_MAIL_FAILED_ERROR: 'Email is incorrect!',
  VERIFY_TOKEN_FAILED_ERROR: 'Token is invalid, please change your token with correct access permission!',
  VERIFY_SITE_FAILED_ERROR: 'Site is incorrect!',
  VERIFY_BOARD_FAILED_ERROR: 'Board Id is incorrect!',
  UNKNOWN_ERROR: 'Unknown',
  GET_STEPS_FAILED: 'Failed to get',
  HOME_VERIFY_IMPORT_WARNING: 'The content of the imported JSON file is empty. Please confirm carefully',
  CONFIG_PAGE_VERIFY_IMPORT_ERROR: 'Imported data is not perfectly matched. Please review carefully before going next!',
  CLASSIFICATION_WARNING: 'Some classifications in import data might be removed.',
  FLAG_CARD_DROPPED_WARNING: 'Please note: ’consider the “Flag” as “Block” ‘ has been dropped!',
  REAL_DONE_WARNING: 'Some selected doneStatus in import data might be removed',
  ORGANIZATION_WARNING: 'This organization in import data might be removed',
  PIPELINE_NAME_WARNING: 'This Pipeline in import data might be removed',
  STEP_WARNING: 'Selected step of this pipeline in import data might be removed',
  NO_STEP_WARNING:
    'There is no step during these periods for this pipeline! Please change the search time in the Config page!',
  ERROR_PAGE: 'Something on internet is not quite right. Perhaps head back to our homepage and try again.',
  EXPIRE_INFORMATION: (value: number) => `The file will expire in ${value} minutes, please download it in time.`,
  REPORT_LOADING: 'The report is being generated, please do not refresh the page or all the data will be disappeared.',
  LOADING_TIMEOUT: (name: string) => `${name} loading timeout, please click "Retry"!`,
  FAILED_TO_GET_DATA: (name: string) => `Failed to get ${name} data, please click "retry"!`,
  FAILED_TO_GET_CLASSIFICATION_DATA:
    'Failed to get Classification data, please go back to previous page and try again!',
  FAILED_TO_EXPORT_CSV: 'Failed to export csv.',
  FAILED_TO_REQUEST: 'Failed to request!',
};

export const METRICS_CYCLE_SETTING_TABLE_HEADER_BY_COLUMN = [
  {
    text: 'Board Column',
    emphasis: false,
  },
  {
    text: 'Board Status',
    emphasis: false,
  },
  {
    text: 'Heartbeat State',
    emphasis: true,
  },
];

export const METRICS_CYCLE_SETTING_TABLE_HEADER_BY_STATUS = [
  {
    text: 'Board Status',
    emphasis: false,
  },
  {
    text: 'Board Column',
    emphasis: false,
  },
  {
    text: 'Heartbeat State',
    emphasis: true,
  },
];

export const REPORT_PAGE = {
  BOARD: {
    TITLE: 'Board Metrics',
  },
  DORA: {
    TITLE: 'DORA Metrics',
  },
};

export enum CYCLE_TIME_SETTINGS_TYPES {
  BY_COLUMN = 'byColumn',
  BY_STATUS = 'byStatus',
}

export const AXIOS_NETWORK_ERROR_CODES = [AxiosError.ECONNABORTED, AxiosError.ETIMEDOUT, AxiosError.ERR_NETWORK];

export const NO_PIPELINE_STEP_ERROR = 'No steps for this pipeline!';

export enum AXIOS_REQUEST_ERROR_CODE {
  TIMEOUT = 'NETWORK_TIMEOUT',
}

export const BOARD_CONFIG_INFO_TITLE = {
  FORBIDDEN_REQUEST: 'Forbidden request!',
  INVALID_INPUT: 'Invalid input!',
  UNAUTHORIZED_REQUEST: 'Unauthorized request!',
  NOT_FOUND: 'Not found!',
  NO_CONTENT: 'No card within selected date range!',
  GENERAL_ERROR: 'Failed to get the board configuration!',
  EMPTY: '',
};

export const BOARD_CONFIG_INFO_ERROR = {
  FORBIDDEN: 'Please go back to the previous page and change your board token with correct access permission.',
  NOT_FOUND: 'Please go back to the previous page and check your board info!',
  NOT_CONTENT: 'Please go back to the previous page and change your collection date, or check your board info!',
  GENERAL_ERROR: 'Please go back to the previous page to check your board info, or change your time range!',
  RETRY: 'Data loading failed, please',
};

export const PIPELINE_TOOL_VERIFY_ERROR_CASE_TEXT_MAPPING: { [key: string]: string } = {
  '401': 'Token is incorrect!',
  '403': 'Forbidden request, please change your token with correct access permission.',
};

export const PIPELINE_TOOL_GET_INFO_ERROR_CASE_TEXT_MAPPING: { [key: string]: string } = {
  '204': 'No pipeline!',
  '400': 'Invalid input!',
  '401': 'Unauthorized request!',
  '403': 'Forbidden request!',
  '404': 'Not found!',
};

export const UNKNOWN_ERROR_TITLE = 'Unknown error';

export const PIPELINE_TOOL_GET_INFO_ERROR_MESSAGE =
  'Please go back to the previous page and change your pipeline token with correct access permission.';

export const PIPELINE_TOOL_RETRY_MESSAGE = 'Data loading failed, please';
export const PIPELINE_TOOL_RETRY_TRIGGER_MESSAGE = ' try again';

export const SOURCE_CONTROL_VERIFY_ERROR_CASE_TEXT_MAPPING: Record<string, string> = {
  '401': 'Token is incorrect!',
};

export const SOURCE_CONTROL_GET_INFO_ERROR_CASE_TEXT_MAPPING: Record<string, string> = {
  '401': 'Token is incorrect!',
  '403': 'Unable to read target branch, please check the token or target branch!',
};

export const SOURCE_CONTROL_BRANCH_INVALID_TEXT: Record<string, string> = {
  '400': 'The codebase branch marked in red is invalid!',
  '401': 'Can not read target branch due to unauthorized token!',
  '404': 'The branch has been deleted!',
};

export const ALL_OPTION_META: Record<string, string> = {
  label: 'All',
  key: 'all',
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

export const REWORK_STEPS = {
  REWORK_TO_WHICH_STATE: 0,
  EXCLUDE_WHICH_STATES: 1,
};

export const REWORK_STEPS_NAME = ['Rework to which state', 'Exclude which states'];

export const DEFAULT_SPRINT_INTERVAL_OFFSET_DAYS = 13;

export const GENERATE_GITHUB_TOKEN_LINK =
  'https://github.com/au-heartbeat/Heartbeat?tab=readme-ov-file#3133-guideline-for-generating-github-token';
export const AUTHORIZE_ORGANIZATION_LINK =
  'https://github.com/au-heartbeat/Heartbeat?tab=readme-ov-file#3134-authorize-github-token-with-correct-organization';

export const DEFAULT_MONTH_INTERVAL_DAYS = 30;
export const DATE_RANGE_FORMAT = 'YYYY-MM-DDTHH:mm:ss.SSSZ';
export const TIME_RANGE_TITLE = 'Time range settings';
export const ADD_TIME_RANGE_BUTTON_TEXT = 'New time range';
export const REMOVE_BUTTON_TEXT = 'Remove';
export const MAX_TIME_RANGE_AMOUNT = 6;
export const START_DATE_INVALID_TEXT = 'Start date is invalid';
export const END_DATE_INVALID_TEXT = 'End date is invalid';

export enum SORTING_DATE_RANGE_TEXT {
  DEFAULT = 'Default sort',
  ASCENDING = 'Ascending',
  DESCENDING = 'Descending',
}

export const BLOCK_COLUMN_NAME = ['BLOCKED', 'BLOCK'];
