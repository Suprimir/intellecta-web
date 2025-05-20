import { NextRequest, NextResponse } from "next/server";
import { pool } from "@/libs/mysql";

export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ courseId: number }> }
) {
  const { courseId } = await params;

  console.log(courseId);
  if (!courseId || isNaN(Number(courseId))) {
    return NextResponse.json({ message: "courseId invalido" }, { status: 400 });
  }

  try {
    const units: [] = await pool.query(
      "SELECT * FROM units_courses WHERE course_ID = ? ORDER BY unit_number ASC",
      [courseId]
    );

    const unitIds = units.map((unit: any) => unit.id);
    let contents: [] = [];

    if (unitIds.length > 0) {
      contents = await pool.query(
        `SELECT * FROM contents WHERE unit_ID IN (${unitIds
          .map(() => "?")
          .join(",")})`,
        unitIds
      );
    }

    const unitsWithContents = units.map((unit: any) => ({
      ...unit,
      contents: contents.filter((c: any) => c.unit_ID === unit.id),
    }));

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
