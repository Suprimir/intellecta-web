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
    const uuid = searchParams.get("uuid");
    const limitParam = searchParams.get("limit");

    const limit = limitParam ? parseInt(limitParam) : null;
    if (limit !== null && (isNaN(limit) || limit <= 0)) {
      return NextResponse.json(
        { message: "El parámetro 'limit' debe ser un número positivo." },
        { status: 400 }
      );
    }

    let query;
    let queryParams: any[] = [];

    if (uuid) {
      query = `SELECT c.id,
                c.name, 
                c.description, 
                c.image, 
                c.date, 
                c.duration, 
                c.rating,
                c.instructor_ID, 
                CONCAT_WS(" ", u.name, u.last_name) AS instructor, 
                c.category_ID, 
                cat.description AS category_name, 
                c.price,
                CASE 
                    WHEN pc.course_ID IS NOT NULL THEN "purchased"
                    WHEN sd.course_ID IS NOT NULL THEN "cart"
                    ELSE ""
                END AS "location"
          FROM courses c 
          JOIN users u ON u.uuid = c.instructor_ID
          JOIN categories cat ON c.category_ID = cat.id
          LEFT JOIN shoppingcarts s ON s.uuid = ?
          LEFT JOIN shoppingcarts_details sd ON sd.shoppingCart_ID = s.id AND sd.course_ID = c.id
          LEFT JOIN purchased_courses pc ON pc.course_ID = c.id AND pc.user_ID = ?
          ORDER BY 
          CASE 
              WHEN pc.course_ID IS NOT NULL THEN 2 
              WHEN sd.course_ID IS NOT NULL THEN 1
              ELSE 0                               
          END ASC`;

      queryParams = [uuid, uuid];
    } else {
      query = `SELECT c.id,
                c.name, 
                c.description, 
                c.image, 
                c.date, 
                c.duration, 
                c.rating,
                c.instructor_ID, 
                CONCAT_WS(" ", u.name, u.last_name) AS instructor, 
                c.category_ID, 
                cat.description AS category_name, 
                c.price,
                "" AS "location"
          FROM courses c 
          JOIN users u ON u.uuid = c.instructor_ID
          JOIN categories cat ON c.category_ID = cat.id`;
    }

    if (limit !== null) {
      query += " LIMIT ?";
      queryParams.push(limit);
    }
    const courses: Course[] = await pool.query(query, queryParams);

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
    } else if (!course.instructor_ID) {
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
      instructor_ID: course.instructor_ID,
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
