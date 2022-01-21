export const kanbanTokenVerifySchema = {
  type: { type: "string", required: true, description: "kanban type" },
  token: { type: "string", required: true, description: "kanban token" },

  site: { type: "string", description: "Jira domain" },
  projectKey: { type: "string", description: "Jira projectKey" },
  boardId: { type: "string", description: "Jira boardId" },

  projectName: { type: "string", description: "Linear projectName" },

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
  projectName: string;
  type: string;
  startTime: number;
  endTime: number;
  boardId: string;

  constructor(
    token: string,
    site: string,
    projectKey: string,
    projectName: string,
    type: string,
    startTime: number,
    endTime: number,
    boardId: string
  ) {
    this.token = token;
    this.site = site;
    this.projectKey = projectKey;
    this.projectName = projectName;
    this.type = type;
    this.startTime = startTime;
    this.endTime = endTime;
    this.boardId = boardId;
  }
}
