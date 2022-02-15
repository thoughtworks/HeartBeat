import { swaggerClass, swaggerProperty } from "koa-swagger-decorator";
import { RequireDataEnum } from "../../models/RequireDataEnum";
import { TargetField } from "../kanban/KanbanTokenVerifyResponse";

@swaggerClass()
export class DeploymentEnvironment {
  @swaggerProperty({ type: "string", required: false }) orgId = "";
  @swaggerProperty({ type: "string", required: false }) orgName = "";
  @swaggerProperty({ type: "string", required: true }) id = "";
  @swaggerProperty({ type: "string", required: true }) name = "";
  @swaggerProperty({ type: "string", required: true }) step = "";
}

@swaggerClass()
export class PipelineSetting {
  @swaggerProperty({ type: "string", required: true }) type = "";
  @swaggerProperty({ type: "string", required: true }) token = "";
  @swaggerProperty({
    type: "array",
    required: true,
    items: {
      type: "object",
      properties: (DeploymentEnvironment as any).swaggerDocument,
    },
    example: [new DeploymentEnvironment()],
  })
  deployment: DeploymentEnvironment[] = [];
}

@swaggerClass()
export class LeadTimeEnvironment {
  @swaggerProperty({ type: "string", required: false }) orgId = "";
  @swaggerProperty({ type: "string", required: false }) orgName = "";
  @swaggerProperty({ type: "string", required: true }) id = "";
  @swaggerProperty({ type: "string", required: true }) name = "";
  @swaggerProperty({ type: "string", required: true }) step = "";
  @swaggerProperty({ type: "string", required: true }) repository = "";
}

@swaggerClass()
export class CodebaseSetting {
  @swaggerProperty({ type: "string", required: true, example: "GitHub" }) type =
    "";
  @swaggerProperty({ type: "string", required: true }) token = "";
  @swaggerProperty({
    type: "array",
    required: true,
    items: {
      type: "object",
      properties: (LeadTimeEnvironment as any).swaggerDocument,
    },
    example: [new LeadTimeEnvironment()],
  })
  leadTime: LeadTimeEnvironment[] = [];
}

@swaggerClass()
export class RequestKanbanColumnSetting {
  @swaggerProperty({
    type: "string",
    required: true,
    example: "todo",
  })
  name = "";
  @swaggerProperty({
    type: "string",
    required: true,
    example: "todo",
  })
  value = "";
}

@swaggerClass()
export class RequestKanbanSetting {
  @swaggerProperty({ type: "string", required: true, example: "jira" })
  type: string = "";
  @swaggerProperty({ type: "string", required: true }) token: string = "";
  @swaggerProperty({ type: "string", required: false }) site: string = "";
  @swaggerProperty({ type: "string", required: false }) projectKey: string = "";
  @swaggerProperty({ type: "string", required: false }) teamName: string = "";
  @swaggerProperty({ type: "string", required: false }) teamId: string = "";
  @swaggerProperty({ type: "string", required: false }) boardId: string = "";
  @swaggerProperty({
    type: "array",
    required: false,
    items: { type: "string" },
  })
  doneColumn: string[] = [];

  @swaggerProperty({
    type: "array",
    required: false,
    items: {
      type: "object",
      properties: (RequestKanbanColumnSetting as any).swaggerDocument,
    },
  })
  boardColumns: RequestKanbanColumnSetting[] = [];

  @swaggerProperty({
    type: "array",
    required: false,
    items: { type: "string" },
  })
  users: string[] = [];

  @swaggerProperty({
    type: "array",
    required: false,
  })
  targetFields: TargetField[] = [];

  @swaggerProperty({ type: "boolean", required: false })
  treatFlagCardAsBlock: boolean = true;
}

@swaggerClass()
export class GenerateReportRequest {
  @swaggerProperty({
    type: "array",
    required: true,
    example: [
      RequireDataEnum.VELOCITY,
      RequireDataEnum.CYCLE_TIME,
      RequireDataEnum.CLASSIFICATION,
    ],
    items: { type: "string" },
  })
  metrics: string[] = [];

  @swaggerProperty({
    type: "object",
    required: false,
    properties: (PipelineSetting as any).swaggerDocument,
    example: {
      type: "Buildkite",
      token: "toooooooookkkkkkkeeennnnnn",
      deployment: [
        {
          orgId: "tw-hearbeat",
          orgName: "tw-hearbeat",
          id: "heartbeat-dev",
          name: "heartbeat-dev",
          step: "dora",
        },
      ],
    },
  })
  pipeline: PipelineSetting = new PipelineSetting();

  @swaggerProperty({
    type: "object",
    required: false,
    properties: (CodebaseSetting as any).swaggerDocument,
  })
  codebaseSetting: CodebaseSetting = new CodebaseSetting();

  @swaggerProperty({
    type: "object",
    required: false,
    properties: (RequestKanbanSetting as any).swaggerDocument,
    example: {
      type: "jira",
      token: "Basic XXXXXX",
      site: "dorametrics",
      projectKey: "ADM",
      teamName: "testName",
      teamId: "testId",
      boardId: 2,
      doneColumn: ["DONE"],
      boardColumns: [
        {
          name: "TODO",
          value: "TODO",
        },
        {
          name: "BLOCKED",
          value: "BLOCKED",
        },
        {
          name: "DOING",
          value: "DOING",
        },
        {
          name: "TESTING",
          value: "TESTING",
        },
      ],
      users: [
        "Jian Lv",
        "Lefei Ren",
        "LULU YANG",
        "mazr",
        "Qian Zhang",
        "Qiqi Jiao",
        "Xueqing Bai",
        "yupeng",
        "Yuxuan Bi",
        "Zhibin Song",
      ],
      targetFields: [
        {
          key: "fixVersions",
          name: "修复版本",
          flag: true,
        },
        {
          key: "priority",
          name: "优先级",
          flag: true,
        },
      ],
      treatFlagCardAsBlock: true,
    },
  })
  kanbanSetting: RequestKanbanSetting = new RequestKanbanSetting();

  @swaggerProperty({
    type: "number",
    required: true,
    example: new Date().getTime() - 7 * 1000 * 60 * 60 * 24,
  })
  startTime = 0;
  @swaggerProperty({
    type: "number",
    required: true,
    example: new Date().getTime(),
  })
  endTime = 0;
  @swaggerProperty({ type: "number", required: false, example: true })
  considerHoliday: boolean = true;
  @swaggerProperty({
    type: "number",
    required: true,
    example: new Date().getTime(),
  })
  csvTimeStamp = 0;
}
