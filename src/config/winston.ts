import winston from "winston";
import path from "path";
import { Logtail } from "@logtail/node";
import { LogtailTransport } from "@logtail/winston";
import { IEnvs } from "../domain";

export function getLogger(envs: IEnvs): winston.Logger {
  // format
  const logFormat: winston.Logform.Format = winston.format.printf(
    ({ timestamp, level, message }) => {
      return `${timestamp} : [${level}] ${message}`;
    }
  );
  // better stack logger cloud
  const logtail = new Logtail(envs.log.token);

  return winston.createLogger({
    level: "info",
    format: winston.format.combine(winston.format.timestamp(), logFormat),
    defaultMeta: { service: "user-service" },
    transports: [
      //
      // - Write all logs with importance level of `error` or higher to `error.log`
      //   (i.e., error, fatal, but not other levels)
      //
      new winston.transports.File({
        filename: path.join(process.cwd(), "logs", "app-error.log"),
        level: "error",
      }),
      //
      // - Write all logs with importance level of `info` or higher to `combined.log`
      //   (i.e., fatal, error, warn, and info, but not trace)
      //
      new winston.transports.File({
        filename: path.join(process.cwd(), "logs", "app-combined.log"),
        level: "info",
      }),
      new LogtailTransport(logtail),
    ],
  });
}
