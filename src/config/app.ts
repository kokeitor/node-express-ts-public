import { appConfig, IEnvs } from "../domain";

export function getAppconfig(envs: IEnvs): appConfig {
  return {
    port: envs.port,
    cors: {
      origin: "*",
      methods: "GET,HEAD,PUT,PATCH,POST,DELETE",
      preflightContinue: false,
      credentials: true,
    },
  };
}
