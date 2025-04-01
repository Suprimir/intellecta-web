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

export async function GET(request: Request) {
  try {
    const result = await pool.query("SELECT * FROM categories");

    return NextResponse.json(result);
  } catch (error: any) {
    console.log(error);
    return NextResponse.json({ message: error.message }, { status: 500 });
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
