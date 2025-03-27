import { NextResponse } from "next/server";
import { pool } from "@/libs/mysql";

type RequestBody = {
  insertId: number;
  affectedRows: number;
};

interface Courses {
  course_ID: number;
  course_Name: string;
  course_Date: string;
  course_Duration: Date;
  instructor_ID: number;
  category_ID: number;
  material: string;
}
export async function GET(
  request: Request,
  { params }: { params: Promise<{ courseId: number }> }
) {
  try {
    const { courseId } = await params;

    const result = await pool.query(
      "SELECT * FROM courses WHERE course_ID = ?",
      courseId
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

export async function PUT(
  request: Request,
  { params }: { params: Promise<{ courseId: number }> }
) {
  try {
    const data = await request.json();
    const { courseId } = await params;

    const result: RequestBody = await pool.query(
      "UPDATE courses SET ? WHERE course_ID = ?",
      [data, courseId]
    );

    if (result.affectedRows == 0) {
      return NextResponse.json(
        {
          message: "Curso no encontrado.",
        },
        {
          status: 404,
        }
      );
    }
    const [updatedCourse]: Courses[] = await pool.query(
      "SELECT * FROM courses WHERE course_ID = ?",
      courseId
    );

    return NextResponse.json(updatedCourse);
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
  { params }: { params: Promise<{ courseId: number }> }
) {
  try {
    const { courseId } = await params;

    const result: RequestBody = await pool.query(
      "DELETE FROM courses WHERE course_ID = ?",
      courseId
    );

    if (result.affectedRows == 0) {
      return NextResponse.json(
        {
          message: "Curso no encontrado.",
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
