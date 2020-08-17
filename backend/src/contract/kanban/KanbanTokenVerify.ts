export const kanbanTokenVerifySchema = {
  type: { type: "string", required: true, description: "kanban type" },
  token: { type: "string", required: true, description: "kanban token" },
  site: { type: "string", required: true, description: "kanban domain" },
  projectKey: { type: "string", required: true, description: "kanban project" },
  boardId: { type: "number", required: true, description: "kanban boardId" },
  startTime: {
    type: "number",
    required: true,
    description: "kanban start time",
  },
  endTime: { type: "number", required: true, description: "kanban end time" },
};

export class KanbanTokenVerifyModel {
  token: string;
  site: string;
  projectKey: string;
  type: string;
  startTime: number;
  endTime: number;
  boardId: number;

  constructor(
    token: string,
    site: string,
    projectKey: string,
    type: string,
    startTime: number,
    endTime: number,
    boardId: number
  ) {
    this.token = token;
    this.site = site;
    this.projectKey = projectKey;
    this.type = type;
    this.startTime = startTime;
    this.endTime = endTime;
    this.boardId = boardId;
  }
}
