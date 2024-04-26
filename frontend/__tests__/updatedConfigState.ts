import { BOARD_TYPES, CHINA_CALENDAR, CONFIG_PAGE_VERIFY_IMPORT_ERROR_MESSAGE, PIPELINE_TOOL_TYPES } from './fixtures';
import { SOURCE_CONTROL_TYPES } from '@src/constants/resources';

const updatedConfigState = {
  isProjectCreated: true,
  basic: {
    projectName: 'Mock Project Name',
    calendarType: CHINA_CALENDAR,
    dateRange: {
      startDate: '2023-03-15T16:00:00.000Z',
      endDate: '2023-03-29T16:00:00.000Z',
    },
    metrics: [],
  },
  board: {
    config: {
      type: BOARD_TYPES.JIRA,
      boardId: '',
      email: '',
      projectKey: '',
      site: '',
      token: '',
    },
    isShow: false,
    verifiedResponse: {
      jiraColumns: [],
      targetFields: [],
      users: [],
    },
  },
  pipelineTool: {
    config: {
      type: PIPELINE_TOOL_TYPES.BUILD_KITE,
      token: '',
    },
    isShow: false,
    verifiedResponse: {
      pipelineList: [],
    },
  },
  sourceControl: {
    config: {
      type: SOURCE_CONTROL_TYPES.GITHUB,
      token: '',
    },
    isShow: false,
    verifiedResponse: {
      repoList: [],
    },
  },
  warningMessage: CONFIG_PAGE_VERIFY_IMPORT_ERROR_MESSAGE,
};

export default updatedConfigState;
