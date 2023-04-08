import { updateBoard, updateBoardVerifyState, updateJiraVerifyResponse } from '@src/context/config/board/boardSlice'
import boardReducer from '@src/context/config/board/boardSlice'
import { MOCK_JIRA_VERIFY_RESPONSE } from '../fixtures'
import initialConfigState from '../initialConfigState'

describe('board reducer', () => {
  it('should return false when handle initial state', () => {
    const board = boardReducer(undefined, { type: 'unknown' })

    expect(board.isBoardVerified).toEqual(false)
  })

  it('should return true when handle changeBoardVerifyState given isBoardVerified is true', () => {
    const board = boardReducer(initialConfigState, updateBoardVerifyState(true))

    expect(board.isBoardVerified).toEqual(true)
  })

  it('should update board fields when change board fields input', () => {
    const board = boardReducer(initialConfigState, updateBoard({ boardId: '1' }))

    expect(board.boardConfig.boardId).toEqual('1')
  })

  describe('boardVerifyResponse reducer', () => {
    it('should show empty array when handle initial state', () => {
      const boardVerifyResponse = boardReducer(undefined, { type: 'unknown' })

      expect(boardVerifyResponse.verifiedBoard.jiraColumns).toEqual([])
      expect(boardVerifyResponse.verifiedBoard.targetFields).toEqual([])
      expect(boardVerifyResponse.verifiedBoard.users).toEqual([])
    })

    it('should store jiraColumns,targetFields,users data when get network jira verify response', () => {
      const boardVerifyResponse = boardReducer(
        initialConfigState,
        updateJiraVerifyResponse({
          jiraColumns: MOCK_JIRA_VERIFY_RESPONSE.jiraColumns,
          targetFields: MOCK_JIRA_VERIFY_RESPONSE.targetFields,
          users: MOCK_JIRA_VERIFY_RESPONSE.users,
        })
      )

      expect(boardVerifyResponse.verifiedBoard.jiraColumns).toEqual(MOCK_JIRA_VERIFY_RESPONSE.jiraColumns)
      expect(boardVerifyResponse.verifiedBoard.targetFields).toEqual(MOCK_JIRA_VERIFY_RESPONSE.targetFields)
      expect(boardVerifyResponse.verifiedBoard.users).toEqual(MOCK_JIRA_VERIFY_RESPONSE.users)
    })
  })
})
