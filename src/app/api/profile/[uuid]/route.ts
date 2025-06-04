import { NextRequest, NextResponse } from "next/server";
import { pool } from "@/libs/mysql";
import { RequestBody, TotalContents, User } from "@/types/api";
import { verify } from "jsonwebtoken";
import { mkdir, readdir, unlink, writeFile } from "fs/promises";
import path from "path";

export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ uuid: string }> }
) {
  try {
    const { uuid } = await params;

    const user: User[] = await pool.query(
      "SELECT uuid, username, email, role, profilePicture, bio, created_at FROM users WHERE uuid = ? LIMIT 1",
      uuid
    );

    const certificates: [] = await pool.query(
      ` 
            SELECT c.course_ID as courseId, co.name as courseName
            FROM certificates c
            JOIN courses co ON co.id = c.course_ID
            WHERE c.user_ID = ?;
        `,
      [uuid]
    );

    /* 
      Obtener el total de contenidos y los contenidos completados por curso
      para calcular el porcentaje de finalización de cada curso.
      Se asume que un curso puede tener múltiples contenidos y que cada contenido
      puede ser completado por el usuario.
    */
    const totalContents: TotalContents[] = await pool.query(
      `
        SELECT pc.course_ID, co.name, COUNT(c.id) as totalContents
        FROM contents c
        JOIN units_courses uc ON c.unit_ID = uc.id
        JOIN purchased_courses pc ON pc.course_ID = uc.course_ID
        JOIN courses co ON co.id = pc.course_ID
        WHERE pc.user_ID = ?
        GROUP BY pc.course_ID, co.name;
      `,
      [uuid]
    );

    const totalCompletedContents: TotalContents[] = await pool.query(
      `
        SELECT pc.course_ID, COUNT(cc.content_ID) as completedContents
        FROM contents_completed cc
        JOIN contents c ON c.id = cc.content_ID
        JOIN units_courses uc ON uc.id = c.unit_ID
        JOIN purchased_courses pc ON pc.course_ID = uc.course_ID
        WHERE pc.user_ID = ?
        GROUP BY pc.course_ID;
      `,
      [uuid]
    );

    // Calcular el porcentaje de finalización de cada curso
    const courseCompletion = totalContents.map((course) => {
      const completed = totalCompletedContents.find(
        (completedCourse) => completedCourse.course_ID === course.course_ID
      );
      const completedContents = completed ? completed.completedContents : 0;
      const completionPercentage =
        course.totalContents > 0
          ? (completedContents / course.totalContents) * 100
          : 0;

      return {
        courseId: course.course_ID,
        courseName: course.name,
        completionPercentage: Math.round(completionPercentage),
      };
    });

    return NextResponse.json({ user: user[0], certificates, courseCompletion });
  } catch (error: unknown) {
    console.error(error);
    return NextResponse.json(
      { message: "No hay sessionToken. " },
      { status: 404 }
    );
  }
}

export async function PUT(
  request: NextRequest,
  { params }: { params: Promise<{ uuid: string }> }
) {
  try {
    const formData = await request.formData();

    const { uuid } = await params;
    const imageFile = formData.get("file") as File;

    const rawUser: Partial<User> = {
      username: formData.get("username")?.toString() || undefined,
      bio: formData.get("bio")?.toString() || undefined,
    };

    const user = Object.fromEntries(
      Object.entries(rawUser).filter(([_, value]) => value !== undefined)
    );

    if (Object.keys(user).length === 0 && imageFile.size === 0) {
      return NextResponse.json(
        { message: "Debes rellenar por lo menos 1 campo." },
        { status: 400 }
      );
    }

    // Verificacion de autoridad
    const token = request.cookies.get("sessionToken")?.value;

    if (!token) {
      return NextResponse.json({ message: "No autorizado" }, { status: 401 });
    }
    const payload = verify(token, process.env.JWT_SECRET!) as {
      uuid: string;
      rol: string;
    };

    if (payload.uuid !== uuid) {
      return NextResponse.json({ message: "No autorizado" }, { status: 403 });
    }

    if (imageFile && path.extname(imageFile.name)) {
      const uploadDir = path.join(process.cwd(), "public", "userImages");

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

        if (base === uuid && imageExtensions.includes(ext)) {
          const fileToDelete = path.join(uploadDir, fileName);
          await unlink(fileToDelete);
        }
      }

      const ext = path.extname(imageFile.name);
      const filePath = path.join(uploadDir, uuid + ext);

      const bytes = await imageFile.arrayBuffer();
      const buffer = Buffer.from(bytes);

      await writeFile(filePath, buffer);

      user.profilePicture = `/userImages/${uuid}${path.extname(
        imageFile.name
      )}`;
    }

    // Actualizacion del usuarios
    const result: RequestBody = await pool.query(
      "UPDATE users SET ? WHERE uuid = ?",
      [user, uuid]
    );

    pool.end();

    if (result.affectedRows === 0) {
      return NextResponse.json(
        { message: "No se actualizo el usuario." },
        { status: 404 }
      );
    }

    return NextResponse.json({ message: "Perfil actualizado correctamente." });
  } catch (error: unknown) {
    console.error(error);
    return NextResponse.json(
      { message: (error as Error).message },
      { status: 500 }
    );
  }
}
