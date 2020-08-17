import { swaggerProperty } from "koa-swagger-decorator/dist";

export class TokenVerifyModel {
  @swaggerProperty({
    type: "string",
    required: true,
    description: "pipeline token",
  })
  token: string;
  @swaggerProperty({
    type: "string",
    required: true,
    description: "pipeline type",
  })
  type: string;
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

  constructor(token: string, type: string, startTime: number, endTime: number) {
    this.token = token;
    this.type = type;
    this.startTime = startTime;
    this.endTime = endTime;
  }
}
