import { BOARD_TYPES, PIPELINE_TOOL_TYPES, SOURCE_CONTROL_TYPES } from '@src/constants'
import boardReducer, { updateBoard, updateBoardVerifyState } from '@src/context/config/configSlice'
import { REGULAR_CALENDAR } from '../fixtures'

describe('board reducer', () => {
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

  it('should return false when handle initial state', () => {
    const board = boardReducer(undefined, { type: 'unknown' })

    expect(board.isBoardVerified).toEqual(false)
  })

  it('should return true when handle changeBoardVerifyState given isBoardVerified is true', () => {
    const board = boardReducer(initState, updateBoardVerifyState(true))

    expect(board.isBoardVerified).toEqual(true)
  })

  it('should update board fields when change board fields input', () => {
    const board = boardReducer(initState, updateBoard({ boardId: '1' }))

    expect(board.boardConfig.boardId).toEqual('1')
  })
})
