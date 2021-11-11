import { KanbanVerifyToken } from "../KanbanVerifyToken";
import { KanbanTokenVerifyModel } from "../../../contract/kanban/KanbanTokenVerify";
import { KanbanTokenVerifyResponse } from "../../../contract/kanban/KanbanTokenVerifyResponse";
import { LinearClient } from "@linear/sdk";

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
    response.targetFields = [];
    response.jiraColumns = [];
    response.users = [];
    return response;
  }
}
