import axios from "axios";

export default async (mailOptions: MailOptions) => {
  const SG_API_TOKEN = process.env.SG_API_TOKEN;

  const message = {
    personalizations: [
      {
        to: [
          {
            email: mailOptions.recipientMail,
          },
        ],
      },
    ],
    from: {
      email: mailOptions.senderMail,
      name: mailOptions.senderName,
    },
    subject: mailOptions.subject,
    content: [
      {
        type: "text/plain",
        value: mailOptions.body,
      },
    ],
  };

  await axios.post("https://api.sendgrid.com/v3/mail/send", message, {
    headers: { Authorization: `Bearer ${SG_API_TOKEN}` },
  });
};
