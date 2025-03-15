import { NextResponse } from "next/server";
import { pool } from "@/libs/mysql";

type RequestBody = {
  insertId: number;
  affectedRows: number;
};

export async function GET(
  request: Request,
  { params }: { params: Promise<{ courseId: number }> }
) {
  try {
    const { courseId } = await params;

    const result = await pool.query(
      "SELECT * FROM cursos WHERE id = ?",
      courseId
    );
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

export async function PUT(
  request: Request,
  { params }: { params: Promise<{ courseId: number }> }
) {
  try {
    const data = await request.json();
    const { courseId } = await params;

    const result: RequestBody = await pool.query(
      "UPDATE cursos SET ? WHERE id = ?",
      [data, courseId]
    );

    if (result.affectedRows == 0) {
      return NextResponse.json(
        {
          message: "Producto no encontrado.",
        },
        {
          status: 404,
        }
      );
    }

    const updatedCourse: any = await pool.query(
      "SELECT * FROM cursos WHERE id = ?",
      courseId
    );

    return NextResponse.json(updatedCourse[0]);
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

export async function DELETE(
  request: Request,
  { params }: { params: Promise<{ courseId: number }> }
) {
  try {
    const { courseId } = await params;

    const result: RequestBody = await pool.query(
      "DELETE FROM cursos WHERE id = ?",
      courseId
    );

    if (result.affectedRows == 0) {
      return NextResponse.json(
        {
          message: "Producto no encontrado.",
        },
        {
          status: 404,
        }
      );
    }

    return new Response(null, { status: 204 });
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
