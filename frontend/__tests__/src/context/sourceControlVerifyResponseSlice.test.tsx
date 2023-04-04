import sourceControlVerifyResponseReducer, {
  updateSourceControlVerifyResponse,
} from '@src/context/response/responseSlice'
import { MOCK_RESPONSE_SLICE_INIT_STATE, MOCK_GITHUB_VERIFY_RESPONSE } from '../fixtures'

describe('sourceControlVerifyResponse reducer', () => {
  it('should show empty array when handle initial state', () => {
    const sourceControlVerifyResponse = sourceControlVerifyResponseReducer(undefined, { type: 'unknown' })

    expect(sourceControlVerifyResponse.sourceControl.github.githubRepos).toEqual([])
  })

  it('should store sourceControl data when get network sourceControl verify response', () => {
    const sourceControlResponse = sourceControlVerifyResponseReducer(
      MOCK_RESPONSE_SLICE_INIT_STATE,
      updateSourceControlVerifyResponse(MOCK_GITHUB_VERIFY_RESPONSE)
    )

    expect(sourceControlResponse.sourceControl.github.githubRepos).toEqual(MOCK_GITHUB_VERIFY_RESPONSE.githubRepos)
  })
})
