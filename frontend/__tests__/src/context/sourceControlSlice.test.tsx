import sourceControlReducer, {
  updateSourceControl,
  updateSourceControlVerifyState,
} from '@src/context/config/configSlice'
import initialConfigState from '../initialConfigState'

describe('sourceControl reducer', () => {
  it('should set isSourceControlVerified false when handle initial state', () => {
    const stepper = sourceControlReducer(undefined, { type: 'unknown' })

    expect(stepper.isSourceControlVerified).toEqual(false)
  })

  it('should return true when handle changeSourceControlVerifyState given isSourceControlVerified is true', () => {
    const stepper = sourceControlReducer(initialConfigState, updateSourceControlVerifyState(true))

    expect(stepper.isSourceControlVerified).toEqual(true)
  })

  it('should update sourceControl fields when change sourceControl fields input', () => {
    const config = sourceControlReducer(initialConfigState, updateSourceControl({ token: 'token' }))

    expect(config.sourceControlConfig.token).toEqual('token')
  })
})
