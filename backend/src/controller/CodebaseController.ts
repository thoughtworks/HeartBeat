import { description, request, summary, tagsAll } from "koa-swagger-decorator";
import { Context, query } from "koa-swagger-decorator/dist";
import { CodebaseTokenModel } from "../contract/codebase/CodebaseTokenModel";
import { GitHub } from "../services/codebase/GitHub/GitHub";

@tagsAll(["CodebaseController"])
export default class CodebaseController {
  @request("get", "/codebase/fetch/repos")
  @summary("fetch user repos")
  @description("fetch user repos")
  @query((CodebaseTokenModel as any).swaggerDocument)
  public static async fetchTimePeriod(ctx: Context): Promise<void> {
    const tokenModel: CodebaseTokenModel = ctx.validatedQuery;
    const gitHub = new GitHub(tokenModel.token);
    const gitOrganizations = await gitHub.fetchAllOrganization();
    ctx.response.body = await gitHub.fetchAllRepo(gitOrganizations);
  }
}
