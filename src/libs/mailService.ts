import { User } from "@/types/api";
import { renderConfirmationEmail } from "@/utils/renderConfirmationEmail";
import { renderForgotPasswordEmail } from "@/utils/renderForgotPasswordEmail";

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

export async function SendMailConfirmation(user: User, token: string) {
  await transporter.sendMail({
    from: '"Intellecta" <intellectawebapp@gmail.com>',
    to: user.email,
    subject: "Confirma tu Correo - Intellecta",
    text: "Intellecta Web APP",
    html: renderConfirmationEmail(user.username, token),
  });
}

export async function SendMailForgotPassword(user: User, token: string) {
  await transporter.sendMail({
    from: '"Intellecta" <intellectawebapp@gmail.com>',
    to: user.email,
    subject: "Restablece tu contraseña - Intellecta",
    text: "Intellecta Web APP",
    html: renderForgotPasswordEmail(user.username, token),
  });
}
