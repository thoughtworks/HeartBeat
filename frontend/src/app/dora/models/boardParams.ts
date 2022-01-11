import { TargetField } from '../types/board';

export class BoardParams {
  type: string;
  token: string;
  site: string;
  projectKey: string;
  doneColumn: string[];
  treatFlagCardAsBlock: boolean;
  boardColumns: {
    name: string;
    value: string;
  };
  users: string[];
  targetFields: TargetField[];
  boardId: string;

  constructor({
    type,
    token,
    site,
    projectKey,
    email,
    boardId,
  }: {
    type: string;
    token: string;
    site: string;
    projectKey: string;
    email: string;
    boardId: string;
  }) {
    this.type = type;
    this.token = this.generateBasicToken(token, email);
    this.site = site;
    this.projectKey = projectKey;
    this.boardId = boardId;
  }

  generateBasicToken(token: string, email: string) {
    return `Basic ${btoa(`${email}:${token}`)}`;
  }
}
