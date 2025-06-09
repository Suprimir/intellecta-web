import { NextRequest, NextResponse } from "next/server";
import { pool } from "@/libs/mysql";

export async function POST(request: NextRequest) {
  try {
    const { applicationId, uuid } = await request.json();

    if (!applicationId) {
      return NextResponse.json(
        { message: "Falta el ID de la solicitud." },
        { status: 400 }
      );
    }

    await pool.query(
      "UPDATE instructor_applications SET status = 'accepted' WHERE id = ?",
      [applicationId]
    );

    await pool.query("UPDATE users SET role = 'instructor' WHERE uuid = ?", [
      [uuid],
    ]);

    return NextResponse.json(
      { message: "Solicitud aceptada correctamente." },
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
