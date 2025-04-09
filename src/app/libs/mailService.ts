import { renderConfirmationEmail } from "@/app/lib/email/renderEmail";
const nodemailer = require("nodemailer");

export const transporter = nodemailer.createTransport({
  host: "smtp.gmail.com",
  port: 587,
  secure: false,
  auth: {
    user: process.env.EMAIL_ADDRESS,
    pass: process.env.EMAIL_PASSWORD,
  },
  tls: {
    ciphers: "SSLv3",
  },
});

export async function SendMailConfirmation(
  username: string,
  email: string,
  verifyToken: string
) {
  await transporter.sendMail({
    from: '"Intellecta" <intellectawebapp@gmail.com>',
    to: email,
    subject: "Confirma tu Correo - Intellecta",
    text: "Intellecta Web APP",
    html: renderConfirmationEmail(username, email, verifyToken),
  });
}
