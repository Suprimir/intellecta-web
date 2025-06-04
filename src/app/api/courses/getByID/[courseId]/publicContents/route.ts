// Ruta: /api/courses/getByID/[courseId]/contents

import { NextRequest, NextResponse } from "next/server";
import { pool } from "@/libs/mysql";
import {
  Content,
  Course,
  CourseWithUnitContent,
  UnitCourse,
} from "@/types/api";
import { verify } from "jsonwebtoken";

export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ courseId: number }> }
) {
  const { courseId } = await params;

  if (!courseId || isNaN(courseId)) {
    return NextResponse.json({ message: "courseId inválido" }, { status: 400 });
  }

  // Obtener el payload del token de la cookie
  const token = request.cookies.get("sessionToken")?.value;
  let uuid = "";

  if (token) {
    const payload = verify(token, process.env.JWT_SECRET!) as {
      uuid: string;
    };

    uuid = payload.uuid;
  }

  const course: Course[] = await pool.query(
    `
        SELECT  
            c.id, 
            c.name, 
            c.description, 
            c.image, c.date, 
            c.duration, 
            c.instructor_ID, 
            CONCAT_WS(" ", u.name, u.last_name) as instructor, 
            c.category_ID, 
            cat.description as category_name, 
            c.price, 
            c.rating,
            CASE 
                WHEN pc.course_ID IS NOT NULL THEN "purchased"
                WHEN sd.course_ID IS NOT NULL THEN "cart"
                ELSE ""
            END AS "location"
        FROM courses c 
        JOIN users u ON c.instructor_ID = u.uuid
        JOIN categories cat ON c.category_ID = cat.id
        LEFT JOIN shoppingcarts s ON s.uuid = ?
        LEFT JOIN shoppingcarts_details sd ON sd.shoppingCart_ID = s.id AND sd.course_ID = c.id
        LEFT JOIN purchased_courses pc ON pc.course_ID = c.id AND pc.user_ID = s.uuid
        WHERE c.id = ?;
    `,
    [uuid, courseId]
  );

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
