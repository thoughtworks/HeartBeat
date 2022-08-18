import Application from "koa";
import { PlatformTypeError } from "./errors/PlatformTypeError";
import { SettingMissingError } from "./errors/SettingMissingError";
import { SprintStatisticsError } from "./errors/SprintStatisticsError";
import { NoCardsInDoneColumnError } from "./errors/NoCardsInDoneColumnError";

export default () =>
  async (
    ctx: Application.ExtendableContext & {
      state: Application.DefaultState;
    } & Application.DefaultContext,
    next: () => Promise<any>
  ): Promise<void> => {
    try {
      await next();
    } catch (error) {
      if (error.isAxiosError && error.response != undefined) {
        ctx.response.status = error.response.status;
      } else if (error instanceof PlatformTypeError) {
        ctx.status = 400;
      } else if (error instanceof SettingMissingError) {
        ctx.status = 400;
      } else if (error instanceof NoCardsInDoneColumnError) {
        ctx.status = 444;
      } else if (error instanceof SprintStatisticsError) {
        ctx.status = 400;
      } else if (error.status == 400) {
        ctx.status = 400;
      } else {
        ctx.response.status = 500;
        throw error;
      }
      ctx.body = { msg: error.message };
    }
  };
