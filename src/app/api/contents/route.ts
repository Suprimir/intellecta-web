import { NextRequest, NextResponse } from "next/server";
import { pool } from "@/libs/mysql";
import { verify } from "jsonwebtoken";
import { Content } from "@/types/api";
import { writeFile, mkdir, readdir, unlink } from "fs/promises";
import path from "path";

type RequestBody = {
  insertId: number;
  affectedRows: number;
};

interface NextID {
  AUTO_INCREMENT: number;
}

export async function GET() {
  try {
    const contents: Content[] = await pool.query(
      "SELECT * FROM contentsFrontend"
    );

    pool.end();
    return NextResponse.json(contents);
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
    const uuid = formData.get("uuid");
    const videoFile = formData.get("video_Path") as File;
    const documentFile = formData.get("document_Path") as File;

    const content: Partial<Content> = {
      unit_ID: formData.get("unitId")
        ? Number(formData.get("unitId"))
        : undefined,
      title: formData.get("title")?.toString() || undefined,
      description: formData.get("description")?.toString() || undefined,
      order_number: formData.get("orderNumber")
        ? Number(formData.get("orderNumber"))
        : undefined,
    };

    // Verificar que esten todos los campos
    const hasEmptyFields = Object.values(content).some(
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

    // Obtener el proximo Id para guardar archivos
    const data: NextID[] = await pool.query(
      "SELECT AUTO_INCREMENT FROM information_schema.TABLES WHERE TABLE_SCHEMA = DATABASE() AND TABLE_NAME = 'contents';"
    );

    const nextId = data[0].AUTO_INCREMENT.toString();

    // Proceso de guardado de video
    if (videoFile && path.extname(videoFile.name)) {
      const uploadDir = path.join(process.cwd(), "public", "videoContent");

      await mkdir(uploadDir, { recursive: true });

      const videoExtensions = [".mp4"];

      const files = await readdir(uploadDir);

      for (const fileName of files) {
        const ext = path.extname(fileName).toLowerCase();
        const base = path.basename(fileName, ext);

        if (base === nextId && videoExtensions.includes(ext)) {
          const fileToDelete = path.join(uploadDir, fileName);
          await unlink(fileToDelete);
        }
      }

      const ext = path.extname(videoFile.name);
      const filePath = path.join(uploadDir, nextId + ext);

      const bytes = await videoFile.arrayBuffer();
      const buffer = Buffer.from(bytes);

      await writeFile(filePath, buffer);

      content.media_Path = `/videoContent/${nextId}${path.extname(
        videoFile.name
      )}`;
    }

    // Proceso de guardado de imagen
    if (documentFile && path.extname(documentFile.name)) {
      const uploadDir = path.join(process.cwd(), "public", "documentContent");

      await mkdir(uploadDir, { recursive: true });

      const videoExtensions = [".pdf", ".docx"];

      const files = await readdir(uploadDir);

      for (const fileName of files) {
        const ext = path.extname(fileName).toLowerCase();
        const base = path.basename(fileName, ext);

        if (base === nextId && videoExtensions.includes(ext)) {
          const fileToDelete = path.join(uploadDir, fileName);
          await unlink(fileToDelete);
        }
      }

      const ext = path.extname(documentFile.name);
      const filePath = path.join(uploadDir, nextId + ext);

      const bytes = await documentFile.arrayBuffer();
      const buffer = Buffer.from(bytes);

      await writeFile(filePath, buffer);

      content.document_Path = `/documentContent/${nextId}${path.extname(
        documentFile.name
      )}`;
    }

    // Insercion del contenido
    const result: RequestBody = await pool.query(
      "INSERT INTO contents SET ?",
      content
    );

    pool.end();

    if (result.affectedRows === 0) {
      return NextResponse.json(
        { message: "No se pudo crear" },
        { status: 500 }
      );
    }

    return NextResponse.json({
      message: "Contenido creado exitosamente",
      contentId: result.insertId,
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

// Terminado
export async function PUT(request: NextRequest) {
  try {
    const formData = await request.formData();

    // Constantes a utilizar
    const uuid = formData.get("uuid");
    const id = formData.get("contentId");
    const videoFile = formData.get("video_Path") as File;
    const documentFile = formData.get("document_Path") as File;

    const rawContent: Partial<Content> = {
      title: formData.get("title")?.toString() || undefined,
      description: formData.get("description")?.toString() || undefined,
      order_number: formData.get("orderNumber")
        ? Number(formData.get("orderNumber"))
        : undefined,
    };

    // Limpiamos valores no definidos
    const content = Object.fromEntries(
      Object.entries(rawContent).filter(([_, value]) => value !== undefined)
    );

    // Verificar que hay 1 campo actualizable
    const emptyFiles = videoFile.size === 0 && documentFile.size === 0;

    if (Object.keys(content).length === 0 && emptyFiles) {
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

    // Proceso de guardado de video
    if (videoFile && path.extname(videoFile.name)) {
      const uploadDir = path.join(process.cwd(), "public", "videoContent");

      await mkdir(uploadDir, { recursive: true });

      const videoExtensions = [".mp4"];

      const files = await readdir(uploadDir);

      for (const fileName of files) {
        const ext = path.extname(fileName).toLowerCase();
        const base = path.basename(fileName, ext);

        if (base === id && videoExtensions.includes(ext)) {
          const fileToDelete = path.join(uploadDir, fileName);
          await unlink(fileToDelete);
        }
      }

      const ext = path.extname(videoFile.name);
      const filePath = path.join(uploadDir, id + ext);

      const bytes = await videoFile.arrayBuffer();
      const buffer = Buffer.from(bytes);

      await writeFile(filePath, buffer);

      content.media_Path = `/videoContent/${id}${path.extname(videoFile.name)}`;
    }

    // Proceso de guardado de imagen
    if (documentFile && path.extname(documentFile.name)) {
      const uploadDir = path.join(process.cwd(), "public", "documentContent");

      await mkdir(uploadDir, { recursive: true });

      const videoExtensions = [".pdf", ".docx"];

      const files = await readdir(uploadDir);

      for (const fileName of files) {
        const ext = path.extname(fileName).toLowerCase();
        const base = path.basename(fileName, ext);

        if (base === id && videoExtensions.includes(ext)) {
          const fileToDelete = path.join(uploadDir, fileName);
          await unlink(fileToDelete);
        }
      }

      const ext = path.extname(documentFile.name);
      const filePath = path.join(uploadDir, id + ext);

      const bytes = await documentFile.arrayBuffer();
      const buffer = Buffer.from(bytes);

      await writeFile(filePath, buffer);

      content.document_Path = `/documentContent/${id}${path.extname(
        documentFile.name
      )}`;
    }

    // Actualizamos el contenido
    const result: RequestBody = await pool.query(
      `UPDATE contents SET ? WHERE id = ?`,
      [content, id]
    );

    pool.end();

    if (result.affectedRows === 0) {
      return NextResponse.json(
        { message: "No se pudo actualizar" },
        { status: 500 }
      );
    }

    return NextResponse.json({ message: "Contenido actualizado exitosamente" });
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
