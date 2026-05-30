declare module 'nodemailer' {
  export type TransportOptions = Record<string, unknown>;

  export type SendMailOptions = {
    to: string;
    from?: string;
    subject: string;
    text: string;
    html: string;
  };

  export type Transporter = {
    sendMail(message: SendMailOptions): Promise<unknown>;
  };

  const nodemailer: {
    createTransport(options: TransportOptions): Transporter;
  };

  export default nodemailer;
}
