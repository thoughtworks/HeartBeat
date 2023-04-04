import responseReducer, {
  updateJiraVerifyResponse,
  updatePipelineToolVerifyResponse,
  updateSourceControlVerifyResponse,
} from '@src/context/response/responseSlice'
import { MOCK_JIRA_VERIFY_RESPONSE, MOCK_RESPONSE_SLICE_INIT_STATE, MOCK_GITHUB_VERIFY_RESPONSE } from '../fixtures'

describe('response reducer', () => {
  it('should be default value when init response reducer', () => {
    const response = responseReducer(undefined, { type: 'unknown' })

    expect(response.board.jira.users).toEqual([])
    expect(response.board.jira.targetFields).toEqual([])
    expect(response.board.jira.jiraColumns).toEqual([])
    expect(response.pipelineTool.buildKite.pipelineList).toEqual([])
    expect(response.sourceControl.github.githubRepos).toEqual([])
  })

  it('should update jiraVerify response when get jiraVerify response', () => {
    const response = responseReducer(
      MOCK_RESPONSE_SLICE_INIT_STATE,
      updateJiraVerifyResponse(MOCK_JIRA_VERIFY_RESPONSE)
    )

    expect(response.board.jira.jiraColumns).toEqual(MOCK_JIRA_VERIFY_RESPONSE.jiraColumns)
    expect(response.board.jira.users).toEqual(MOCK_JIRA_VERIFY_RESPONSE.users)
    expect(response.board.jira.targetFields).toEqual(MOCK_JIRA_VERIFY_RESPONSE.targetFields)
  })

  it('should update pipelineTool response when get pipelineTool response', () => {
    const mockPipelineToolVerifyResponse = {
      pipelineList: [],
    }
    const response = responseReducer(
      MOCK_RESPONSE_SLICE_INIT_STATE,
      updatePipelineToolVerifyResponse(mockPipelineToolVerifyResponse)
    )

    expect(response.pipelineTool.buildKite.pipelineList).toEqual(mockPipelineToolVerifyResponse.pipelineList)
  })

  it('should update sourceControl response when get sourceControl response', () => {
    const response = responseReducer(
      MOCK_RESPONSE_SLICE_INIT_STATE,
      updateSourceControlVerifyResponse(MOCK_GITHUB_VERIFY_RESPONSE)
    )

    expect(response.sourceControl.github.githubRepos).toEqual(MOCK_GITHUB_VERIFY_RESPONSE.githubRepos)
  })
})
