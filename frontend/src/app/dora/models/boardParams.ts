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
  boardId: number;

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
    boardId: number;
  }) {
    this.type = type;
    this.token = this.generateBasicToken(token, email);
    this.site = site;
    this.projectKey = projectKey;
    this.boardId = Number(boardId);
  }

  generateBasicToken(token: string, email: string) {
    return `Basic ${btoa(`${email}:${token}`)}`;
  }
}
