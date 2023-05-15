import { Handler } from "@netlify/functions";
import axios from "axios";
import * as EmailValidator from "email-validator";
import sendMail from "../../../modules/email/index";

export const handler: Handler = async (event, context) => {
  if (event.httpMethod !== "POST") {
    return {
      statusCode: 501,
      body: JSON.stringify({ message: "Not Implemented" }),
      headers: { "content-type": "application/json" },
    };
  }
  try {
    const RECAPTCHA_SECRET_KEY = process.env.RECAPTCHA_SECRET_KEY;
    const EMAIL_ADAPTER = process.env.EMAIL_ADAPTER;
    const EMAIL_FROM_NAME = process.env.EMAIL_FROM_NAME;
    const EMAIL_FROM_MAIL = process.env.EMAIL_FROM_MAIL;
    const EMAIL_BODY = Buffer.from(
      process.env.EMAIL_BODY ? process.env.EMAIL_BODY : "",
      "base64"
    ).toString("utf8");

    const {
      subject,
      email,
      recaptcha_token,
    }: { subject: string; recaptcha_token: string; email: string } = JSON.parse(
      event.body || "{}"
    );
    if (!EmailValidator.validate(email)) {
      return {
        statusCode: 400,
        body: JSON.stringify({
          message: "Please use a valid email.",
        }),
        headers: { "content-type": "application/json" },
      };
    }

    const validation_result = await axios.post(
      "https://www.google.com/recaptcha/api/siteverify",
      undefined,
      {
        params: {
          secret: RECAPTCHA_SECRET_KEY,
          response: recaptcha_token,
        },
      }
    );
    if (!validation_result.data["success"]) {
      return {
        statusCode: 403,
        body: JSON.stringify({
          message: "Recaptcha Validation Failed.",
        }),
        headers: { "content-type": "application/json" },
      };
    }

    await sendMail(EMAIL_ADAPTER ? EMAIL_ADAPTER : "SMTP", {
      senderName: EMAIL_FROM_NAME!,
      senderMail: EMAIL_FROM_MAIL!,
      recipientMail: email,
      subject: subject,
      body: EMAIL_BODY,
    });

    return {
      statusCode: 200,
      body: JSON.stringify({
        message: "Please check your inbox!",
      }),
      headers: { "content-type": "application/json" },
    };
  } catch (_) {
    return {
      statusCode: 503,
      body: JSON.stringify({
        message: "An error occurred.",
      }),
      headers: { "content-type": "application/json" },
    };
  }
};
