import { NextResponse, NextRequest } from "next/server";
import { pool } from "@/libs/mysql";
import { verify } from "jsonwebtoken";
import { InstructorApplications, RequestBody } from "@/types/api";

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

    if (payload.rol !== "admin") {
      return NextResponse.json({ message: "No autorizado" }, { status: 403 });
    }

    const applications: InstructorApplications[] = await pool.query(
      `
        SELECT ia.id, ia.user_ID, CONCAT_WS(" ", u.name, u.last_name) AS full_Name, ia.status, ia.professional_Experience, ia.qualifications, ia.created_at 
        FROM instructor_applications ia
        JOIN users u ON u.uuid = ia.user_ID;
      `
    );

    if (applications.length === 0) {
      return NextResponse.json(
        { message: "No hay aplicaciones." },
        { status: 404 }
      );
    }

    return NextResponse.json(applications);
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
    const { experience, specialties } = await request.json();

    if (!experience || !specialties) {
      return NextResponse.json(
        { message: "Faltan parametros requeridos." },
        { status: 400 }
      );
    }

    const token = request.cookies.get("sessionToken")?.value;

    if (!token) {
      return NextResponse.json({ message: "No autorizado" }, { status: 401 });
    }
    const payload = verify(token, process.env.JWT_SECRET!) as {
      uuid: string;
      rol: string;
    };

    const result: RequestBody = await pool.query(
      "INSERT INTO instructor_applications (user_ID, professional_Experience, qualifications) VALUES (?, ?, ?)",
      [payload.uuid, experience, specialties]
    );

    if (result.affectedRows === 0) {
      return NextResponse.json(
        { message: "No se pudo crear la aplicacion." },
        { status: 500 }
      );
    }

    return NextResponse.json(
      { message: "Aplicacion creada exitosamente." },
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
