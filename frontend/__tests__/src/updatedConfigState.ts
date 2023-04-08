import { CHINA_CALENDAR } from './fixtures'
import { BOARD_TYPES, PIPELINE_TOOL_TYPES, SOURCE_CONTROL_TYPES } from '@src/constants'

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
    isVerified: false,
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
    isVerified: false,
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
    isVerified: false,
    isShow: false,
    verifiedResponse: {
      repoList: [],
    },
  },
}

export default updatedConfigState
