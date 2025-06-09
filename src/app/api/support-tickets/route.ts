import { NextResponse, NextRequest } from "next/server";
import { pool } from "@/libs/mysql";
import { verify } from "jsonwebtoken";
import { Ticket } from "@/types/api";

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

    const tickets: Ticket[] = await pool.query(
      `
        SELECT st.id, st.user_R_ID, u.username, st.problem_Category, st.resolution, st.problem_Description, st.status, st.created_at 
        FROM support_tickets st
        JOIN users u ON U.uuid = st.user_R_ID;
        `
    );

    if (tickets.length === 0) {
      return NextResponse.json(
        { message: "No hay tickets de soporte." },
        { status: 404 }
      );
    }

    return NextResponse.json(tickets);
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
    const formData = await request.formData();

    const problem_Category = formData.get("problem_Category") as string;
    const problem_Description = formData.get("description") as string;

    if (!problem_Category || !problem_Description) {
      return NextResponse.json(
        { message: "Faltan parametros requeridos." },
        { status: 400 }
      );
    }

    // Obtener el payload del token de la cookie
    const token = request.cookies.get("sessionToken")?.value;

    if (!token) {
      return NextResponse.json({ message: "No autorizado" }, { status: 401 });
    }

    const payload = verify(token, process.env.JWT_SECRET!) as {
      uuid: string;
    };

    await pool.query(
      "INSERT INTO support_tickets (user_R_ID, problem_Category, problem_Description) VALUES (?, ?, ?)",
      [payload.uuid, problem_Category, problem_Description]
    );

    return NextResponse.json(
      { message: "Ticket de soporte creado correctamente." },
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
