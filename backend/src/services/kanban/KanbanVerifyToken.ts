import { KanbanTokenVerifyModel } from "../../contract/kanban/KanbanTokenVerify";
import { KanbanTokenVerifyResponse } from "../../contract/kanban/KanbanTokenVerifyResponse";

export interface KanbanVerifyToken {
  verifyTokenAndGetColumnsAndUser(
    model: KanbanTokenVerifyModel
  ): Promise<KanbanTokenVerifyResponse>;
}
