import { NextResponse } from "next/server";
import { pool } from "@/libs/mysql";

type RequestBody = {
  insertId: number;
  affectedRows: number;
};

// deprecated (se uso con tabla de ejemplo no la actual)

export async function GET() {
  try {
    const result = await pool.query("SELECT * FROM cursos");

    return NextResponse.json(result);
  } catch (error: any) {
    console.log(error);

    return NextResponse.json(
      {
        message: error.message,
      },
      {
        status: 500,
      }
    );
  }
}

export async function POST(request: Request) {
  try {
    const { name, description } = await request.json();

    const result: RequestBody = await pool.query("INSERT INTO cursos SET ?", {
      name,
      description,
    });

    console.log(result);

    return NextResponse.json({
      name,
      description,
      id: result.insertId,
    });
  } catch (error: any) {
    console.log(error);

    return NextResponse.json(
      {
        message: error.message,
      },
      {
        status: 500,
      }
    );
  }
}
