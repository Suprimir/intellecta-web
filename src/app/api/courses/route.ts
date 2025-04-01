import { NextResponse } from "next/server";
import { pool } from "@/libs/mysql";

type RequestBody = {
  insertId: number;
  affectedRows: number;
};

export async function GET(request: Request) {
  try {
    const result = await pool.query("SELECT * FROM courses");
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
      "INSERT INTO courses SET ?",
      data
    );

    return NextResponse.json({
      message: "Curso creado exitosamente",
      courseId: result.insertId,
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
