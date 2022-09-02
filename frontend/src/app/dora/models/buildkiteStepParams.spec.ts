import { TestBed, async } from '@angular/core/testing';
import { RouterTestingModule } from '@angular/router/testing';
import Step from './buildkiteStepParams';

describe('BuildkiteStep', () => {
  it('should create a buildkite step instance when not having matched emojis', () => {
    const step = new Step('step');

    expect(step.originStep).toEqual('step');
    expect(step.stepName).toEqual('step');
  });

  it('should create a buildkite step instance when having matched imgBuildkite', () => {
    const step = new Step(':alpine:alpine');

    expect(step.originStep).toEqual(':alpine:alpine');
    expect(step.stepName).toEqual('alpine');
  });

  it('should create a buildkite step instance when having matched imgApple', () => {
    const step = new Step(':hash:hash');

    expect(step.originStep).toEqual(':hash:hash');
    expect(step.stepName).toEqual('hash');
  });
});
