import { NextResponse, NextRequest } from "next/server";
import { pool } from "@/libs/mysql";
import { RequestBody } from "@/types/api";

export async function DELETE(
  request: NextRequest,
  { params }: { params: Promise<{ unitId: string }> }
) {
  const { unitId } = await params;

  try {
    const res: RequestBody = await pool.query(
      "DELETE FROM units_courses WHERE id = ?",
      [unitId]
    );

    if (res.affectedRows === 0) {
      return NextResponse.json(
        { message: "No se pudo eliminar." },
        { status: 400 }
      );
    }

    return NextResponse.json({ message: "Eliminado correctamente" });
  } catch (error: unknown) {
    console.error(error);
    return NextResponse.json(
      { message: (error as Error).message },
      { status: 500 }
    );
  }
}
