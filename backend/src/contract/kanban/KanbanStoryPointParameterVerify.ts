import { TargetField } from "./KanbanTokenVerifyResponse";

export class StoryPointsAndCycleTimeRequest {
  token: string;
  type: string;
  site: string;
  project: string;
  boardId: string;
  startTime: number;
  endTime: number;
  status: string[];
  targetFields: TargetField[];
  treatFlagCardAsBlock: boolean;

  constructor(
    token: string,
    type: string,
    site: string,
    project: string,
    boardId: string,
    status: string[],
    startTime: number,
    endTime: number,
    targetFields: TargetField[],
    treatFlagCardAsBlock: boolean
  ) {
    this.token = token;
    this.type = type;
    this.project = project;
    this.boardId = boardId;
    this.site = site;
    this.startTime = startTime;
    this.endTime = endTime;
    this.status = status;
    this.targetFields = targetFields;
    this.treatFlagCardAsBlock = treatFlagCardAsBlock;
  }
}
