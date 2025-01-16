type attachment = {
  content?: string | Buffer;
  filename?: string | false | undefined;
  path?: string;
  contentType?: string;
};

interface emailOptions {
  from: string;
  to: string[] | string;
  subject: string;
  attachments?: attachment[];
}

export interface sendEmailOptions extends emailOptions {
  html: string;
  text?: string | undefined;
}
export interface ISendEmailAdapter {
  sendEmail(options: sendEmailOptions): Promise<boolean>;
}
