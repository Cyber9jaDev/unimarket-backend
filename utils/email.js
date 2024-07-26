import nodemailer from 'nodemailer';

const transport = nodemailer.createTransport({
  host: 'sandbox.smtp.mailtrap.io',
  port: 2525,
  auth: {
    user: "cf47b36873894b",
    pass: "c909d62bf4b0c8"
  }
});

export default transport;


