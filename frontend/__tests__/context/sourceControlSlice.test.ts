import sourceControlReducer, {
  updateSourceControl,
  updateSourceControlVerifiedResponse,
} from '@src/context/config/configSlice';
import { MOCK_GITHUB_VERIFY_RESPONSE } from '../fixtures';
import initialConfigState from '../initialConfigState';

describe('sourceControl reducer', () => {
  it('should update sourceControl fields when change sourceControl fields input', () => {
    const sourceControl = sourceControlReducer(initialConfigState, updateSourceControl({ token: 'token' }));

    expect(sourceControl.sourceControl.config.token).toEqual('token');
  });

  describe('sourceControlVerifyResponse reducer', () => {
    it('should show empty array when handle initial state', () => {
      const sourceControlVerifyResponse = sourceControlReducer(undefined, { type: 'unknown' });

      expect(sourceControlVerifyResponse.sourceControl.verifiedResponse.repoList).toEqual([]);
    });

    it('should store sourceControl data when get network sourceControl verify response', () => {
      const sourceControlResponse = sourceControlReducer(
        initialConfigState,
        updateSourceControlVerifiedResponse(MOCK_GITHUB_VERIFY_RESPONSE),
      );

      expect(sourceControlResponse.sourceControl.verifiedResponse.repoList).toEqual(
        MOCK_GITHUB_VERIFY_RESPONSE.githubRepos,
      );
    });
  });
});
