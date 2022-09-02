import { TestBed, async } from '@angular/core/testing';
import { RouterTestingModule } from '@angular/router/testing';
import { PipelineParams } from './pipelineParams';

describe('PipelineParams', () => {
  it('should create a pipelineParams instance', () => {
    const pipelineParams = new PipelineParams({
      type: ' ',
      token: ' ',
      deployment: [
        {
          orgId: 'orgId',
          orgName: ' ',
          id: ' ',
          name: ' ',
          step: ' ',
        },
      ],
    });

    const deployment = [
      {
        orgId: 'orgId',
        orgName: ' ',
        id: ' ',
        name: ' ',
        step: ' ',
      },
    ];

    expect(pipelineParams.deployment).toEqual(deployment);
  });
});
