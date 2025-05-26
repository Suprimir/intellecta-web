// ruta /api/unit_courses

import { NextRequest, NextResponse } from "next/server";
import { pool } from "@/libs/mysql";
import { UnitCourse, RequestBody } from "@/types/api";
import { verify } from "jsonwebtoken";

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

// Terminado
export async function POST(request: NextRequest) {
  try {
    const formData = await request.formData();

    // Constantes a utilizar
    const uuid = formData.get("uuid");

    const unitCourse: Partial<UnitCourse> = {
      course_ID: formData.get("courseId")
        ? Number(formData.get("courseId"))
        : undefined,
      title: formData.get("title")?.toString() || undefined,
      unit_number: formData.get("unitNumber")
        ? Number(formData.get("unitNumber"))
        : undefined,
    };

    // Verificar que esten todos los campos
    const hasEmptyFields = Object.values(unitCourse).some(
      (value) => value === undefined
    );

    if (hasEmptyFields) {
      return NextResponse.json(
        { message: "Debes rellenar todos los campos." },
        { status: 400 }
      );
    }

    // Verificacion de autoridad
    if (!uuid) {
      return NextResponse.json({ message: "No autorizado" }, { status: 401 });
    }

    const token = request.cookies.get("sessionToken")?.value;

    if (!token) {
      return NextResponse.json({ message: "No autorizado" }, { status: 401 });
    }
    const payload = verify(token, process.env.JWT_SECRET!) as {
      uuid: string;
      rol: string;
    };

    if (uuid !== payload.uuid || payload.rol !== "admin") {
      return NextResponse.json({ message: "No autorizado" }, { status: 403 });
    }

    // Insercion de la unidad
    const result: RequestBody = await pool.query(
      "INSERT INTO units_courses SET ?",
      unitCourse
    );

    pool.end();

    if (result.affectedRows === 0) {
      return NextResponse.json(
        { message: "No se pudo crear" },
        { status: 500 }
      );
    }

    return NextResponse.json({
      message: "Unidad de curso creada exitosamente",
      courseId: result.insertId,
    });
  } catch (error: unknown) {
    console.error(error);
    return NextResponse.json(
      { message: (error as Error).message },
      { status: 500 }
    );
  }
}

// Terminado
export async function PUT(request: NextRequest) {
  try {
    const formData = await request.formData();

    // Constantes a utilizar
    const uuid = formData.get("uuid");
    const id = formData.get("unitId");

    const rawUnitCourse: Partial<UnitCourse> = {
      title: formData.get("title")?.toString() || undefined,
      unit_number: formData.get("unitNumber")
        ? Number(formData.get("unitNumber"))
        : undefined,
    };

    // Limpiamos valores no definidos
    const unitCourse = Object.fromEntries(
      Object.entries(rawUnitCourse).filter(([_, value]) => value !== undefined)
    );

    // Verificar que hay 1 campo actualizable
    if (Object.keys(unitCourse).length === 0) {
      return NextResponse.json(
        { message: "Debes rellenar por lo menos 1 campo." },
        { status: 400 }
      );
    }

    // Verificacion de autoridad
    if (!uuid) {
      return NextResponse.json({ message: "No autorizado" }, { status: 401 });
    }

    const token = request.cookies.get("sessionToken")?.value;

    if (!token) {
      return NextResponse.json({ message: "No autorizado" }, { status: 401 });
    }
    const payload = verify(token, process.env.JWT_SECRET!) as {
      uuid: string;
      rol: string;
    };

    if (uuid !== payload.uuid || payload.rol !== "admin") {
      return NextResponse.json({ message: "No autorizado" }, { status: 403 });
    }

    // Actualizamos la unidad
    const result: RequestBody = await pool.query(
      "UPDATE units_courses SET ? WHERE id = ?",
      [unitCourse, id]
    );

    pool.end();

    if (result.affectedRows === 0) {
      return NextResponse.json(
        { message: "No se pudo actualizar" },
        { status: 500 }
      );
    }

    return NextResponse.json({ message: "Unidad actualizada." });
  } catch (error: unknown) {
    console.error(error);
    return NextResponse.json(
      { message: (error as Error).message },
      { status: 500 }
    );
  }
}
