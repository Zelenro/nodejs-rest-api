import nodemailer from 'nodemailer';
import 'dotenv/config';

const { EMAIL_UKR_NET_ADDRESS, EMAIL_UKR_NET_PASSWORD } = process.env;

const transporter = nodemailer.createTransport({
  host: 'smtp.ukr.net',
  port: 465,
  secure: true,
  auth: {
    user: EMAIL_UKR_NET_ADDRESS,
    pass: EMAIL_UKR_NET_PASSWORD,
  },
});

const email = {
  from: EMAIL_UKR_NET_ADDRESS,
  to: 'sabat39959@jalunaki.com',
  subject: 'Hello ✔',
  text: 'Hello world?',
  html: '<b>Hello world?</b>',
};

transporter
  .sendMail(email)
  .then(() => console.log('Message sent successfully'))
  .catch(error => console.log(error.message));
