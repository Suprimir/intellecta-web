import { NextResponse, NextRequest } from "next/server";
import { pool } from "@/libs/mysql";
import { verify } from "jsonwebtoken";
import { SendTicketResolvedEmail } from "@/libs/mailService";
import { User } from "@/types/api";

export async function POST(request: NextRequest) {
  try {
    const formData = await request.formData();
    const ticketId = formData.get("ticketId") as string;
    const resolution = formData.get("resolution") as string;

    if (!ticketId) {
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

    if (payload.rol !== "admin") {
      return NextResponse.json({ message: "No autorizado" }, { status: 403 });
    }

    const user: User[] = await pool.query(
      `
            SELECT u.username, u.email FROM support_tickets st
            JOIN users u ON u.uuid = st.user_R_ID
            WHERE st.id = 1;
          `,
      [ticketId]
    );

    await pool.query(
      "UPDATE support_tickets SET status = 'closed', resolution = ? WHERE id = ?",
      [resolution, ticketId]
    );

    SendTicketResolvedEmail(user[0], Number(ticketId), resolution);

    return NextResponse.json({ message: "Ticket completado." });
  } catch (error: unknown) {
    console.error(error);
    return NextResponse.json(
      { message: (error as Error).message },
      { status: 500 }
    );
  }
}
