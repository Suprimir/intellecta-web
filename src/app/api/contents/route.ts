import { NextResponse } from "next/server";
import { pool } from "@/libs/mysql";

type RequestBody = {
  insertId: number;
  affectedRows: number;
};

interface Contents {
  content_ID: number;
  course_ID: number;
  content_Description: string;
  document_Path: string;
  content_Rating: number;
}

export async function GET() {
  try {
    const result = await pool.query("SELECT * FROM contents");
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
      "INSERT INTO contents SET ?",
      data
    );

    return NextResponse.json({
      message: "Contenido creado exitosamente",
      contentId: result.insertId,
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
