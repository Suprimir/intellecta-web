// Ruta: /api/courses/getByID/[courseId]/contents

import { NextRequest, NextResponse } from "next/server";
import { pool } from "@/libs/mysql";
import { verify } from "jsonwebtoken";
import {
  Content,
  Course,
  CourseWithUnitContent,
  UnitCourse,
} from "@/types/api";

export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ courseId: number }> }
) {
  // Verificar si hay permisos para modificar
  const token = request.cookies.get("sessionToken")?.value;

  if (!token) {
    return NextResponse.json({ message: "No autorizado" }, { status: 401 });
  }
  const payload = verify(token, process.env.JWT_SECRET!) as {
    uuid: string;
    rol: string;
  };

  const { courseId } = await params;

  if (!courseId || isNaN(courseId)) {
    return NextResponse.json({ message: "courseId inválido" }, { status: 400 });
  }

  const course: Course[] = await pool.query(
    "SELECT * FROM coursesFrontend WHERE id = ?",
    [courseId]
  );

  if (course[0].instructor_ID !== payload.uuid || payload.rol !== "admin") {
    return NextResponse.json({ message: "No autorizado" }, { status: 403 });
  }

  try {
    const units: UnitCourse[] = await pool.query(
      "SELECT * FROM units_courses WHERE course_ID = ? ORDER BY unit_number ASC",
      [courseId]
    );

    const unitIds = units.map((unit: any) => unit.id);
    let contents: Content[] = [];

    if (unitIds.length > 0) {
      contents = await pool.query(
        `SELECT * FROM contents WHERE unit_ID IN (${unitIds
          .map(() => "?")
          .join(",")})`,
        unitIds
      );
    }

    const unitsWithContents: CourseWithUnitContent[] = course.map(
      (course: Course) => ({
        ...course,
        units: units.map((unit: UnitCourse) => ({
          ...unit,
          contents: contents.filter(
            (content: Content) => content.unit_ID === unit.id
          ),
        })),
      })
    );

    await pool.end();

    return NextResponse.json(unitsWithContents);
  } catch (error) {
    console.error(error);
    return NextResponse.json(
      { message: "Error base de datos" },
      { status: 500 }
    );
  }
}
