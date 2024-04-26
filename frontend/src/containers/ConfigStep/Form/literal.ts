import {
  IBasicInfoErrorMessage,
  IBoardConfigErrorMessage,
  IPipelineToolErrorMessage,
  ISourceControlErrorMessage,
} from '@src/containers/ConfigStep/Form/type';

export const AGGREGATED_DATE_ERROR_REASON = 'Invalid date';
export const CALENDAR_TYPE_LITERAL = ['Regular Calendar(Weekend Considered)', 'Calendar with Chinese Holiday'];
export const METRICS_LITERAL = [
  'Velocity',
  'Cycle time',
  'Classification',
  'Rework times',
  'Lead time for changes',
  'Deployment frequency',
  'Dev change failure rate',
  'Dev mean time to recovery',
];
export const BOARD_TYPE_LITERAL = ['Jira'];
export const PIPELINE_TOOL_TYPE_LITERAL = ['BuildKite'];
export const SOURCE_CONTROL_TYPE_LITERAL = ['GitHub'];

export const BASIC_INFO_ERROR_MESSAGE: IBasicInfoErrorMessage = {
  projectName: {
    required: 'Project name is required',
  },
  metrics: {
    required: 'Metrics is required',
  },
  dateRange: {
    startDate: {
      required: 'Start date is required',
      invalid: 'Start date is invalid',
    },
    endDate: {
      required: 'End date is required',
      invalid: 'End date is invalid',
    },
  },
};
export const BOARD_CONFIG_ERROR_MESSAGE: IBoardConfigErrorMessage = {
  boardId: {
    required: 'Board Id is required!',
    invalid: 'Board Id is invalid!',
    verifyFailed: 'Board Id is incorrect!',
  },
  email: {
    required: 'Email is required!',
    invalid: 'Email is invalid!',
    verifyFailed: 'Email is incorrect!',
  },
  site: {
    required: 'Site is required!',
    verifyFailed: 'Site is incorrect!',
  },
  token: {
    required: 'Token is required!',
    invalid: 'Token is invalid!',
    verifyFailed: 'Token is invalid, please change your token with correct access permission!',
    timeout: 'Timeout!',
  },
};
export const PIPELINE_TOOL_ERROR_MESSAGE: IPipelineToolErrorMessage = {
  token: {
    required: 'Token is required!',
    invalid: 'Token is invalid!',
    unauthorized: 'Token is incorrect!',
    forbidden: 'Forbidden request, please change your token with correct access permission.',
    timeout: 'Timeout!',
  },
};

export const SOURCE_CONTROL_ERROR_MESSAGE: ISourceControlErrorMessage = {
  token: {
    required: 'Token is required!',
    invalid: 'Token is invalid!',
    unauthorized: 'Token is incorrect!',
    timeout: 'Timeout!',
  },
};
