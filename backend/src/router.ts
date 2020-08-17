import { SwaggerRouter } from "koa-swagger-decorator";

const swaggerRouter = new SwaggerRouter();

swaggerRouter.swagger({
  title: "heartbeat-backend",
  description: "HeartBeat",
  version: "0.0.1",
});

swaggerRouter.mapDir(__dirname);

export { swaggerRouter };
