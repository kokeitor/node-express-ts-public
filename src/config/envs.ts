import "dotenv/config";
import { get } from "env-var";
import { IEnvs } from "../domain";

export function getEnvs(): IEnvs {
  return {
    // Server Configuration
    port: get("PORT").required().asPortNumber(),
    nodeEnv: get("NODE_ENV").required().asString(),
    apiUrl: get("API_URL").required().asString(),
    appUrl:
      get("NODE_ENV").required().asString() === "production"
        ? get("PRO_APP_URL").required().asString()
        : get("DEV_APP_URL").required().asString(),

    // Database Configuration
    postgres: {
      host: get("POSTGRES_HOST").required().asString(),
      port: get("POSTGRES_PORT").required().asPortNumber(),
      user: get("POSTGRES_USER").required().asString(),
      password: get("POSTGRES_PSW").required().asString(),
      database: get("POSTGRES_DB").required().asString(),
    },

    // Authentication
    jwtSecret: get("JWT_SECRET").required().asString(),

    // Email Configuration
    email: {
      logoUrl: get("EMAIL_LOGO_URL").required().asString(),
      resendApiKey: get("RESEND_API_KEY").required().asString(),
      resendFromEmail: get("RESEND_FROM_EMAIL").required().asString(),
      resendToDevEmail: get("RESEND_TO_DEV_EMAIL").required().asString(),
    },

    // Logging Configuration
    log: {
      token: get("LOG_TOKEN").required().asString(),
      level: get("LOG_LEVEL").required().asString(),
    },
  };
}
