import { NextRequest, NextResponse } from "next/server";
import { pool } from "@/libs/mysql";
import { validatePermissions } from "@/utils/validatePermissions";

type RequestBody = {
  insertId: number;
  affectedRows: number;
};

interface Contents {
  content_ID: number;
  course_ID: number;
  content_Description: string;
  document_Path: string;
  content_Rating: number;
}

export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ contentId: number }> }
) {
  try {
    const { contentId } = await params;

    const result = await pool.query(
      "SELECT * FROM contents WHERE content_ID = ?",
      contentId
    );

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

export async function PUT(
  request: NextRequest,
  { params }: { params: Promise<{ contentId: number }> }
) {
  try {
    const data = await request.json();
    const { contentId } = await params;

    if (await validatePermissions(request, true)) {
      return NextResponse.json(
        {
          message: "No tienes los permisos suficientes para hacer este cambio.",
        },
        { status: 403 }
      );
    }

    const result: RequestBody = await pool.query(
      "UPDATE contents SET ? WHERE content_ID = ?",
      [data, contentId]
    );

    pool.end();

    if (result.affectedRows == 0) {
      return NextResponse.json(
        {
          message: "Contenido no encontrado.",
        },
        {
          status: 404,
        }
      );
    }
    const [updatedContent]: Contents[] = await pool.query(
      "SELECT * FROM contents WHERE content_ID = ?",
      contentId
    );

    pool.end();

    return NextResponse.json(updatedContent);
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

export async function DELETE(
  request: NextRequest,
  { params }: { params: Promise<{ contentId: number }> }
) {
  try {
    const { contentId } = await params;

    if (await validatePermissions(request, true)) {
      return NextResponse.json(
        {
          message: "No tienes los permisos suficientes para hacer este cambio.",
        },
        { status: 403 }
      );
    }

    const result: RequestBody = await pool.query(
      "DELETE FROM contents WHERE content_ID = ?",
      contentId
    );

    pool.end();

    if (result.affectedRows == 0) {
      return NextResponse.json(
        {
          message: "Contenido no encontrado.",
        },
        {
          status: 404,
        }
      );
    }

    return NextResponse.json(null, { status: 204 });
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
