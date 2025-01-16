export interface IEnvs {
  port: number;
  nodeEnv: string;
  apiUrl: string;
  appUrl: string;
  postgres: {
    host: string;
    port: number;
    user: string;
    password: string;
    database: string;
  };
  jwtSecret: string;
  email: {
    logoUrl: string;
    resendApiKey: string;
    resendFromEmail: string;
    resendToDevEmail: string;
  };
  log: {
    token: string;
    level: string;
  };
}
