import { description, request, summary, tagsAll } from "koa-swagger-decorator";
import { Context } from "koa-swagger-decorator/dist";

@tagsAll(["Health Check"])
export default class HealthCheckController {
  @request("get", "/health")
  @summary("Check app's status")
  @description("Check app's status")
  public static healthCheck(ctx: Context): void {
    ctx.response.body = true
  }
}
