import SMTP from "./smtp";

const adapters = {
  SMTP: SMTP,
};

export default async (adapterName: string, mailOptions: MailOptions) => {
  await adapters[adapterName](mailOptions);
};
