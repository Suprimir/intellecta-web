import { NextRequest, NextResponse } from "next/server";
import { pool } from "@/libs/mysql";
import { validateContents } from "@/utils/validateContents";
import { Content } from "@/types/api";
import { writeFile, mkdir, readdir, unlink } from "fs/promises";
import path from "path";

type RequestBody = {
  insertId: number;
  affectedRows: number;
};

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

export async function POST(request: NextRequest) {
  try {
    const formData = await request.formData();

    const content: Partial<Content> = {
      unit_ID: Number(formData.get("unitId")),
      title: String(formData.get("title")),
      description: String(formData.get("description")),
      order_number: Number(formData.get("orderNumber")),
    };

    if (!content.title || !content.description || !content.order_number) {
      return NextResponse.json(
        { message: "Debes rellenar todos los campos." },
        { status: 400 }
      );
    }

    const result: RequestBody = await pool.query(
      "INSERT INTO contents SET ?",
      content
    );

    pool.end();

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

export async function PUT(request: NextRequest) {
  try {
    const formData = await request.formData();

    let hasValidData = false;

    for (const [key, value] of formData.entries()) {
      if (
        key === "contentId" ||
        key === "document_Path" ||
        key === "video_Path"
      )
        continue;

      if (
        (typeof value === "string" && value.trim() !== "") ||
        (value instanceof File && value.size > 0)
      ) {
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

    const id = formData.get("contentId");

    const videoFile = formData.get("video_Path") as File;
    let videoPath;

    const documentFile = formData.get("document_Path") as File;
    let documentPath;

    if (path.extname(videoFile.name)) {
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

      videoPath = `/videoContent/${id}${path.extname(videoFile.name)}`;
    }

    if (path.extname(documentFile.name)) {
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

      documentPath = `/documentContent/${id}${path.extname(documentFile.name)}`;
    }

    const rawContent: Partial<Content> = {
      title: String(formData.get("title")) || undefined,
      description: String(formData.get("description")) || undefined,
      order_number: Number(formData.get("orderNumber")) || undefined,
      media_Path: videoPath || undefined,
      document_Path: documentPath || undefined,
    };

    const content = Object.fromEntries(
      Object.entries(rawContent).filter(([_, value]) => value !== undefined)
    );

    const result: RequestBody = await pool.query(
      `UPDATE contents SET ? WHERE id = ?`,
      [content, Number(id)]
    );

    pool.end();

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
