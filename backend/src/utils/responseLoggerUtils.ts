import { AxiosResponse } from "axios";
import { EMAIL_REGX, FAKE_EMAIL } from "../constants";
import logger from "./loggerUtils";

export const responseLogger = (description: string, response: AxiosResponse) =>
  logger.info(`${description}: ${JSON.stringify(response.data)}`);

export const maskEmailResponseLogger = (
  description: string,
  response: AxiosResponse
) =>
  logger.info(
    `${description}: ${JSON.stringify(response.data).replace(
      EMAIL_REGX,
      FAKE_EMAIL
    )}`
  );
