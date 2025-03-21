import { NextResponse } from "next/server";
import { pool } from "@/libs/mysql";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";

export async function POST(request: Request) {
  try {
    const { username, password } = await request.json();

    const result: any = await pool.query(
      "SELECT * FROM users WHERE username = ?",
      [username]
    );

    if (result.length > 0) {
      const isPasswordValid = bcrypt.compareSync(password, result[0].password);

      if (isPasswordValid) {
        const token = jwt.sign(
          {
            exp: Math.floor(Date.now() / 1000) + 60 * 60 * 24 * 30,
            uuid: result[0].userID,
            username,
            email: result[0].email,
          },
          "secret"
        );

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
  } catch (error: any) {
    return NextResponse.json({ message: error.message }, { status: 500 });
  }
}
