import { NextRequest, NextResponse } from "next/server";
import { pool } from "@/libs/mysql";
import { verify } from "jsonwebtoken";
import { RequestBody } from "@/types/api";

export async function POST(
  request: NextRequest,
  { params }: { params: Promise<{ uuid: string }> }
) {
  const { uuid } = await params;

  try {
    // Verificacion de autoridad
    const token = request.cookies.get("sessionToken")?.value;

    if (!token) {
      return NextResponse.json({ message: "No autorizado" }, { status: 401 });
    }

    const payload = verify(token, process.env.JWT_SECRET!) as {
      uuid: string;
      rol: string;
    };

    if (payload.rol !== "admin") {
      return NextResponse.json({ message: "No autorizado" }, { status: 403 });
    }

    // Desactivacion del usuario
    const result: RequestBody = await pool.query(
      "UPDATE users SET active = 0 WHERE uuid = ?",
      [uuid]
    );

    if (result.affectedRows === 0) {
      return NextResponse.json(
        { message: "No se pudo desactivar el usuario." },
        { status: 500 }
      );
    }

    pool.end();

    return NextResponse.json({ message: "Usuario desactivado correctamente." });
  } catch (error: unknown) {
    console.error(error);
    return NextResponse.json(
      { message: (error as Error).message },
      { status: 500 }
    );
  }
}
