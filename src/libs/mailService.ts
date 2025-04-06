import { generateMailConfirmationHTML } from "@/components/MailConfirmation";
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
  userEmail: string,
  verifyToken: string
) {
  const emailHTML = generateMailConfirmationHTML(verifyToken);

  await transporter.sendMail({
    from: '"Intellecta" <intellectawebapp@gmail.com>',
    to: userEmail,
    subject: "Confirma tu Correo - Intellecta",
    text: "Intellecta Web APP",
    html: emailHTML,
  });
}
