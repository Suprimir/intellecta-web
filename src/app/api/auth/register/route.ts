import { NextResponse } from "next/server";
import { pool } from "@/libs/mysql";
import bcrytp from 'bcrypt'

type RequestBody = {
  insertId: number;
  affectedRows: number;
};

export async function POST(request: Request) {
  try {
    const { username, email, password } = await request.json();

    if (!username || !email || !password) {
      return NextResponse.json(
        { message: "Todos los campos son requeridos" },
        { status: 400 }
      );
    }

    if (username.length < 8) {
      return NextResponse.json(
        { message: "El usuario debe tener mas de 8 caracteres." },
        { status: 400 }
      );
    }

    if (!/\S+[@]+\S+[.]+\S+/.test(email)) {
      return NextResponse.json(
        { message: "El email esta en un formato incorrecto." },
        { status: 400 }
      );
    }

    if (password.length < 8) {
      return NextResponse.json(
        { message: "La contraseña debe contener al menos 8 caracteres" },
        { status: 400 }
      );
    }

    const userAlreadyExist: any = await pool.query(
      "SELECT * FROM users WHERE username = ? OR email = ?",
      [username, email]
    );

    if (userAlreadyExist.length > 0) {
      return NextResponse.json(
        { message: "El usuario o el correo ya esta registrado" },
        { status: 409 }
      );
    }
    const userUUID = crypto.randomUUID();
    
    const hashedPassword = bcrytp.hashSync(password, 10)

    const result: RequestBody = await pool.query("INSERT INTO users SET ?", {
      userID: userUUID,
      username,
      email,
      password: hashedPassword,
    });

    return NextResponse.json({
      message: "Usuario registrado correctamente",
      username,
      email,
      password,
    });
  } catch (error: any) {
    return NextResponse.json(
      {
        message: error.message,
      },
      {
        status: 500,
      }
    );
  }
}
