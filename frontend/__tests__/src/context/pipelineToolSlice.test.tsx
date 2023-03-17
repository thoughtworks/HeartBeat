import pipelineToolReducer, { updatePipelineTool, updatePipelineToolVerifyState } from '@src/context/config/configSlice'
import { REGULAR_CALENDAR } from '../fixtures'
import { BOARD_TYPES, PIPELINE_TOOL_TYPES, SOURCE_CONTROL_TYPES } from '@src/constants'
import configReducer from '@src/context/config/configSlice'

describe('pipelineTool reducer', () => {
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
    sourceControlFields: {
      sourceControl: SOURCE_CONTROL_TYPES.GITHUB,
      token: '',
    },
  }
  it('should set isPipelineToolVerified false when handle initial state', () => {
    const STEPPER = pipelineToolReducer(undefined, { type: 'unknown' })

    expect(STEPPER.isPipelineToolVerified).toEqual(false)
  })

  it('should set isPipelineToolVerified true when handle updatePipelineToolVerifyState given isPipelineToolVerified is true', () => {
    const STEPPER = pipelineToolReducer(initState, updatePipelineToolVerifyState(true))

    expect(STEPPER.isPipelineToolVerified).toEqual(true)
  })

  it('should update pipelineTool fields when change pipelineTool fields input', () => {
    const config = configReducer(initState, updatePipelineTool({ token: 'abcd' }))

    expect(config.pipelineToolConfig.token).toEqual('abcd')
  })
})
