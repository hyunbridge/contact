import SMTP from "./smtp";
import SendGrid from "./sendgrid";

const adapters = {
  SMTP: SMTP,
  SendGrid: SendGrid,
};

export default async (adapterName: string, mailOptions: MailOptions) => {
  await adapters[adapterName](mailOptions);
};
