"use server";

import { NextRequest, NextResponse } from "next/server";
import { pool } from "@/libs/mysql";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import { User } from "@/types/api";

const JWT_SECRET = process.env.JWT_SECRET || "";

export async function POST(request: NextRequest) {
  try {
    const { username, password } = await request.json();

    // Obtenemos los datos del usuario
    const users: User[] = await pool.query(
      "SELECT * FROM users WHERE username = ? LIMIT 1",
      [username]
    );

    await pool.end();

    if (!users) {
      return NextResponse.json(
        { message: "Credenciales inválidas" },
        { status: 401 }
      );
    }

    const user = users[0] as User;

    // Verificamos que las contraseñas coincidan
    const isPasswordValid = bcrypt.compareSync(password, user.password);

    if (!isPasswordValid) {
      return NextResponse.json(
        { message: "Credenciales inválidas" },
        { status: 401 }
      );
    }

    // Al validar creamos una cookie de session
    const token = jwt.sign(
      {
        exp: Math.floor(Date.now() / 1000) + 60 * 60 * 24 * 30,
        uuid: user.user_ID,
        username,
        email: user.email,
        rol: user.role,
      },
      JWT_SECRET
    );

    // Creamos nuestro response con un mensaje de confirmacion del login y con la cookie de session
    const response = NextResponse.json({
      message: "Inicio de sesión exitoso.",
    });

    response.cookies.set("sessionToken", token, {
      httpOnly: true,
      maxAge: 1000 * 60 * 60 * 24 * 30,
      path: "/",
      sameSite: "strict",
      secure: process.env.NODE_ENV === "development",
    });

    return response;
  } catch (error: unknown) {
    console.error("Error de autenticacion:", error);

    await pool.end();

    return NextResponse.json(
      { message: (error as Error).message },
      { status: 500 }
    );
  }
}
