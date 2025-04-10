import { NextRequest, NextResponse } from "next/server";
import { pool } from "@/libs/mysql";
import { validatePermissions } from "@/utils/validatePermissions";
import { contentInput, validateContents } from "@/utils/validateContents";

type RequestBody = {
  insertId: number;
  affectedRows: number;
};

export async function GET() {
  try {
    const result = await pool.query("SELECT * FROM contents");

    pool.end();
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
    const content: contentInput = await request.json();

    if (await validatePermissions(request, true)) {
      return NextResponse.json(
        {
          message: "No tienes los permisos suficientes para hacer este cambio.",
        },
        { status: 403 }
      );
    }

    const contentValidationErrors = await validateContents(content);

    if (contentValidationErrors.length > 0) {
      return NextResponse.json(
        contentValidationErrors.map((error) => ({
          field: error.field,
          message: error.message,
        })),
        { status: 409 }
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
