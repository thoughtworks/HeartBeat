import { KanbanVerifyToken } from "../KanbanVerifyToken";
import { KanbanTokenVerifyModel } from "../../../contract/kanban/KanbanTokenVerify";
import { KanbanTokenVerifyResponse } from "../../../contract/kanban/KanbanTokenVerifyResponse";
import { LinearClient } from "@linear/sdk";
import uniq from "lodash/uniq";
import { transformWorkflowToJiraColumn } from "./Linear";
import { ThereIsNoCardsInDoneColumn } from "../../../types/ThereIsNoCardsInDoneColumn";

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

    const members = (await (await this.client.team("SIG")).members()).nodes;

    response.users = members.map((member) => member.name);

    // columns
    const workflows = await this.client.workflowStates({
      filter: { team: { name: { eq: "🔌 Signup API" } } },
    });
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
