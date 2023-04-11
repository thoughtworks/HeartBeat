import {
  selectPipelineNames,
  selectStepsParams,
  updatePipelineTool,
  updatePipelineToolVerifyResponse,
  updatePipelineToolVerifyState,
} from '@src/context/config/configSlice'
import configReducer from '@src/context/config/configSlice'
import initialConfigState from '../initialConfigState'
import { MOCK_BUILD_KITE_VERIFY_RESPONSE } from '../fixtures'
import { setupStore } from '../utils/setupStoreUtil'

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

  describe('selectParams from store', () => {
    const mockPipelineToolVerifyResponse = {
      pipelineList: [
        {
          id: 'mockId',
          name: 'mockName',
          orgId: 'mockOrgId',
          orgName: 'mockOrgName',
          repository: 'mockRepository',
          steps: ['step1', 'step2'],
        },
      ],
    }
    //TODO:where should set this
    it('should return PipelineNames when call selectPipelineNames function', async () => {
      const store = setupStore()
      await store.dispatch(updatePipelineToolVerifyResponse(mockPipelineToolVerifyResponse))
      expect(selectPipelineNames(store.getState(), 'mockOrgName')).toEqual(['mockName'])
    })

    it('should return true StepsParams when call selectStepsParams function given right organization name and pipeline name', async () => {
      const store = setupStore()
      await store.dispatch(updatePipelineToolVerifyResponse(mockPipelineToolVerifyResponse))

      expect(selectStepsParams(store.getState(), 'mockOrgName', 'mockName')).toEqual({
        buildId: 'mockId',
        organizationId: 'mockOrgId',
        params: {
          endTime: NaN,
          orgName: 'mockOrgName',
          pipelineName: 'mockName',
          repository: 'mockRepository',
          startTime: NaN,
        },
        pipelineType: 'BuildKite',
        token: '',
      })
    })

    it('should return StepsParams when call selectStepsParams function given empty organization name and empty pipeline name', async () => {
      const store = setupStore()
      await store.dispatch(updatePipelineToolVerifyResponse(mockPipelineToolVerifyResponse))

      expect(selectStepsParams(store.getState(), '', '')).toEqual({
        buildId: '',
        organizationId: '',
        params: {
          endTime: NaN,
          orgName: '',
          pipelineName: '',
          repository: '',
          startTime: NaN,
        },
        pipelineType: 'BuildKite',
        token: '',
      })
    })
  })
})
