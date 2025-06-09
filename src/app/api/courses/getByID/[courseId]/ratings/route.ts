import { NextResponse, NextRequest } from "next/server";
import { pool } from "@/libs/mysql";
import { verify } from "jsonwebtoken";
import { RequestBody } from "@/types/api";

export async function POST(
  request: NextRequest,
  { params }: { params: Promise<{ courseId: number }> }
) {
  const { rating } = await request.json();
  const { courseId } = await params;

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

    const exists: RequestBody[] = await pool.query(
      "SELECT * FROM ratings WHERE user_ID = ? AND course_ID = ?",
      [payload.uuid, courseId]
    );

    let res: RequestBody;

    if (exists.length === 0) {
      res = await pool.query(
        "INSERT INTO ratings (user_ID, course_ID, rating) VALUES (?, ?, ?)",
        [payload.uuid, courseId, rating]
      );
    } else {
      res = await pool.query(
        "UPDATE ratings SET rating = ? WHERE user_ID = ? AND course_ID = ?",
        [rating, payload.uuid, courseId]
      );
    }

    if (res.affectedRows === 0) {
      return NextResponse.json(
        { message: "No se pudo agregar el rating." },
        { status: 500 }
      );
    }

    return NextResponse.json(
      { message: "Rating agregado exitosamente." },
      { status: 201 }
    );
  } catch (error: unknown) {
    console.error(error);
    return NextResponse.json(
      { message: (error as Error).message },
      { status: 500 }
    );
  }
}
