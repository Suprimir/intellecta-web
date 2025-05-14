import { NextRequest, NextResponse } from "next/server";
import { pool } from "@/libs/mysql";
import { validateCourses } from "@/utils/validateCourses";
import { validatePermissions } from "@/utils/validatePermissions";
import { Course } from "@/types/api";

type RequestBody = {
  insertId: number;
  affectedRows: number;
};

export async function GET(request: NextRequest) {
  try {
    const searchParams = request.nextUrl.searchParams;
    const limitParam = searchParams.get("limit");

    const limit = limitParam ? parseInt(limitParam) : null;
    if (limit !== null && (isNaN(limit) || limit <= 0)) {
      return NextResponse.json(
        { message: "El parámetro 'limit' debe ser un número positivo." },
        { status: 400 }
      );
    }

    const query = limit
      ? "SELECT * FROM courses LIMIT ?"
      : "SELECT * FROM courses";
    const courses = await pool.query(query, limit);

    return NextResponse.json(courses);
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
    const course: Course = await request.json();

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
    } else if (!course.image) {
      return NextResponse.json(
        { message: "Falta el valor de course_Image." },
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
      name: course.name,
      description: course.description,
      image: course.image,
      date: course.date,
      duration: course.duration,
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
