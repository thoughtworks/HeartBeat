import { SwaggerRouter } from "koa-swagger-decorator";

const API_PREFIX = "/api/v1"
const swaggerRouter = new SwaggerRouter({ prefix: API_PREFIX });

swaggerRouter.swagger({
  title: "heartbeat-backend",
  description: "HeartBeat",
  version: "0.0.1",
  prefix: API_PREFIX,
});



swaggerRouter.mapDir(__dirname);

export { swaggerRouter };
