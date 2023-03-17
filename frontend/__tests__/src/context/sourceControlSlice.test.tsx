import sourceControlReducer, {
  updateSourceControl,
  updateSourceControlVerifyState,
} from '@src/context/config/configSlice'
import { REGULAR_CALENDAR } from '../fixtures'
import { BOARD_TYPES, PIPELINE_TOOL_TYPES, SOURCE_CONTROL_TYPES } from '@src/constants'

describe('sourceControl reducer', () => {
  const initState = {
    projectName: '',
    calendarType: REGULAR_CALENDAR,
    dateRange: {
      startDate: '',
      endDate: '',
    },
    metrics: [],
    boardConfig: {
      type: BOARD_TYPES.JIRA,
      boardId: '',
      email: '',
      projectKey: '',
      site: '',
      token: '',
    },
    isBoardVerified: false,
    pipelineToolConfig: {
      pipelineTool: PIPELINE_TOOL_TYPES.BUILD_KITE,
      token: '',
    },
    isPipelineToolVerified: false,
    sourceControlConfig: {
      sourceControl: SOURCE_CONTROL_TYPES.GITHUB,
      token: '',
    },
    isSourceControlVerified: false,
  }

  it('should set isSourceControlVerified false when handle initial state', () => {
    const stepper = sourceControlReducer(undefined, { type: 'unknown' })

    expect(stepper.isSourceControlVerified).toEqual(false)
  })

  it('should return true when handle changeSourceControlVerifyState given isSourceControlVerified is true', () => {
    const stepper = sourceControlReducer(initState, updateSourceControlVerifyState(true))

    expect(stepper.isSourceControlVerified).toEqual(true)
  })

  it('should update sourceControl fields when change sourceControl fields input', () => {
    const config = sourceControlReducer(initState, updateSourceControl({ token: 'token' }))

    expect(config.sourceControlConfig.token).toEqual('token')
  })
})
