import { KanbanVerifyToken } from "../KanbanVerifyToken";
import { KanbanTokenVerifyModel } from "../../../contract/kanban/KanbanTokenVerify";
import { KanbanTokenVerifyResponse } from "../../../contract/kanban/KanbanTokenVerifyResponse";
import { LinearClient } from "@linear/sdk";
import { transformWorkflowToJiraColumn } from "./Linear";
import { NoCardsInDoneColumnError } from "../../../errors/NoCardsInDoneColumnError";

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

    const cards = await this.client.issues({
      filter: {
        completedAt: {
          gte: new Date(model.startTime),
          lte: new Date(model.endTime),
        },
        team: { name: { eq: model.teamName } },
      },
    });

    if (cards.nodes.length === 0)
      throw new NoCardsInDoneColumnError("There is no cards in done column");

    // users
    const members = (await (await this.client.team(model.teamId)).members())
      .nodes;
    response.users = members.map((member) => member.name);

    // columns
    const workflows = await this.client.workflowStates({
      filter: { team: { name: { eq: model.teamName } } },
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
