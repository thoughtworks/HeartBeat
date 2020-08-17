import { swaggerClass, swaggerProperty } from "koa-swagger-decorator";

@swaggerClass()
export class CodebaseTokenModel {
  @swaggerProperty({
    type: "string",
    required: true,
    description: "codebase type, eg. github",
  })
  type: string;
  @swaggerProperty({
    type: "string",
    required: true,
    description: "codebase token for get private repo commit info",
  })
  token: string;

  constructor(type: string, token: string) {
    this.type = type;
    this.token = token;
  }
}
