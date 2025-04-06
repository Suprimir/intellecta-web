import { NextResponse } from "next/server";
import { pool } from "@/libs/mysql";
import bcrytp from "bcrypt";
import { SendMailConfirmation, transporter } from "@/libs/mailService";
import { randomUUID } from "crypto";
import { generateMailConfirmationHTML } from "@/components/MailConfirmation";

type RequestBody = {
  insertId: number;
  affectedRows: number;
};

interface User {
  user_ID: string;
  username: string;
  email: string;
  password: string;
  role: "student" | "instructor" | "admin";
  profilePicture: string | null;
}

export async function POST(request: Request) {
  try {
    const user: User = await request.json();

    // Verificamos que todos los campos necesarios estan.
    if (!user.username || !user.email || !user.password) {
      return NextResponse.json(
        { message: "Todos los campos son requeridos" },
        { status: 400 }
      );
    }

    // Si el nombre de usuario es menor a 8 regresamos un error para avisar al usuario
    if (user.username.length < 8) {
      return NextResponse.json(
        { message: "El usuario debe tener mas de 8 caracteres." },
        { status: 400 }
      );
    }

    // Verificamos que el correo tengo un formato exacto
    if (!/\S+[@]+\S+[.]+\S+/.test(user.email)) {
      return NextResponse.json(
        { message: "El email esta en un formato incorrecto." },
        { status: 400 }
      );
    }

    // Verificamos que la contraseña tenga mas de 8 caracteres si no regresa error
    if (user.password.length < 8) {
      return NextResponse.json(
        { message: "La contraseña debe contener al menos 8 caracteres" },
        { status: 400 }
      );
    }

    const [userAlreadyExist]: User[] = await pool.query(
      "SELECT * FROM users WHERE username = ? OR email = ?",
      [user.username, user.email]
    );

    if (userAlreadyExist) {
      return NextResponse.json(
        { message: "El usuario o el correo ya está registrado" },
        { status: 409 }
      );
    }
    const userUUID = crypto.randomUUID();

    const hashedPassword = bcrytp.hashSync(user.password, 10);

    await pool.query("INSERT INTO users SET ?", {
      user_ID: userUUID,
      username: user.username,
      email: user.email,
      password: hashedPassword,
      role: user.role,
      verified: 0,
    });

    const verifyToken = randomUUID();

    const resultToken: RequestBody = await pool.query(
      "INSERT INTO emailToken SET ?",
      {
        expired_At: new Date(Date.now() + 1000 * 60 * 60 * 24 * 7),
        token: verifyToken,
        user_ID: userUUID,
      }
    );

    // Envia el correo de confirmacion
    await SendMailConfirmation(user.email, verifyToken);

    return NextResponse.json({
      message: "Usuario registrado correctamente",
      username: user.username,
      email: user.email,
      password: user.password,
    });
  } catch (error: unknown) {
    return NextResponse.json(
      {
        message: (error as Error).message,
      },
      {
        status: 500,
      }
    );
  }
}
