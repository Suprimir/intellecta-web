import { NextResponse } from "next/server";
import { pool } from "@/libs/mysql";
import bcrytp from "bcrypt";
import { SendMailConfirmation } from "@/libs/mailService";
import { randomUUID } from "crypto";
import { userInput, validateUser } from "@/app/utils/validateUser";

export async function POST(request: Request) {
  try {
    const user: userInput = await request.json();

    // Validaciones de usuario
    const validationErrors = validateUser(user);

    if (validationErrors.length > 0) {
      return NextResponse.json(
        validationErrors.map((error) => ({
          field: error.field,
          message: error.messsage,
        })),
        { status: 409 }
      );
    }

    // Verificamos si ya existe un usuario
    const [userAlreadyExist]: userInput[] = await pool.query(
      "SELECT * FROM users WHERE username = ? OR email = ?",
      [user.username, user.email]
    );

    if (userAlreadyExist) {
      return NextResponse.json(
        { message: "El usuario o el correo ya está registrado" },
        { status: 409 }
      );
    }

    // Generamos UUID unica y password hasheado para seguridad
    const userUUID = crypto.randomUUID();
    const hashedPassword = bcrytp.hashSync(user.password, 10);

    // Realizamos la insercion de datos
    await pool.query("INSERT INTO users SET ?", {
      user_ID: userUUID,
      username: user.username,
      email: user.email,
      password: hashedPassword,
      role: user.role,
      verified: 0,
    });

    // Aqui realizamos ya el proceso de confirmacion probablemente refactorizar esto.
    const verifyToken = randomUUID();

    await pool.query("INSERT INTO emailToken SET ?", {
      expired_At: new Date(Date.now() + 1000 * 60 * 60 * 24 * 7),
      token: verifyToken,
      user_ID: userUUID,
    });

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
