import pipelineVerifyResponseReducer, { updatePipelineToolVerifyResponse } from '@src/context/response/responseSlice'
import { MOCK_BUILD_KITE_VERIFY_RESPONSE, MOCK_RESPONSE_SLICE_INIT_STATE } from '../fixtures'

describe('pipelineToolVerifyResponse reducer', () => {
  it('should show empty array when handle initial state', () => {
    const pipelineVerifyResponse = pipelineVerifyResponseReducer(undefined, { type: 'unknown' })

    expect(pipelineVerifyResponse.pipelineTool.buildKite.pipelineList).toEqual([])
  })

  it('should store pipelineTool data when get network pipelineTool verify response', () => {
    const jiraVerifyResponse = pipelineVerifyResponseReducer(
      MOCK_RESPONSE_SLICE_INIT_STATE,
      updatePipelineToolVerifyResponse(MOCK_BUILD_KITE_VERIFY_RESPONSE)
    )

    expect(jiraVerifyResponse.pipelineTool.buildKite.pipelineList).toEqual(MOCK_BUILD_KITE_VERIFY_RESPONSE.pipelineList)
  })
})
