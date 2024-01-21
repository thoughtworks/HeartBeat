import boardReducer, {
  updateBoard,
  updateBoardVerifyState,
  updateJiraVerifyResponse,
} from '@src/context/config/configSlice';
import { MOCK_JIRA_VERIFY_RESPONSE } from '../fixtures';
import initialConfigState from '../initialConfigState';

describe('board reducer', () => {
  it('should return false when handle initial state', () => {
    const result = boardReducer(undefined, { type: 'unknown' });

    expect(result.board.isVerified).toEqual(false);
  });

  it('should return true when handle changeBoardVerifyState given isBoardVerified is true', () => {
    const result = boardReducer(initialConfigState, updateBoardVerifyState(true));

    expect(result.board.isVerified).toEqual(true);
  });

  it('should update board fields when change board fields input', () => {
    const board = boardReducer(initialConfigState, updateBoard({ boardId: '1' }));

    expect(board.board.config.boardId).toEqual('1');
  });

  describe('boardVerifyResponse reducer', () => {
    it('should show empty array when handle initial state', () => {
      const boardVerifyResponse = boardReducer(undefined, { type: 'unknown' });

      expect(boardVerifyResponse.board.verifiedResponse.jiraColumns).toEqual([]);
      expect(boardVerifyResponse.board.verifiedResponse.targetFields).toEqual([]);
      expect(boardVerifyResponse.board.verifiedResponse.users).toEqual([]);
    });

    it('should store jiraColumns,targetFields,users data when get network jira verify response', () => {
      const boardVerifyResponse = boardReducer(
        initialConfigState,
        updateJiraVerifyResponse({
          jiraColumns: MOCK_JIRA_VERIFY_RESPONSE.jiraColumns,
          targetFields: MOCK_JIRA_VERIFY_RESPONSE.targetFields,
          users: MOCK_JIRA_VERIFY_RESPONSE.users,
        }),
      );

      expect(boardVerifyResponse.board.verifiedResponse.jiraColumns).toEqual(MOCK_JIRA_VERIFY_RESPONSE.jiraColumns);
      expect(boardVerifyResponse.board.verifiedResponse.targetFields).toEqual(MOCK_JIRA_VERIFY_RESPONSE.targetFields);
      expect(boardVerifyResponse.board.verifiedResponse.users).toEqual(MOCK_JIRA_VERIFY_RESPONSE.users);
    });
  });
});
