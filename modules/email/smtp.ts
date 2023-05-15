import nodemailer from "nodemailer";

export default async (mailOptions: MailOptions) => {
  const SMTP_HOST = process.env.SMTP_HOST;
  const SMTP_PORT = Number(process.env.SMTP_PORT);
  const SMTP_USERNAME = process.env.SMTP_USERNAME;
  const SMTP_PASSWORD = process.env.SMTP_PASSWORD;

  const transporter = nodemailer.createTransport({
    host: SMTP_HOST,
    port: SMTP_PORT,
    auth: {
      user: SMTP_USERNAME,
      pass: SMTP_PASSWORD,
    },
  });

  await transporter.sendMail({
    from: `"${mailOptions.senderName}" <${mailOptions.senderMail}>`,
    to: mailOptions.recipientMail,
    subject: mailOptions.subject,
    text: mailOptions.body,
  });
};
