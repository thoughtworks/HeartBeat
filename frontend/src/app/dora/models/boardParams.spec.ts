import { TestBed, async } from '@angular/core/testing';
import { RouterTestingModule } from '@angular/router/testing';
import { BoardParams } from './boardParams';

describe('BoardParams', () => {
  const boardParams = new BoardParams({
    type: ' ',
    token: 'token',
    site: ' ',
    projectKey: ' ',
    teamName: ' ',
    teamId: ' ',
    email: ' ',
    boardId: ' ',
  });

  it('should create a boardParams instance', () => {
    const token = 'token';

    expect(boardParams.token).toEqual(token);
  });

  it('should create a basic token', () => {
    const basicToken = boardParams.generateBasicToken('token', 'email');
    const expectedBasicToken = 'Basic ZW1haWw6dG9rZW4=';

    expect(basicToken).toEqual(expectedBasicToken);
  });
});
