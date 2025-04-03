import { NextRequest, NextResponse } from "next/server";
import { pool } from "@/libs/mysql";
import { verifyAuth } from "@/libs/auth";

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
    const searchParams = request.nextUrl.searchParams;

    const courseName = searchParams.get("name");
    const courseDescription = searchParams.get("description") || "";
    const courseDate = searchParams.get("date") || new Date(Date.now());
    const courseDuration = searchParams.get("duration");
    const instructorUuid = searchParams.get("instructorUuid");
    const categoryId = searchParams.get("category");

    // Verificar que el usuario tenga permisos para crear cursos
    const data = await verifyAuth(request);

    if (!data.ok) {
      return data;
    }

    const { rol } = await data.json();
    if (rol != "admin") {
      return NextResponse.json(
        {
          message: "No tienes los permisos suficientes para hacer este cambio.",
        },
        { status: 403 }
      );
    }

    // Verifica que los valores obligatorios tengan contenido
    if (!courseName) {
      return NextResponse.json(
        { message: "Falta el valor de name del curso." },
        { status: 400 }
      );
    } else if (!courseDuration) {
      return NextResponse.json(
        { message: "Falta el valor de duration del curso." },
        { status: 400 }
      );
    } else if (!instructorUuid) {
      return NextResponse.json(
        { message: "Falta el valor de instructorUuid del curso." },
        { status: 400 }
      );
    } else if (!categoryId) {
      return NextResponse.json(
        { message: "Falta el valor de category del curso." },
        { status: 400 }
      );
    }

    // Verifica que no exista un curso con el mismo nombre
    const alreadyExist: RequestBody[] = await pool.query(
      "SELECT 1 FROM courses WHERE course_Name = ?",
      courseName
    );

    if (alreadyExist.length > 0) {
      return NextResponse.json(
        {
          message: "Ya existe una categoria con ese nombre.",
        },
        { status: 409 }
      );
    }

    // Despues de las verificaciones realiza el insert a la BD
    const result: RequestBody = await pool.query("INSERT INTO courses SET ?", {
      course_Name: courseName,
      course_Description: courseDescription,
      course_Date: courseDate,
      course_Duration: courseDuration,
      instructor_ID: instructorUuid,
      category_ID: categoryId,
    });

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
