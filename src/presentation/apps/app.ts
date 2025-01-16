import express, { Application, Request, Response } from "express";
import morgan from "morgan";
import cors from "cors";
import { getUserRouter, getAuthRouter, logMiddleware } from "..";
import { IEnvs, appConfig } from "../../domain";

export function createApp(config: appConfig, envs: IEnvs): Application {
  const app: Application = express();
  app.disable("x-powered-by");
  app.set("view engine", "ejs");
  app.use(morgan("dev"));
  app.use(logMiddleware);
  app.use(cors(config.cors)); // middleware : enable cors
  app.use(express.json()); // middleware : parse body if send in the request [hecho por express (recomendado)]
  app.use(express.urlencoded({ extended: true })); // middleware : parse body with header content type of this request is application/x-www-form-urlencoded
  app.get("/api/v1/health", (req: Request, res: Response) =>
    res.status(200).json({
      message: "Server is running",
      status: 200,
      content: undefined,
    })
  );
  app.use("/api/v1/users", getUserRouter(envs));
  app.use("/api/v1/auth", getAuthRouter(envs));
  app.use((req, res) => {
    return res.status(404).send("<h1>404 Not Found</h1>");
  });

  return app;
}
