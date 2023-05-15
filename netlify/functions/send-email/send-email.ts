import { Handler } from "@netlify/functions";
import axios from "axios";
import nodemailer from "nodemailer";
import * as EmailValidator from "email-validator";

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
    const SMTP_HOST = process.env.SMTP_HOST;
    const SMTP_PORT = Number(process.env.SMTP_PORT);
    const SMTP_USERNAME = process.env.SMTP_USERNAME;
    const SMTP_PASSWORD = process.env.SMTP_PASSWORD;
    const EMAIL_FROM = process.env.EMAIL_FROM;
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

    const transporter = nodemailer.createTransport({
      host: SMTP_HOST,
      port: SMTP_PORT,
      requireTLS: true,
      auth: {
        user: SMTP_USERNAME,
        pass: SMTP_PASSWORD,
      },
    });

    transporter.sendMail({
      from: EMAIL_FROM,
      to: email,
      subject: subject,
      text: EMAIL_BODY,
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
