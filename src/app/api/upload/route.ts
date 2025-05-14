import fs from "fs";
import { NextRequest, NextResponse } from "next/server";
import path from "path";

export default async function GET(request: NextRequest) {
  try {
    const uploadDir = path.join(process.cwd(), "public", "courseImages");

    if (!fs.existsSync(uploadDir)) {
      fs.mkdirSync(uploadDir, { recursive: true });
    }

    const filePath = path.join(uploadDir, filename);

    fs.copyFileSync(file.filepath, filePath);

    return NextResponse.json({
      success: true,
      path: `/courseImages/${filename}`,
    });
  } catch (error) {
    console.error("Error al subir imagen:", error);
    return NextResponse.json({ error: "Error al subir la imagen" });
  }
}
