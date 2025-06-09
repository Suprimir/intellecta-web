import { NextResponse, NextRequest } from "next/server";
import { pool } from "@/libs/mysql";
import { Certificate } from "@/types/api";

export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ uuid: string }> }
) {
  try {
    const { uuid } = await params;

    const certificates: Certificate[] = await pool.query(
      `
        SELECT c.user_ID, u.username, c.course_ID, c.pdf_Path, c.issue_Date, co.name
        FROM certificates c
        JOIN courses co ON co.id = c.course_ID
        JOIN users u ON u.uuid = c.user_ID
        WHERE c.user_ID = ?;
      `,
      [uuid]
    );

    if (certificates.length === 0) {
      return NextResponse.json(
        { message: "No hay certificados para el uuid" },
        { status: 404 }
      );
    }

    return NextResponse.json(certificates);
  } catch (error: unknown) {
    console.error(error);
    return NextResponse.json(
      { message: (error as Error).message },
      { status: 500 }
    );
  }
}