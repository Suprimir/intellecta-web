// ruta /api/users

import { NextRequest, NextResponse } from "next/server";
import { pool } from "@/libs/mysql";
import { RequestBody, User } from "@/types/api";
import { verify } from "jsonwebtoken";
import { randomUUID } from "crypto";
import bcrypt from "bcrypt";
import path from "path";
import { mkdir, readdir, unlink, writeFile } from "fs/promises";

// Terminado
export async function GET(request: NextRequest) {
  try {
    // Verificar que el usuario sea administrador
    const token = request.cookies.get("sessionToken")?.value;

    if (!token) {
      return NextResponse.json({ message: "No autorizado" }, { status: 401 });
    }
    const payload = verify(token, process.env.JWT_SECRET!) as {
      uuid: string;
      rol: string;
    };

    if (payload.rol !== "admin") {
      return NextResponse.json({ message: "No autorizado" }, { status: 403 });
    }

    // Obtener todos los usuarios
    const users: User[] = await pool.query(
      "SELECT * FROM users WHERE active = 1"
    );

    if (users.length === 0) {
      return NextResponse.json({ message: "No hay usuarios" }, { status: 400 });
    }

    return NextResponse.json(users);
  } catch (error: unknown) {
    console.error(error);
    return NextResponse.json(
      { message: (error as Error).message },
      { status: 500 }
    );
  }
}

export async function POST(request: NextRequest) {
  try {
    const formData = await request.formData();

    // Constantes a utilizar
    const user: Partial<User> = {
      uuid: randomUUID(),
      username: formData.get("username")?.toString() || undefined,
      name: formData.get("name")?.toString() || undefined,
      last_name: formData.get("last_name")?.toString() || undefined,
      email: formData.get("email")?.toString() || undefined,
      password:
        (await bcrypt.hashSync(String(formData.get("password")), 10)) ||
        undefined,
      role:
        (formData.get("role") as "student" | "admin" | "instructor") ||
        undefined,
    };

    // Verificar que esten todos los campos
    const hasEmptyFields = Object.values(user).some(
      (value) => value === undefined
    );

    if (hasEmptyFields) {
      return NextResponse.json(
        { message: "Debes rellenar todos los campos." },
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

    if (payload.rol !== "admin") {
      return NextResponse.json({ message: "No autorizado" }, { status: 403 });
    }

    // Insercion del usuario
    const result: RequestBody = await pool.query(
      "INSERT INTO users SET ?",
      user
    );

    pool.end();

    if (result.affectedRows === 0) {
      return NextResponse.json(
        { message: "No se pudo crear" },
        { status: 500 }
      );
    }

    return NextResponse.json({
      message: "Usuario creado exitosamente",
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

export async function PUT(request: NextRequest) {
  try {
    const formData = await request.formData();

    // Constantes a utilizar
    const uuid = formData.get("uuid");
    const imageFile = formData.get("file") as File;

    const rawUser: Partial<User> = {
      username: formData.get("username")?.toString() || undefined,
      name: formData.get("name")?.toString() || undefined,
      last_name: formData.get("last_name")?.toString() || undefined,
      email: formData.get("email")?.toString() || undefined,
      password: formData.get("password")?.toString() || undefined,
    };

    // Hasheamos nuevo password si es que hay
    if (rawUser.password !== undefined) {
      rawUser.password = await bcrypt.hashSync(rawUser.password, 10);
    }

    // Limpiamos valores no definidos
    const user = Object.fromEntries(
      Object.entries(rawUser).filter(([_, value]) => value !== undefined)
    );

    // Verificar que hay 1 campo actualizable
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

    if (payload.rol !== "admin") {
      return NextResponse.json({ message: "No autorizado" }, { status: 403 });
    }

    // Proceso de guardado de imagen
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
        { message: "No se pudo actualizar" },
        { status: 500 }
      );
    }

    return NextResponse.json({
      message: "Usuario actualizado exitosamente",
    });
  } catch (error: unknown) {
    console.error(error);
    return NextResponse.json(
      { message: (error as Error).message },
      { status: 500 }
    );
  }
}
