import { NextRequest, NextResponse } from "next/server";
import { pool } from "@/libs/mysql";
import { validatePermissions } from "@/utils/validatePermissions";
import { verifyAuth } from "@/libs/auth";

type RequestBody = {
  insertId: number;
  affectedRows: number;
};

interface Categories {
  category_ID: number;
  category_Description: string;
}

export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ categoryId: number }> }
) {
  try {
    const { categoryId } = await params;
    const result = await pool.query(
      "SELECT * FROM categories WHERE category_ID = ?",
      [categoryId]
    );
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
  { params }: { params: Promise<{ categoryId: number }> }
) {
  try {
    const { categoryId } = await params;

    const searchParams = request.nextUrl.searchParams;
    const categoryDescription = searchParams.get("description");

    if (!(await validatePermissions(request, true))) {
      return NextResponse.json(
        {
          message: "No tienes los permisos suficientes para hacer este cambio.",
        },
        { status: 403 }
      );
    }

    const result: RequestBody = await pool.query(
      "UPDATE categories SET ? WHERE category_ID = ?",
      [{ category_Description: categoryDescription }, categoryId]
    );

    if (result.affectedRows == 0) {
      return NextResponse.json(
        {
          message: "Categoría no encontrada.",
        },
        {
          status: 404,
        }
      );
    }
    const [updatedCategory]: Categories[] = await pool.query(
      "SELECT * FROM categories WHERE category_ID = ?",
      categoryId
    );

    return NextResponse.json(updatedCategory);
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
  { params }: { params: Promise<{ categoryId: number }> }
) {
  try {
    const { categoryId } = await params;

    // Verifica que tienes los permisos suficientes usando la sessionToken
    if (await validatePermissions(request, true)) {
      return NextResponse.json(
        {
          message: "No tienes los permisos suficientes para hacer este cambio.",
        },
        { status: 403 }
      );
    }

    const result: RequestBody = await pool.query(
      "DELETE FROM categories WHERE category_ID = ?",
      categoryId
    );

    if (result.affectedRows == 0) {
      return NextResponse.json(
        {
          message: "Categoría no encontrada.",
        },
        {
          status: 404,
        }
      );
    }

    return new Response(null, { status: 204 });
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
