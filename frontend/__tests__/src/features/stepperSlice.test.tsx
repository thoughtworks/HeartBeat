import stepperReducer, { nextStep, backStep } from '@src/features/stepper/StepperSlice'

describe('counter reducer', () => {
  it('should get 0 when handle initial state', () => {
    expect(stepperReducer(undefined, { type: 'unknown' })).toEqual({
      value: 0,
    })
  })

  it('should get 1 when handle next step given value is 0', () => {
    const actual = stepperReducer(
      {
        value: 0,
      },
      nextStep()
    )

    expect(actual.value).toEqual(1)
  })

  it('should get 0 when handle back step given value is 0', () => {
    const actual = stepperReducer(
      {
        value: 0,
      },
      backStep()
    )

    expect(actual.value).toEqual(0)
  })

  it('should get 1 when handle back step given value is 2', () => {
    const actual = stepperReducer(
      {
        value: 2,
      },
      backStep()
    )

    expect(actual.value).toEqual(1)
  })
})
