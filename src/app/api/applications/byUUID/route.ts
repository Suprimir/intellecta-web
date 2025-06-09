import { NextResponse, NextRequest } from "next/server";
import { pool } from "@/libs/mysql";
import { verify } from "jsonwebtoken";
import { InstructorApplications } from "@/types/api";

export async function GET(request: NextRequest) {
  try {
    const token = request.cookies.get("sessionToken")?.value;

    if (!token) {
      return NextResponse.json({ message: "No autorizado" }, { status: 401 });
    }

    const payload = verify(token, process.env.JWT_SECRET!) as {
      uuid: string;
      rol: string;
    };

    const applications: InstructorApplications[] = await pool.query(
      "SELECT * FROM instructor_applications WHERE user_ID = ?",
      [payload.uuid]
    );

    if (applications.length === 0) {
      return NextResponse.json(
        { message: "No hay aplicaciones para este usuario." },
        { status: 404 }
      );
    }

    return NextResponse.json(applications, { status: 200 });
  } catch (error: unknown) {
    console.error(error);
    return NextResponse.json(
      { message: (error as Error).message },
      { status: 500 }
    );
  }
}
