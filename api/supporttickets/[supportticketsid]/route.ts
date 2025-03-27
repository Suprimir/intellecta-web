import { NextResponse } from "next/server";
import { pool } from "@/libs/mysql";

type RequestBody = {
  insertId: number;
  affectedRows: number;
};

export async function GET(
  request: Request,
  { params }: { params: Promise<{ ticketId: number }> }
) {
  try {
    const { ticketId } = await params;

    const result = await pool.query(
      "SELECT * FROM support_Tickets WHERE ticket_ID = ?",
      ticketId
    );
    return NextResponse.json(result);
  } catch (error: unknown) {
    console.log(error);
    return NextResponse.json(
      {
        message: (error as Error).message,
      },
      {
        status: 500,
      }
    );
  }
}

export async function POST(request: Request) {
  try {
    const data = await request.json();

    const result: RequestBody = await pool.query(
      "INSERT INTO support_Tickets SET ?",
      data
    );

    return NextResponse.json({
      message: "Ticket de soporte creado exitosamente",
      ticketId: result.insertId,
    });
  } catch (error: unknown) {
    console.log(error);
    return NextResponse.json(
      {
        message: (error as Error).message,
      },
      {
        status: 500,
      }
    );
  }
}

export async function PUT(
  request: Request,
  { params }: { params: Promise<{ ticketId: number }> }
) {
  try {
    const data = await request.json();
    const { ticketId } = await params;

    const result: RequestBody = await pool.query(
      "UPDATE support_Tickets SET ? WHERE ticket_ID = ?",
      [data, ticketId]
    );

    if (result.affectedRows == 0) {
      return NextResponse.json(
        {
          message: "Ticket de soporte no encontrado.",
        },
        {
          status: 404,
        }
      );
    }

    interface SupportTicket {
        ticket_ID: number;
        user_R_ID: string;
        problem_Category: "technical" | "functional" | "bug" | "other category";
        proof_Files: string | null;
        ticket_Status: "open" | "closed" | "in process" | "unknown";
        ticket_Resolution: string | null;
      }
      
      const [updatedTicket]: SupportTicket[] = await pool.query(
        "SELECT * FROM support_Tickets WHERE ticket_ID = ?",
        ticketId
      );

      return NextResponse.json(updatedTicket);
    } catch (error: unknown) {
    console.log(error);
    return NextResponse.json(
      {
        message: (error as Error).message,
      },
      {
        status: 500,
      }
    );
  }
}

export async function DELETE(
  request: Request,
  { params }: { params: Promise<{ ticketId: number }> }
) {
  try {
    const { ticketId } = await params;

    const result: RequestBody = await pool.query(
      "DELETE FROM support_Tickets WHERE ticket_ID = ?",
      ticketId
    );

    if (result.affectedRows == 0) {
      return NextResponse.json(
        {
          message: "Ticket de soporte no encontrado.",
        },
        {
          status: 404,
        }
      );
    }

    return new Response(null, { status: 204 });
  } catch (error: unknown) {
    console.log(error);

    return NextResponse.json(
      {
        message: (error as Error).message,
      },
      {
        status: 500,
      }
    );
  }
}
