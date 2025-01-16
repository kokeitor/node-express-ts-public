import winston from "winston";
import { getAppconfig, getEnvs, getLogger } from "./config";
import { CustomError, IEnvs, appConfig } from "./domain";
import { Server } from "http";
import { createApp } from "./presentation";
import { Application } from "express";

export const envs: IEnvs = getEnvs();
export const logger: winston.Logger = getLogger(envs);
export const config: appConfig = getAppconfig(envs);
logger.info(`App cors:\n${config.cors}`);
logger.info(`App port:\n${config.port}`);

logger.info(`Envs appUrl:\n${envs.appUrl}`);
logger.info(`Envs nodeEnv:\n${envs.nodeEnv}`);
logger.info(`Envs email:\n${envs.email}`);
logger.info(`Envs log level:\n${envs.log.level}`);

export const app: Application = createApp(config, envs);
export let server: Server;

if (envs.nodeEnv === "test") {
  server = app.listen(envs.port, () => {
    logger.info(`Testing server started on port ${envs.port}`);
  });
} else if (envs.nodeEnv === "production") {
  server = app.listen(envs.port, () => {
    logger.info(`Production server started on port ${envs.port}`);
  });
} else if (envs.nodeEnv === "development") {
  server = app.listen(envs.port, () => {
    logger.info(`Development server started on port ${envs.port}`);
  });
} else {
  throw CustomError.serviceUnavailable("Invalid node environment");
}
