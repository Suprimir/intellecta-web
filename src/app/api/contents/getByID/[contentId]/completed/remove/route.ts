// ruta /api/contents/getByID/[contentId]/completed/remove

import { pool } from "@/libs/mysql";
import { ContentCompleted, RequestBody } from "@/types/api";
import { NextResponse, NextRequest } from "next/server";

export async function POST(
  request: NextRequest,
  { params }: { params: Promise<{ contentId: number }> }
) {
  try {
    const { uuid } = await request.json();
    const { contentId } = await params;

    if (!contentId || !uuid) {
      return NextResponse.json(
        { message: "Faltan parametros en la solicitud." },
        { status: 400 }
      );
    }

    const result: RequestBody = await pool.query(
      "DELETE FROM contents_completed WHERE content_ID = ? AND user_ID = ?",
      [contentId, uuid]
    );

    if (result.affectedRows === 0) {
      return NextResponse.json(
        { message: "Hubo un error de nuestro lado" },
        { status: 500 }
      );
    }

    return NextResponse.json({
      message: "Desmarcado correctamente",
    });
  } catch (error: unknown) {
    console.log(error);
    return NextResponse.json(
      { message: (error as Error).message },
      { status: 500 }
    );
  }
}
