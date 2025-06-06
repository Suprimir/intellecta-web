import { NextRequest, NextResponse } from "next/server";
import { pool } from "@/libs/mysql";
import { verify } from "jsonwebtoken";
import { RequestBody } from "@/types/api";

export async function DELETE(
  request: NextRequest,
  { params }: { params: Promise<{ courseId: number }> }
) {
  try {
    const { courseId } = await params;

    if (!courseId) {
      return NextResponse.json(
        { message: "El ID del curso es requerido." },
        { status: 400 }
      );
    }

    const res: [{ instructor_ID: string }] = await pool.query(
      "SELECT instructor_ID FROM courses WHERE id = ?",
      [courseId]
    );

    if (!res) {
      return NextResponse.json(
        { message: "Curso no encontrado." },
        { status: 404 }
      );
    }

    // Verificacion de autoridad
    const token = request.cookies.get("sessionToken")?.value;

    if (!token) {
      return NextResponse.json({ message: "No autorizado" }, { status: 401 });
    }

    const payload = verify(token, process.env.JWT_SECRET!) as {
      uuid: string;
      rol: string;
    };

    if (payload.rol !== "admin" || payload.uuid !== res[0].instructor_ID) {
      return NextResponse.json({ message: "No autorizado" }, { status: 403 });
    }

    // Eliminamos el curso
    const result: RequestBody = await pool.query(
      "DELETE FROM courses WHERE id = ?",
      [courseId]
    );

    pool.end();

    if (result.affectedRows === 0) {
      return NextResponse.json(
        { message: "No se pudo eliminar el curso." },
        { status: 500 }
      );
    }

    return NextResponse.json({ message: "Curso eliminado exitosamente." });
  } catch (error: unknown) {
    console.log(error);
    return NextResponse.json(
      { message: (error as Error).message },
      { status: 500 }
    );
  }
}
