import { TestBed, async } from '@angular/core/testing';
import { RouterTestingModule } from '@angular/router/testing';
import { CodebaseParams } from './codebaseParams';

describe('CodebaseParams', () => {
  it('should create a codebaseParams instance', () => {
    const codebaseParams = new CodebaseParams({
      type: 'type',
      token: 'token',
      leadTime: [
        {
          orgId: ' ',
          orgName: ' ',
          id: ' ',
          name: ' ',
          step: ' ',
          repository: ' ',
        },
      ],
    });
    const token = 'token';

    expect(codebaseParams.token).toEqual(token);
  });
});
