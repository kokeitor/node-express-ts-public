import {
  UserEntity,
  CustomError,
  sendEmailOptions,
  ISendEmailAdapter,
  ISendEmailVerificationUseCase,
} from "../../../domain";
import { logger, envs } from "../../../app";
import fs from "fs";
import path from "path";

export class SendEmailVerificationUseCase
  implements ISendEmailVerificationUseCase
{
  private htmlBody: Buffer | null | string = null;
  constructor(private readonly emailAdapter: ISendEmailAdapter) {}

  private readHtml(
    filePath: string | Buffer | number,
    options: object = { encoding: "utf8" }
  ): void {
    this.htmlBody = fs.readFileSync(filePath, options);
    logger.info(`Reading HTML file : ${filePath}`);
    if (!this.htmlBody) {
      throw CustomError.internalServerError(
        "Error reading html body for sending email verification"
      );
    }
  }

  execute = async (user: UserEntity, token: string): Promise<boolean> => {
    const htmlFilePath = path.join(
      process.cwd(),
      "data",
      "email",
      envs.nodeEnv === "production"
        ? "email-verification-content-pro.html"
        : "email-verification-content.html"
    );
    this.readHtml(htmlFilePath);
    if (!this.htmlBody) {
      throw CustomError.internalServerError(
        "Error reading html body for sending email verification"
      );
    }
    const parsedHtml = this.htmlBody as string;
    const bodyHtml = parsedHtml
      .replace("{verify-endpoint}", "verify-token")
      .replace("{api_url}", envs.apiUrl)
      .replace("{resource}", "auth")
      .replace("{app_url}", envs.appUrl)
      .replace("{token}", token)
      .replace("{url_logo}", envs.email.logoUrl as string)
      .replace("{user_name}", user.name)
      .replace(
        "{user_nickname}",
        user.nickname != "N/A" ? `, ${user.nickname} ` : ""
      )
      .replace(
        "{port}",
        envs.nodeEnv === "production" ? "" : envs.port.toString()
      );

    const emailOptions: sendEmailOptions = {
      from: envs.email.resendFromEmail,
      to: envs.email.resendToDevEmail,
      /*
      PRO 
        envs.nodeEnv === "production"
          ? user.email
          : envs.email.resendToDevEmail, // user.email,
          */
      subject: "Verifica tu correo electrónico",
      html: bodyHtml,
    };

    // send verification email
    const emailStatus = await this.emailAdapter.sendEmail(emailOptions);

    if (!emailStatus)
      throw CustomError.internalServerError("Error sending email verification");
    return emailStatus;
  };
}
