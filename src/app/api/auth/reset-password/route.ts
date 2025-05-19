import { NextRequest, NextResponse } from "next/server";
import { pool } from "@/libs/mysql";
import bcrypt from "bcrypt";

type RequestBody = {
  insertId: number;
  affectedRows: number;
};

export async function POST(request: NextRequest) {
  const { token, newPassword } = await request.json();

  try {
    const resetPassTokens: { uuid: string }[] = await pool.query(
      "SELECT uuid FROM resetPassTokens WHERE token = ?",
      token
    );

    if (resetPassTokens.length === 0) {
      return NextResponse.json(
        { message: "El token no existe" },
        { status: 500 }
      );
    }

    const hashedPassword = await bcrypt.hashSync(newPassword, 10);

    const changePassword: RequestBody = await pool.query(
      "UPDATE users SET password = ? WHERE uuid = ?",
      [hashedPassword, resetPassTokens[0].uuid]
    );

    if (changePassword.affectedRows > 0) {
      return NextResponse.json({
        message: "Contraseña cambiada correctamente ",
      });
    }
  } catch (error: unknown) {
    console.error(error);

    await pool.end();

    return NextResponse.json(
      { message: (error as Error).message },
      { status: 500 }
    );
  }
}
