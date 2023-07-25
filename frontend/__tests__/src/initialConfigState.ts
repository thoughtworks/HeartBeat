import { REGULAR_CALENDAR } from './fixtures'
import { BOARD_TYPES, PIPELINE_TOOL_TYPES, SOURCE_CONTROL_TYPES } from '@src/constants'
import { BasicConfigState } from '@src/context/config/configSlice'

const initialConfigState: BasicConfigState = {
  isProjectCreated: true,
  basic: {
    projectName: '',
    calendarType: REGULAR_CALENDAR,
    dateRange: {
      startDate: '',
      endDate: '',
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
  warningMessage: '',
}

export default initialConfigState
