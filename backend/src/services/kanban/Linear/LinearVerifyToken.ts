import { KanbanVerifyToken } from "../KanbanVerifyToken";
import { KanbanTokenVerifyModel } from "../../../contract/kanban/KanbanTokenVerify";
import { KanbanTokenVerifyResponse } from "../../../contract/kanban/KanbanTokenVerifyResponse";
import { LinearClient } from "@linear/sdk";
import uniq from "lodash/uniq";
import { transformWorkflowToJiraColumn } from "./Linear";

export class LinearVerifyToken implements KanbanVerifyToken {
  client: LinearClient;

  constructor(apiKey: string) {
    this.client = new LinearClient({
      apiKey,
    });
  }

  async verifyTokenAndGetColumnsAndUser(
    model: KanbanTokenVerifyModel
  ): Promise<KanbanTokenVerifyResponse> {
    const response = new KanbanTokenVerifyResponse();

    // users
    const issues = await this.client.issues({
      filter: {
        completedAt: {
          lte: new Date(model.endTime),
          gte: new Date(model.startTime),
        },
        project: {
          name: { eq: model.boardId },
        },
      },
    });
    const assigneeNames = await Promise.all(
      issues.nodes.map(async (issue) => (await issue.assignee)?.name)
    );
    response.users = uniq(assigneeNames).filter((item) => item) as string[];

    // columns
    const workflows = await this.client.workflowStates();
    response.jiraColumns = transformWorkflowToJiraColumn(workflows);

    // targetFields: hardCoded
    response.targetFields = [
      { key: "Status", name: "Status", flag: false },
      { key: "Priority", name: "Priority", flag: false },
      { key: "Assignee", name: "Assignee", flag: false },
      { key: "Estimate", name: "Estimate", flag: false },
      { key: "Labels", name: "Labels", flag: false },
    ];

    return response;
  }
}
