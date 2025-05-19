import { NextRequest, NextResponse } from "next/server";
import { pool } from "@/libs/mysql";
import { SendMailForgotPassword } from "@/libs/mailService";
import { User } from "@/types/api";
import { randomUUID } from "crypto";

export async function POST(request: NextRequest) {
  const { email } = await request.json();

  try {
    const user: User[] = await pool.query(
      "SELECT uuid, username, email FROM users WHERE email = ? LIMIT 1",
      email
    );

    if (user.length === 0) {
      return NextResponse.json(
        { message: "El email no existe en la BD" },
        { status: 500 }
      );
    }

    const token = randomUUID();
    await pool.query(
      "INSERT INTO resetPassTokens (expired_At, token, uuid) VALUE (?, ?, ?)",
      [new Date(Date.now()), token, user[0].uuid]
    );

    pool.end();

    await SendMailForgotPassword(user[0], token);

    return NextResponse.json({ message: "La solicitud fue un exito" });
  } catch (error: unknown) {
    console.error(error);

    await pool.end();

    return NextResponse.json(
      { message: (error as Error).message },
      { status: 500 }
    );
  }
}
