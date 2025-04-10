import { NextResponse } from "next/server";
import { pool } from "@/libs/mysql";
import bcrypt from "bcrypt";
import { SendMailConfirmation } from "@/libs/mailService";
import { randomUUID } from "crypto";
import { userInput, validateUser } from "@/utils/validateUser";

export async function POST(request: Request) {
  try {
    const user: userInput = await request.json();

    // Validaciones de usuario
    const validationErrors = await validateUser(user);
    if (validationErrors.length > 0) {
      return NextResponse.json(
        validationErrors.map((error) => ({
          field: error.field,
          message: error.messsage,
        })),
        { status: 400 }
      );
    }

    try {
      // Verificamos si ya existe un usuario
      const existingUsers: userInput[] = await pool.query(
        "SELECT * FROM users WHERE username = ? OR email = ?",
        [user.username, user.email]
      );

      await pool.end();

      if (existingUsers.length > 0) {
        const existingUser = existingUsers[0] as userInput;
        const duplicatedField =
          existingUser.username === user.username ? "username" : "email";

        return NextResponse.json(
          { message: `El ${duplicatedField} ya esta registrado` },
          { status: 409 }
        );
      }

      // Generamos UUID única y password hasheado
      const userUUID = randomUUID();
      const hashedPassword = await bcrypt.hashSync(user.password, 10);

      await pool.query("START TRANSACTION");

      // Realizamos la inserción de datos
      await pool.query("INSERT INTO users SET ?", {
        user_ID: userUUID,
        username: user.username,
        email: user.email,
        password: hashedPassword,
        role: user.role || "student",
        verified: 0,
      });

      const verifyToken = randomUUID();

      await pool.query("INSERT INTO emailToken SET ?", {
        expired_At: new Date(Date.now() + 1000 * 60 * 60 * 24 * 7),
        token: verifyToken,
        user_ID: userUUID,
      });

      await pool.end();

      // Envia el correo de confirmación
      await SendMailConfirmation(user, verifyToken);

      await pool.query("COMMIT");
      await pool.end();

      return NextResponse.json(
        {
          message: "Usuario registrado correctamente",
          username: user.username,
          email: user.email,
        },
        { status: 201 }
      );
    } catch (error: unknown) {
      await pool.query("ROLLBACK");
      await pool.end();
      throw error;
    }
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
