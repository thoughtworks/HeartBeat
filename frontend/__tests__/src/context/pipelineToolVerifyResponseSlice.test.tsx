import pipelineVerifyResponseReducer, {
  updatePipelineToolVerifyResponse,
} from '@src/context/pipelineTool/pipelineToolVerifyResponse/pipelineToolVerifyResponseSlice'

describe('pipelineToolVerifyResponse reducer', () => {
  it('should show empty array when handle initial state', () => {
    const pipelineVerifyResponse = pipelineVerifyResponseReducer(undefined, { type: 'unknown' })

    expect(pipelineVerifyResponse.pipelineTool).toEqual([])
  })

  it('should store pipelineTool data when get network pipelineTool verify response', () => {
    const mockPipelineToolVerifyResponse = {
      pipelineTool: [],
    }

    const jiraVerifyResponse = pipelineVerifyResponseReducer(
      { pipelineTool: [] },
      updatePipelineToolVerifyResponse({
        pipelineTool: mockPipelineToolVerifyResponse.pipelineTool,
      })
    )

    expect(jiraVerifyResponse.pipelineTool).toEqual(mockPipelineToolVerifyResponse.pipelineTool)
  })
})
