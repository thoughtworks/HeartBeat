import {
  updatePipelineTool,
  updatePipelineToolVerifyResponse,
  updatePipelineToolVerifyState,
} from '@src/context/config/configSlice'
import configReducer from '@src/context/config/configSlice'
import initialConfigState from '../initialConfigState'
import { MOCK_BUILD_KITE_VERIFY_RESPONSE } from '../fixtures'

describe('pipelineTool reducer', () => {
  it('should set isPipelineToolVerified false when handle initial state', () => {
    const result = configReducer(undefined, { type: 'unknown' })

    expect(result.pipelineTool.isVerified).toEqual(false)
  })

  it('should set isPipelineToolVerified true when handle updatePipelineToolVerifyState given isPipelineToolVerified is true', () => {
    const result = configReducer(initialConfigState, updatePipelineToolVerifyState(true))

    expect(result.pipelineTool.isVerified).toEqual(true)
  })

  it('should update pipelineTool fields when change pipelineTool fields input', () => {
    const config = configReducer(initialConfigState, updatePipelineTool({ token: 'abcd' }))

    expect(config.pipelineTool.config.token).toEqual('abcd')
  })

  describe('pipelineToolVerifyResponse reducer', () => {
    it('should show empty array when handle initial state', () => {
      const pipelineVerifiedResponse = configReducer(undefined, { type: 'unknown' })

      expect(pipelineVerifiedResponse.pipelineTool.verifiedResponse.pipelineList).toEqual([])
    })

    it('should store pipelineTool data when get network pipelineTool verify response', () => {
      const pipelineVerifiedResponse = configReducer(
        initialConfigState,
        updatePipelineToolVerifyResponse(MOCK_BUILD_KITE_VERIFY_RESPONSE)
      )

      expect(pipelineVerifiedResponse.pipelineTool.verifiedResponse.pipelineList).toEqual(
        MOCK_BUILD_KITE_VERIFY_RESPONSE.pipelineList
      )
    })
  })
})
