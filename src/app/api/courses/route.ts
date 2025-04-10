import { NextRequest, NextResponse } from "next/server";
import { pool } from "@/libs/mysql";
import { verifyAuth } from "@/libs/auth";
import { courseInput, validateCourses } from "@/utils/validateCourses";
import { validatePermissions } from "@/utils/validatePermissions";

type RequestBody = {
  insertId: number;
  affectedRows: number;
};

export async function GET() {
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

export async function POST(request: NextRequest) {
  try {
    const course: courseInput = await request.json();

    // Verificar que el usuario tenga permisos para crear cursos
    if (!(await validatePermissions(request, true))) {
      return NextResponse.json(
        {
          message: "No tienes los permisos suficientes para hacer este cambio.",
        },
        { status: 403 }
      );
    }

    // Verifica que los valores obligatorios tengan contenido
    if (!course.name) {
      return NextResponse.json(
        { message: "Falta el valor de name del curso." },
        { status: 400 }
      );
    } else if (!course.duration) {
      return NextResponse.json(
        { message: "Falta el valor de duration del curso." },
        { status: 400 }
      );
    } else if (!course.uuid) {
      return NextResponse.json(
        { message: "Falta el valor de instructorUuid del curso." },
        { status: 400 }
      );
    } else if (!course.category_ID) {
      return NextResponse.json(
        { message: "Falta el valor de category del curso." },
        { status: 400 }
      );
    }

    // Verifica que no exista un curso con el mismo nombre
    const courseValidationErrors = await validateCourses(course);

    if (courseValidationErrors.length > 0) {
      return NextResponse.json(
        courseValidationErrors.map((error) => ({
          field: error.field,
          message: error.message,
        })),
        { status: 409 }
      );
    }

    // Despues de las verificaciones realiza el insert a la BD
    const result: RequestBody = await pool.query("INSERT INTO courses SET ?", {
      course_Name: course.name,
      course_Description: course.description,
      course_Date: course.date,
      course_Duration: course.duration,
      instructor_ID: course.uuid,
      category_ID: course.category_ID,
    });

    pool.end();

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
