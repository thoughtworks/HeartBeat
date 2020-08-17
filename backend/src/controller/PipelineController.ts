import { description, request, summary, tagsAll } from "koa-swagger-decorator";
import { body, Context, responses } from "koa-swagger-decorator/dist";
import { TokenVerifyModel } from "../contract/pipeline/PipelineTokenVerify";
import { PipelineFactory } from "../services/pipeline/Pipeline";
import { PipelineGetStepsRequest } from "../contract/pipeline/PipelineGetStepsRequest";
import { PipelineGetStepsFactory } from "../services/pipeline/PipelineGetSteps";
import { PipelineInfo } from "../contract/pipeline/PipelineInfo";

@tagsAll(["PipelineController"])
export default class PipelineController {
  @request("post", "/pipeline/fetch")
  @summary("fetch pipelines")
  @description("fetch pipelines")
  @body((TokenVerifyModel as any).swaggerDocument)
  public static async fetchPipeline(ctx: Context): Promise<void> {
    const tokenVerifyModel: TokenVerifyModel = ctx.validatedBody;
    const pipeline = PipelineFactory.getInstance(
      tokenVerifyModel.type,
      tokenVerifyModel.token
    );
    ctx.response.body = await pipeline.fetchPipelineInfo(
      tokenVerifyModel.startTime,
      tokenVerifyModel.endTime
    );
  }

  @request("post", "/pipeline/getSteps")
  @summary("fetch pipelines")
  @description("fetch pipelines")
  @body((PipelineGetStepsRequest as any).swaggerDocument)
  @responses((PipelineInfo as any).swaggerDocument)
  public static async pipelineGetSteps(ctx: Context): Promise<void> {
    const pipelineGetStepsRequest: PipelineGetStepsRequest = ctx.validatedBody;
    const pipelineGetStep = PipelineGetStepsFactory.getInstance(
      pipelineGetStepsRequest.type,
      pipelineGetStepsRequest.token
    );
    ctx.response.body = await pipelineGetStep.fetchPipelineInfo(
      pipelineGetStepsRequest
    );
  }
}
