import sourceControlReducer, { updateSourceControlVerifyState } from '@src/context/sourceControl/sourceControlSlice'
describe('sourceControl reducer', () => {
  it('should set isSourceControlVerified false when handle initial state', () => {
    const stepper = sourceControlReducer(undefined, { type: 'unknown' })

    expect(stepper.isSourceControlVerified).toEqual(false)
  })

  it('should return true when handle changeSourceControlVerifyState given isSourceControlVerified is true', () => {
    const stepper = sourceControlReducer(
      {
        isSourceControlVerified: false,
      },
      updateSourceControlVerifyState(true)
    )

    expect(stepper.isSourceControlVerified).toEqual(true)
  })
})
