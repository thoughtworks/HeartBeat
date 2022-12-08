import { TargetField } from '../types/board';
import { BOARD_TYPE } from '../utils/constant';

export class BoardParams {
  type: string;
  token: string;
  site: string;
  projectKey: string;
  teamName: string;
  teamId: string;
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
    teamName,
    teamId,
    email,
    boardId,
  }: {
    type: string;
    token: string;
    site: string;
    projectKey: string;
    teamName: string;
    teamId: string;
    email: string;
    boardId: string;
  }) {
    this.type = type.toLocaleLowerCase();
    this.token = type.toLocaleLowerCase() === BOARD_TYPE.JIRA ? this.generateBasicToken(token, email) : token;
    this.site = site;
    this.projectKey = projectKey;
    this.teamName = teamName;
    this.teamId = teamId;
    this.boardId = boardId;
  }

  generateBasicToken(token: string, email: string) {
    return `Basic ${btoa(`${email}:${token}`)}`;
  }
}
