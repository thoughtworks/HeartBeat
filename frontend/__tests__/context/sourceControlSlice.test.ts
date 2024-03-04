import sourceControlReducer, {
  updateSourceControl,
  updateSourceControlVerifiedResponse,
  updateSourceControlVerifyState,
} from '@src/context/config/configSlice';
import { MOCK_GITHUB_VERIFY_RESPONSE } from '../fixtures';
import initialConfigState from '../initialConfigState';

describe('sourceControl reducer', () => {
  it('should set isSourceControlVerified false when handle initial state', () => {
    const sourceControl = sourceControlReducer(undefined, { type: 'unknown' });

    expect(sourceControl.sourceControl.isVerified).toEqual(false);
  });

  it('should return true when handle changeSourceControlVerifyState given isSourceControlVerified is true', () => {
    const sourceControl = sourceControlReducer(initialConfigState, updateSourceControlVerifyState(true));

    expect(sourceControl.sourceControl.isVerified).toEqual(true);
  });

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
