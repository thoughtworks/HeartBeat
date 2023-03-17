import pipelineToolReducer, { updatePipelineTool, updatePipelineToolVerifyState } from '@src/context/config/configSlice'
import configReducer from '@src/context/config/configSlice'
import initialConfigState from '../initialConfigState'

describe('pipelineTool reducer', () => {
  it('should set isPipelineToolVerified false when handle initial state', () => {
    const STEPPER = pipelineToolReducer(undefined, { type: 'unknown' })

    expect(STEPPER.isPipelineToolVerified).toEqual(false)
  })

  it('should set isPipelineToolVerified true when handle updatePipelineToolVerifyState given isPipelineToolVerified is true', () => {
    const STEPPER = pipelineToolReducer(initialConfigState, updatePipelineToolVerifyState(true))

    expect(STEPPER.isPipelineToolVerified).toEqual(true)
  })

  it('should update pipelineTool fields when change pipelineTool fields input', () => {
    const config = configReducer(initialConfigState, updatePipelineTool({ token: 'abcd' }))

    expect(config.pipelineToolConfig.token).toEqual('abcd')
  })
})
