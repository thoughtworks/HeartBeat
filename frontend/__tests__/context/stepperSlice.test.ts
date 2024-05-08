import stepperReducer, { backStep, nextStep, resetStep, updateTimeStamp } from '@src/context/stepper/StepperSlice';
import { ZERO } from '../fixtures';

describe('stepper reducer', () => {
  it('should get 0 when handle initial state', () => {
    const stepper = stepperReducer(undefined, { type: 'unknown' });

    expect(stepper.stepNumber).toEqual(ZERO);
  });

  it('should reset to 0 when handle reset', () => {
    const stepper = stepperReducer(undefined, resetStep());

    expect(stepper.stepNumber).toEqual(ZERO);
    expect(stepper.timeStamp).toEqual(ZERO);
  });

  it('should get 1 when handle next step given stepNumber is 0', () => {
    const stepper = stepperReducer(
      {
        stepNumber: 0,
        timeStamp: 0,
        shouldMetricsLoaded: true,
        failedTimeRangeList: [],
      },
      nextStep(),
    );

    expect(stepper.stepNumber).toEqual(1);
  });

  it('should get 0 when handle back step given stepNumber is 0', () => {
    const stepper = stepperReducer(
      {
        stepNumber: 0,
        timeStamp: 0,
        shouldMetricsLoaded: true,
        failedTimeRangeList: [],
      },
      backStep(),
    );

    expect(stepper.stepNumber).toEqual(ZERO);
  });

  it('should get 1 when handle back step given stepNumber is 2', () => {
    const stepper = stepperReducer(
      {
        stepNumber: 2,
        timeStamp: 0,
        shouldMetricsLoaded: true,
        failedTimeRangeList: [],
      },
      backStep(),
    );

    expect(stepper.stepNumber).toEqual(1);
  });

  it('should get current time when handle updateTimeStamp', () => {
    const mockTime = new Date().getTime();
    const stepper = stepperReducer(
      {
        stepNumber: 2,
        timeStamp: 0,
        shouldMetricsLoaded: true,
        failedTimeRangeList: [],
      },
      updateTimeStamp(mockTime),
    );

    expect(stepper.timeStamp).toEqual(mockTime);
  });
});
