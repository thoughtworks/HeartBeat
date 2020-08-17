import { swaggerClass, swaggerProperty } from "koa-swagger-decorator";

@swaggerClass()
export class PipelineInfo {
  @swaggerProperty({
    type: "string",
    description: "pipeline id",
  })
  id: string;
  @swaggerProperty({
    type: "string",
    description: "pipeline name",
  })
  name: string;
  @swaggerProperty({
    type: "array",
    items: { type: "string", example: "build" },
    description: "steps name",
  })
  steps: string[];
  @swaggerProperty({
    type: "string",
    description: "pipeline repository address",
  })
  repository: string;
  @swaggerProperty({
    type: "string",
    description: "organization id",
  })
  orgId?: string;
  @swaggerProperty({
    type: "string",
    description: "organization name",
  })
  orgName?: string;

  constructor(
    id: string,
    name: string,
    steps: string[],
    repository: string,
    orgId?: string,
    orgName?: string
  ) {
    this.id = id;
    this.name = name;
    this.steps = steps;
    this.repository = repository;
    this.orgId = orgId;
    this.orgName = orgName;
  }
}
