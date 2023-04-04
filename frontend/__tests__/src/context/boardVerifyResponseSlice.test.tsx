import boardVerifyResponseReducer, { updateJiraVerifyResponse } from '@src/context/response/responseSlice'
import { MOCK_JIRA_VERIFY_RESPONSE, MOCK_RESPONSE_SLICE_INIT_STATE } from '../fixtures'

describe('boardVerifyResponse reducer', () => {
  it('should show empty array when handle initial state', () => {
    const boardVerifyResponse = boardVerifyResponseReducer(undefined, { type: 'unknown' })

    expect(boardVerifyResponse.board.jira.jiraColumns).toEqual([])
    expect(boardVerifyResponse.board.jira.targetFields).toEqual([])
    expect(boardVerifyResponse.board.jira.users).toEqual([])
  })

  it('should store jiraColumns,targetFields,users data when get network jira verify response', () => {
    const boardVerifyResponse = boardVerifyResponseReducer(
      MOCK_RESPONSE_SLICE_INIT_STATE,
      updateJiraVerifyResponse({
        jiraColumns: MOCK_JIRA_VERIFY_RESPONSE.jiraColumns,
        targetFields: MOCK_JIRA_VERIFY_RESPONSE.targetFields,
        users: MOCK_JIRA_VERIFY_RESPONSE.users,
      })
    )

    expect(boardVerifyResponse.board.jira.jiraColumns).toEqual(MOCK_JIRA_VERIFY_RESPONSE.jiraColumns)
    expect(boardVerifyResponse.board.jira.targetFields).toEqual(MOCK_JIRA_VERIFY_RESPONSE.targetFields)
    expect(boardVerifyResponse.board.jira.users).toEqual(MOCK_JIRA_VERIFY_RESPONSE.users)
  })
})
