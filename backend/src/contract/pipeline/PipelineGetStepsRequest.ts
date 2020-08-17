import { swaggerClass, swaggerProperty } from "koa-swagger-decorator";

@swaggerClass()
export class PipelineGetStepsRequest {
  @swaggerProperty({
    type: "string",
    description: "pipeline id",
    example: "pfs-mock-server",
  })
  pipelineId: string;
  @swaggerProperty({
    type: "string",
    description: "pipeline name",
    example: "pfs-mock-server",
  })
  pipelineName: string;
  @swaggerProperty({
    type: "string",
    description: "pipeline repository address",
    example: "https://github.com/myob-tw/pfs-mock-server",
  })
  repository: string;
  @swaggerProperty({
    type: "string",
    description: "organization id",
    example: "myob",
  })
  orgId?: string;
  @swaggerProperty({
    type: "string",
    description: "organization name",
    example: "MYOB",
  })
  orgName?: string;
  @swaggerProperty({
    type: "string",
    required: true,
    description: "pipeline token",
  })
  token: string;
  @swaggerProperty({
    type: "string",
    required: true,
    example: "BuildKite",
    description: "pipeline type",
  })
  type: string;
  @swaggerProperty({ type: "number", required: true, example: 1588262400000 })
  startTime = 0;
  @swaggerProperty({ type: "number", required: true, example: 1591372799000 })
  endTime = 0;

  constructor(
    id: string,
    name: string,
    repository: string,
    orgId: string,
    orgName: string,
    token: string,
    type: string,
    startTime: number,
    endTime: number
  ) {
    this.pipelineId = id;
    this.pipelineName = name;
    this.repository = repository;
    this.orgId = orgId;
    this.orgName = orgName;
    this.token = token;
    this.type = type;
    this.startTime = startTime;
    this.endTime = endTime;
  }
}
