import { NextRequest, NextResponse } from "next/server";
import { pool } from "@/libs/mysql";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import { userInput } from "@/app/utils/validateUser";

export async function POST(request: NextRequest) {
  try {
    const { username, password } = await request.json();

    // Obtenemos los datos del usuario
    const [result]: userInput[] = await pool.query(
      "SELECT * FROM users WHERE username = ?",
      [username]
    );

    if (result) {
      // Verificamos que las contraseñas coincidan
      const isPasswordValid = bcrypt.compareSync(password, result.password);

      // Al validar creamos una cookie de session
      if (isPasswordValid) {
        const token = jwt.sign(
          {
            exp: Math.floor(Date.now() / 1000) + 60 * 60 * 24 * 30,
            uuid: result.user_ID,
            username,
            email: result.email,
            rol: result.role,
          },
          "secret"
        );

        // Creamos nuestro response con un mensaje de confirmacion del login y con la cookie de session
        const response = NextResponse.json({ message: "Login Succes." });

        response.cookies.set("sessionToken", token, {
          httpOnly: true,
          maxAge: 1000 * 60 * 60 * 24 * 30,
          path: "/",
          sameSite: "strict",
          secure: process.env.NODE_ENV === "production",
        });

        return response;
      } else {
        return NextResponse.json(
          {
            message: "El usuario o contraseña es incorrecta.",
          },
          {
            status: 500,
          }
        );
      }
    } else {
      return NextResponse.json(
        {
          message: "El usuario no existe.",
        },
        {
          status: 404,
        }
      );
    }
  } catch (error: unknown) {
    return NextResponse.json(
      { message: (error as Error).message },
      { status: 500 }
    );
  }
}
