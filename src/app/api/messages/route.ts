import { NextResponse } from "next/server";
import { pool } from "@/libs/mysql";

interface RequestBody {
  insertId: number;
  affectedRows: number;
}

export async function GET() {
  try {
    const result = await pool.query("SELECT * FROM messages");
    return NextResponse.json(result);
  } catch (error: unknown) {
    console.log(error);
    return NextResponse.json(
      { message: (error as Error).message },
      { status: 500 }
    );
  }
}

export async function POST(request: Request) {
  try {
    const data = await request.json();

    const result: RequestBody = await pool.query(
      "INSERT INTO messages SET ?",
      data
    );

    return NextResponse.json({
      message: "Mensaje creado exitosamente",
      messageId: result.insertId,
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
