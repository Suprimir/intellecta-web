// ruta /api/contents/getByUUID/[uuid]/completed/

import { NextResponse, NextRequest } from "next/server";
import { pool } from "@/libs/mysql";
import { ContentCompleted } from "@/types/api";

export async function POST(
  request: NextRequest,
  { params }: { params: Promise<{ uuid: string }> }
) {
  try {
    const { contentsIds } = await request.json();
    const { uuid } = await params;

    if (!contentsIds || !uuid) {
      return NextResponse.json(
        { message: "Faltan parametros en la solicitud." },
        { status: 400 }
      );
    }

    let contentsCompleted: ContentCompleted[] = [];

    if (contentsIds.length > 0) {
      contentsCompleted = await pool.query(
        `SELECT * FROM contents_completed 
         WHERE content_ID IN (${contentsIds.map(() => "?").join(",")}) 
         AND user_ID = ?`,
        [...contentsIds, uuid]
      );
    }

    return NextResponse.json(contentsCompleted);
  } catch (error: unknown) {
    console.log(error);
    return NextResponse.json(
      { message: (error as Error).message },
      { status: 500 }
    );
  }
}
