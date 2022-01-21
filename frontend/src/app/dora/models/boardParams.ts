import { TargetField } from '../types/board';

export class BoardParams {
  type: string;
  token: string;
  site: string;
  projectKey: string;
  projectName: string;
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
    projectName,
    email,
    boardId,
  }: {
    type: string;
    token: string;
    site: string;
    projectKey: string;
    projectName: string;
    email: string;
    boardId: string;
  }) {
    this.type = type;
    this.token = type === 'jira' ? this.generateBasicToken(token, email) : token;
    this.site = site;
    this.projectKey = projectKey;
    this.projectName = projectName;
    this.boardId = boardId;
  }

  generateBasicToken(token: string, email: string) {
    return `Basic ${btoa(`${email}:${token}`)}`;
  }
}
