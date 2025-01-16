import fs from "node:fs";
import { IEnvs, PostgresqlConfig } from "../domain";

export function getPostgresConfig(envs: IEnvs): PostgresqlConfig {
  return {
    user: envs.postgres.user,
    password: envs.postgres.password,
    host: envs.postgres.host,
    port: envs.postgres.port,
    database: envs.postgres.database,
    ssl: {
      rejectUnauthorized: true,
      ca: fs.readFileSync("./.secrets/ca.pem").toString(),
    },
  };
}
