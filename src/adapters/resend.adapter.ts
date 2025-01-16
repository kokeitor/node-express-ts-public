import { Resend } from "resend";
import { logger, envs } from "../app";
import { sendEmailOptions, ISendEmailAdapter } from "../domain";

export class ResendAdapter implements ISendEmailAdapter {
  private readonly resend: Resend;

  constructor() {
    this.resend = new Resend(envs.email.resendApiKey);
  }

  sendEmail = async (options: sendEmailOptions): Promise<boolean> => {
    const { data, error } = await this.resend.emails.send(options);
    if (error) {
      logger.error(`Email send error >> ${error.message}`);
      return false;
    }
    logger.info(`Email send success >> ${data?.id}`);
    return true;
  };
}
