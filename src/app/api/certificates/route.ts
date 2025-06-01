import { NextResponse, NextRequest } from "next/server";
import { pool } from "@/libs/mysql";

export async function GET(request: NextRequest) {
  try {
    const searchParams = request.nextUrl.searchParams;
    const uuid = searchParams.get("uuid");
    const course_ID = searchParams.get("course_ID");

    if (!uuid || !course_ID) {
      return NextResponse.json(
        { message: "Faltan parametros requeridos." },
        { status: 400 }
      );
    }

    const certificate: [] = await pool.query(
      "SELECT * FROM certificates WHERE user_ID = ? AND course_ID = ?",
      [uuid, course_ID]
    );

    if (certificate.length === 0) {
      return NextResponse.json(
        { message: "No hay certificado para este curso." },
        { status: 404 }
      );
    }

    return NextResponse.json(
      { message: "Existe certificado para este usuario." },
      { status: 200 }
    );
  } catch (error: unknown) {
    console.error(error);
    return NextResponse.json(
      { message: (error as Error).message },
      { status: 500 }
    );
  }
}

export async function POST(request: NextRequest) {
  try {
    const { uuid, course_ID } = await request.json();

    const unitsIds: [] = await pool.query(
      "SELECT id FROM units_courses WHERE course_ID = ?",
      [course_ID]
    );
    const unitsIdsArray = unitsIds.map((unit: { id: number }) => unit.id);

    const contentIds: [] = await pool.query(
      "SELECT id FROM contents WHERE unit_ID IN (?)",
      [unitsIdsArray]
    );

    const contentIdsArray = contentIds.map(
      (content: { id: number }) => content.id
    );

    const contentsCompleted: [] = await pool.query(
      "SELECT 1 as completed FROM contents_completed WHERE content_ID IN (?) AND user_ID = ?",
      [contentIdsArray, uuid]
    );

    if (contentsCompleted.length === contentIdsArray.length) {
      await pool.query(
        "INSERT INTO certificates (user_ID, course_ID) VALUES (?, ?)",
        [uuid, course_ID]
      );
      return NextResponse.json(
        { message: "Certificado solicitado." },
        { status: 200 }
      );
    } else {
      return NextResponse.json(
        { message: "No se han completado todos los contenidos" },
        { status: 400 }
      );
    }
  } catch (error: unknown) {
    console.log(error);
    return NextResponse.json(
      { message: (error as Error).message },
      { status: 500 }
    );
  }
}
