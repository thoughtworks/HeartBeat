import { BOARD_TYPES, PIPELINE_TOOL_TYPES, REGULAR_CALENDAR } from './fixtures';
import { SortType } from '@src/containers/ConfigStep/DateRangePicker/types';
import { BasicConfigState } from '@src/context/config/configSlice';
import { SOURCE_CONTROL_TYPES } from '@src/constants/resources';

const initialConfigState: BasicConfigState = {
  isProjectCreated: true,
  basic: {
    projectName: '',
    calendarType: REGULAR_CALENDAR,
    dateRange: [
      {
        startDate: null,
        endDate: null,
      },
    ],
    sortType: SortType.DEFAULT,
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
  warningMessage: null,
};

export default initialConfigState;
