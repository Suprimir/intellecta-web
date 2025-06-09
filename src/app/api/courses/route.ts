import { NextRequest, NextResponse } from "next/server";
import { pool } from "@/libs/mysql";
import { Course } from "@/types/api";
import { writeFile, mkdir, readdir, unlink } from "fs/promises";
import path from "path";
import { verify } from "jsonwebtoken";

type RequestBody = {
  insertId: number;
  affectedRows: number;
};

interface NextID {
  AUTO_INCREMENT: number;
}

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
      query = `
              SELECT c.id,
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
                r.rating AS userRating,
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
            LEFT JOIN purchased_courses pc ON pc.course_ID = c.id AND pc.user_ID = s.uuid
            LEFT JOIN ratings r ON r.user_ID = s.uuid AND r.course_ID = pc.course_ID
            ORDER BY 
            CASE 
                WHEN pc.course_ID IS NOT NULL THEN 2 
                WHEN sd.course_ID IS NOT NULL THEN 1
                ELSE 0                               
            END ASC
          `;

      queryParams = [uuid];
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

// Terminado
export async function POST(request: NextRequest) {
  try {
    const formData = await request.formData();

    // Constantes a utilizar
    const imageFile = formData.get("file") as File;

    const course: Partial<Course> = {
      name: formData.get("title")?.toString() || undefined,
      description: formData.get("description")?.toString() || undefined,
      price: formData.get("price") ? Number(formData.get("price")) : undefined,
      instructor_ID: formData.get("uuid")?.toString() || undefined,
      category_ID: formData.get("category")
        ? Number(formData.get("category"))
        : undefined,
    };

    // Verificar que esten todos los campos
    const hasEmptyFields = Object.values(course).some(
      (value) => value === undefined
    );

    if (hasEmptyFields || !imageFile || imageFile.size === 0) {
      return NextResponse.json(
        { message: "Debes rellenar todos los campos." },
        { status: 400 }
      );
    }

    // Verificacion de autoridad
    if (!course.instructor_ID) {
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

    if (course.instructor_ID !== payload.uuid || payload.rol !== "admin") {
      return NextResponse.json({ message: "No autorizado" }, { status: 403 });
    }

    // Obtener el proximo Id para guardar imagen con su identificador
    const data: NextID[] = await pool.query(
      "SELECT AUTO_INCREMENT FROM information_schema.TABLES WHERE TABLE_SCHEMA = DATABASE() AND TABLE_NAME = 'courses';"
    );

    const nextId = data[0].AUTO_INCREMENT;

    // Proceso de guardado de imagen
    if (path.extname(imageFile.name)) {
      const uploadDir = path.join(process.cwd(), "public", "coursesImages");

      await mkdir(uploadDir, { recursive: true });

      const imageExtensions = [
        ".jpg",
        ".jpeg",
        ".png",
        ".gif",
        ".webp",
        ".bmp",
      ];

      const files = await readdir(uploadDir);

      for (const fileName of files) {
        const ext = path.extname(fileName).toLowerCase();
        const base = path.basename(fileName, ext);

        if (base === String(nextId) && imageExtensions.includes(ext)) {
          const fileToDelete = path.join(uploadDir, fileName);
          await unlink(fileToDelete);
        }
      }

      const ext = path.extname(imageFile.name);
      const filePath = path.join(uploadDir, nextId + ext);

      const bytes = await imageFile.arrayBuffer();
      const buffer = Buffer.from(bytes);

      await writeFile(filePath, buffer);

      course.image = `/coursesImages/${nextId}${path.extname(imageFile.name)}`;
    }

    // Insercion del curso
    const result: RequestBody = await pool.query("INSERT INTO courses SET ?", [
      course,
    ]);

    pool.end();

    if (result.affectedRows === 0) {
      return NextResponse.json(
        { message: "No se pudo crear" },
        { status: 500 }
      );
    }

    return NextResponse.json({
      message: "Curso creado exitosamente",
      courseId: result.insertId,
    });
  } catch (error: unknown) {
    console.log(error);
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
    const id = formData.get("id");
    const imageFile = formData.get("file") as File;

    const rawCourse: Partial<Course> = {
      name: formData.get("title")?.toString() || undefined,
      description: formData.get("description")?.toString() || undefined,
      price: formData.get("price") ? Number(formData.get("price")) : undefined,
    };

    // Limpiamos valores no definidos
    const course = Object.fromEntries(
      Object.entries(rawCourse).filter(([_, value]) => value !== undefined)
    );

    // Verificar que hay 1 campo actualizable
    if (Object.keys(course).length === 0 && imageFile.size === 0) {
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

    // Proceso de guardado de imagen
    if (imageFile && path.extname(imageFile.name)) {
      const uploadDir = path.join(process.cwd(), "public", "coursesImages");

      await mkdir(uploadDir, { recursive: true });

      const imageExtensions = [
        ".jpg",
        ".jpeg",
        ".png",
        ".gif",
        ".webp",
        ".bmp",
      ];

      const files = await readdir(uploadDir);

      for (const fileName of files) {
        const ext = path.extname(fileName).toLowerCase();
        const base = path.basename(fileName, ext);

        if (base === id && imageExtensions.includes(ext)) {
          const fileToDelete = path.join(uploadDir, fileName);
          await unlink(fileToDelete);
        }
      }

      const ext = path.extname(imageFile.name);
      const filePath = path.join(uploadDir, id + ext);

      const bytes = await imageFile.arrayBuffer();
      const buffer = Buffer.from(bytes);

      await writeFile(filePath, buffer);

      course.image = `/coursesImages/${id}${path.extname(imageFile.name)}`;
    }

    // Actualizamos el curso
    const result: RequestBody = await pool.query(
      "UPDATE courses SET ? WHERE id = ?",
      [course, id]
    );

    pool.end();

    if (result.affectedRows === 0) {
      return NextResponse.json(
        { message: "No se pudo actualizar" },
        { status: 500 }
      );
    }

    return NextResponse.json({ message: "Curso actualizado." });
  } catch (error: unknown) {
    console.log(error);
    return NextResponse.json(
      { message: (error as Error).message },
      { status: 500 }
    );
  }
}
