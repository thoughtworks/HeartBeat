import pipelineToolReducer, { updatePipelineToolVerifyState } from '@src/context/pipelineTool/pipelineToolSlice'

describe('pipelineTool reducer', () => {
  it('should set isPipelineToolVerified false when handle initial state', () => {
    const STEPPER = pipelineToolReducer(undefined, { type: 'unknown' })

    expect(STEPPER.isPipelineToolVerified).toEqual(false)
  })

  it('should set isPipelineToolVerified true when handle updatePipelineToolVerifyState given isPipelineToolVerified is true', () => {
    const STEPPER = pipelineToolReducer(
      {
        isPipelineToolVerified: false,
      },
      updatePipelineToolVerifyState(true)
    )

    expect(STEPPER.isPipelineToolVerified).toEqual(true)
  })
})
