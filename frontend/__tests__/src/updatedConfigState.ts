import { CHINA_CALENDAR } from './fixtures'
import { BOARD_TYPES, PIPELINE_TOOL_TYPES, SOURCE_CONTROL_TYPES } from '@src/constants'

const initialConfigState = {
  isProjectCreated: true,
  basic: {
    projectName: 'Mock Project Name',
    calendarType: CHINA_CALENDAR,
    dateRange: {
      startDate: '',
      endDate: '',
    },
    metrics: [],
  },
  boardConfig: {
    type: BOARD_TYPES.JIRA,
    boardId: '',
    email: '',
    projectKey: '',
    site: '',
    token: '',
  },
  isBoardVerified: false,
  isShowBoard: false,
  pipelineToolConfig: {
    pipelineTool: PIPELINE_TOOL_TYPES.BUILD_KITE,
    token: '',
  },
  isPipelineToolVerified: false,
  isShowPipeline: false,
  sourceControlConfig: {
    sourceControl: SOURCE_CONTROL_TYPES.GITHUB,
    token: '',
  },
  isSourceControlVerified: false,
  isShowSourceControl: false,
}

export default initialConfigState
