import { description, request, summary, tagsAll } from "koa-swagger-decorator";
import { Context, query, responses } from "koa-swagger-decorator/dist";
import {
  KanbanTokenVerifyModel,
  kanbanTokenVerifySchema,
} from "../contract/kanban/KanbanTokenVerify";
import { KanbanEnum } from "../services/kanban/Kanban";
import { KanbanTokenVerifyResponse } from "../contract/kanban/KanbanTokenVerifyResponse";
import { JiraVerifyToken } from "../services/kanban/Jira/JiraVerifyToken";
import { LinearVerifyToken } from "../services/kanban/Linear/LinearVerifyToken";

@tagsAll(["KanbanController"])
export default class KanbanController {
  @request("get", "/kanban/verify")
  @summary("verify token")
  @description("verify token")
  @query(kanbanTokenVerifySchema)
  @responses((KanbanTokenVerifyResponse as any).swaggerDocument)
  public static async verifyToken(ctx: Context): Promise<void> {
    // 先验证一下token
    const kanbanTokenVerifyModel: KanbanTokenVerifyModel = ctx.validatedQuery;
    switch (kanbanTokenVerifyModel.type.toLowerCase()) {
      case KanbanEnum.JIRA:
      case KanbanEnum.CLASSIC_JIRA:
        ctx.response.body = await new JiraVerifyToken(
          kanbanTokenVerifyModel.token,
          kanbanTokenVerifyModel.site
        ).verifyTokenAndGetColumnsAndUser(kanbanTokenVerifyModel);
        break;
      case KanbanEnum.LINEAR:
        ctx.response.body = await new LinearVerifyToken(
          kanbanTokenVerifyModel.token
        ).verifyTokenAndGetColumnsAndUser(kanbanTokenVerifyModel);
        break;
      default:
        ctx.response.status = 400;
    }
  }
}
