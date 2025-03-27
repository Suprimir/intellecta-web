import { NextResponse } from "next/server";
import { pool } from "@/libs/mysql";

type RequestBody = {
  insertId: number;
  affectedRows: number;
};
interface Categories {
    category_ID: number;
    category_Description: string;
}
  
export async function GET(
  request: Request,
  { params }: { params: Promise<{ categoryId: number }> }
) {
  try {
    const { categoryId } = await params;

    const result = await pool.query(
      "SELECT * FROM categories WHERE category_ID = ?",
      categoryId
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

export async function POST(request: Request) {
  try {
    const data = await request.json();

    const result: RequestBody = await pool.query(
      "INSERT INTO categories SET ?",
      data
    );

    return NextResponse.json({
      message: "Categoría creada exitosamente",
      categoryId: result.insertId,
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

export async function PUT(
  request: Request,
  { params }: { params: Promise<{ categoryId: number }> }
) {
  try {
    const data = await request.json();
    const { categoryId } = await params;

    const result: RequestBody = await pool.query(
      "UPDATE categories SET ? WHERE category_ID = ?",
      [data, categoryId]
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
  request: Request,
  { params }: { params: Promise<{ categoryId: number }> }
) {
  try {
    const { categoryId } = await params;

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
