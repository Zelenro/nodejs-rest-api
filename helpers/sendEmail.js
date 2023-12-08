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

const sendEmail = data => {
  const email = { ...data, from: EMAIL_UKR_NET_ADDRESS };
  return transporter
    .sendMail(email)
    .then(() => console.log('Verification message sent successfully'))
    .catch(error => console.log(error.message));
};

export default sendEmail;
