import { swaggerClass, swaggerProperty } from "koa-swagger-decorator";

@swaggerClass()
export class ColumnValue {
  @swaggerProperty({ type: "string", required: true, example: "status name" })
  name: string = "";
  @swaggerProperty({
    type: "array",
    required: true,
    items: { type: "string" },
  })
  statuses: Array<string> = [];
}

@swaggerClass()
export class JiraColumnResponse {
  @swaggerProperty({ type: "string", required: true, example: "done" })
  key: string = "";
  @swaggerProperty({
    type: "object",
    properties: (ColumnValue as any).swaggerDocument,
  })
  value: ColumnValue = new ColumnValue();
}

@swaggerClass()
export class KanbanTokenVerifyResponse {
  @swaggerProperty({
    type: "array",
    required: true,
    items: {
      type: "object",
      properties: (JiraColumnResponse as any).swaggerDocument,
    },
  })
  jiraColumns: JiraColumnResponse[] = [];

  @swaggerProperty({
    type: "array",
    required: true,
    items: { type: "string" },
  })
  users: Array<string> = [];
  @swaggerProperty({
    type: "array",
    required: true,
  })
  targetFields: TargetField[] = [];
}

@swaggerClass()
export class TargetField {
  @swaggerProperty({
    type: "string",
    required: true,
    example: "priority",
  })
  key = "priority";
  @swaggerProperty({
    type: "string",
    required: true,
    example: "priority",
  })
  name = "priority";
  @swaggerProperty({
    type: "boolean",
    required: true,
    example: "false",
  })
  flag = false;
}
