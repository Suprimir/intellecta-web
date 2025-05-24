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
  const formData = await request.formData();

  const unitNumber = formData.get("unitNumber");
  const title = formData.get("title");
  const courseId = formData.get("courseId");

  if (!unitNumber || !title) {
    return NextResponse.json(
      { message: "Debes rellenar todos los campos." },
      { status: 400 }
    );
  }

  try {
    const res: RequestBody = await pool.query(
      "INSERT INTO units_courses (unit_number, course_ID, title) VALUE (?, ?, ?)",
      [unitNumber, Number(courseId), title]
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

export async function PUT(request: NextRequest) {
  const formData = await request.formData();
  let hasValidData = false;

  for (const [key, value] of formData.entries()) {
    if (key === "unitId") continue;

    if (typeof value === "string" && value.trim() !== "") {
      hasValidData = true;
      break;
    }
  }

  if (!hasValidData) {
    return NextResponse.json(
      { message: "Debes rellenar al menos un campo" },
      { status: 400 }
    );
  }

  const unitId = formData.get("unitId");

  const rawUnitCourse: Partial<UnitCourse> = {
    unit_number: Number(formData.get("unitNumber")) || undefined,
    title: String(formData.get("title")) || undefined,
  };

  const unitCourse = Object.fromEntries(
    Object.entries(rawUnitCourse).filter(([_, value]) => value !== undefined)
  );

  try {
    const res: RequestBody = await pool.query(
      "UPDATE units_courses SET ? WHERE id = ?",
      [unitCourse, Number(unitId)]
    );

    if (res.affectedRows > 0) {
      return NextResponse.json({ message: "Unidad actualizada" });
    }
  } catch (error: unknown) {
    console.error(error);
    return NextResponse.json(
      { message: (error as Error).message },
      { status: 500 }
    );
  }
}
