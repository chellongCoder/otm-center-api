import sgMail from "@sendgrid/mail";
import path from "path";
import config from "config";
import { templateToString } from "./util";
import { logger } from "./logger";
import { Constant } from "@/constants";
export class SendGridClient {
  constructor() {
    const key: string = (config.get("sendgrid.apiKey") as string) || "";
    logger.info("sendgrid key");
    logger.info(key);
    sgMail.setApiKey(key);
  }

  async send(to: string, subject: string, template: string, params: any) {
    try {
      const textStr = templateToString(
        path.join(__dirname, `../templates/${template}.txt.ejs`),
        params
      );
      const htmlStr = templateToString(
        path.join(__dirname, `../templates/${template}.html.ejs`),
        params
      );
      const msg = {
        to,
        from: config.get("sendgrid.fromEmail") as string,
        subject,
        text: textStr.toString(),
        html: htmlStr.toString(),
      };
      logger.info(`email send: ${JSON.stringify(msg)}`)
      await sgMail.send(msg);
    } catch (error) {
      throw error;
    }
  }

  async sendActiveAccountEmail(to: string, params: any) {
    return this.send(
      to,
      Constant.ACTIVE_ACCOUNT_EMAIL_TITLE,
      Constant.ACTIVE_ACCOUNT_EMAIL_TEMPLATE,
      params
    );
  }


  async sendWelcomeEmail(to: string, params: any) {
    return this.send(
      to,
      Constant.WELCOME_EMAIL_TITLE,
      Constant.WELCOME_EMAIL_TEMPLATE,
      params
    );
  }

  async sendForgotPasswordEmail(to: string, params: any) {
    return this.send(
      to,
      Constant.FORGOT_PASSWORD_EMAIL_TITLE,
      Constant.FORGOT_PASSWORD_EMAIL_TEMPLATE,
      params
    );
  }
}
