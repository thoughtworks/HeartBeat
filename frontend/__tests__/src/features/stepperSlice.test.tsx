import stepperReducer, { nextStep, backStep } from '@src/context/stepper/StepperSlice'
import { ZERO } from '../fixtures'

describe('stepper reducer', () => {
  it('should get 0 when handle initial state', () => {
    const STEPPER = stepperReducer(undefined, { type: 'unknown' })

    expect(STEPPER.value).toEqual(ZERO)
  })

  it('should get 1 when handle next step given value is 0', () => {
    const STEPPER = stepperReducer(
      {
        value: 0,
      },
      nextStep()
    )

    expect(STEPPER.value).toEqual(1)
  })

  it('should get 0 when handle back step given value is 0', () => {
    const STEPPER = stepperReducer(
      {
        value: 0,
      },
      backStep()
    )

    expect(STEPPER.value).toEqual(ZERO)
  })

  it('should get 1 when handle back step given value is 2', () => {
    const STEPPER = stepperReducer(
      {
        value: 2,
      },
      backStep()
    )

    expect(STEPPER.value).toEqual(1)
  })
})
