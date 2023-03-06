import stepperReducer, { nextStep, backStep } from '@src/context/stepper/StepperSlice'
import { ZERO } from '../fixtures'

describe('stepper reducer', () => {
  it('should get 0 when handle initial state', () => {
    const stepper = stepperReducer(undefined, { type: 'unknown' })

    expect(stepper.stepNumber).toEqual(ZERO)
  })

  it('should get 1 when handle next step given stepNumber is 0', () => {
    const stepper = stepperReducer(
      {
        stepNumber: 0,
      },
      nextStep()
    )

    expect(stepper.stepNumber).toEqual(1)
  })

  it('should get 0 when handle back step given stepNumber is 0', () => {
    const stepper = stepperReducer(
      {
        stepNumber: 0,
      },
      backStep()
    )

    expect(stepper.stepNumber).toEqual(ZERO)
  })

  it('should get 1 when handle back step given stepNumber is 2', () => {
    const stepper = stepperReducer(
      {
        stepNumber: 2,
      },
      backStep()
    )

    expect(stepper.stepNumber).toEqual(1)
  })
})
