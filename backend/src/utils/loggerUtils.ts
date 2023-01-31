import log4js from "log4js";

export const loggerFactory = () => {
  const logLevel = process.env["LOG_LEVEL"] || "debug";

  log4js.configure({
    appenders: {
      pattern: {
        type: "stdout",
        layout: {
          type: "pattern",
          pattern: "%[%d [%p] %M(%C:%l)-%m%]",
        },
      },
    },
    categories: {
      default: {
        enableCallStack: true,
        appenders: ["pattern"],
        level: logLevel,
      },
    },
  });
  const logger = log4js.getLogger("pattern");

  return logger;
};

const logger = loggerFactory();

export default logger;
