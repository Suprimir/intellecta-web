// ruta /api/unit_courses

import { NextRequest, NextResponse } from "next/server";
import { pool } from "@/libs/mysql";
import { UnitCourse, RequestBody } from "@/types/api";

export async function GET(request: NextRequest) {
  try {
    const UnitsCourses: UnitCourse[] = await pool.query(
      "SELECT * FROM units_courses"
    );

    if (UnitsCourses.length < 0) {
      return NextResponse.json(
        { message: "No hay units_courses" },
        { status: 500 }
      );
    }

    return NextResponse.json(UnitsCourses);
  } catch (error: unknown) {
    console.error(error);
    return NextResponse.json(
      { message: (error as Error).message },
      { status: 500 }
    );
  }
}

export async function POST(request: NextRequest) {
  const unitCourse: UnitCourse = await request.json();

  try {
    const res: RequestBody = await pool.query(
      "INSERT INTO units_courses (unit_number, course_ID, title) VALUE (?, ?, ?)",
      [unitCourse.unit_number, unitCourse.course_ID, unitCourse.title]
    );

    if (res.affectedRows > 0) {
      return NextResponse.json({ message: "Unidad creada" });
    }
  } catch (error: unknown) {
    console.error(error);
    return NextResponse.json(
      { message: (error as Error).message },
      { status: 500 }
    );
  }
}
