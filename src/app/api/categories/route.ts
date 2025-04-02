import { NextRequest, NextResponse } from "next/server";
import { pool } from "@/libs/mysql";
import { verifyAuth } from "@/libs/auth";

type RequestBody = {
  insertId: number;
  affectedRows: number;
};

interface Categories {
  category_ID: number;
  category_Description: string;
}

export async function GET() {
  try {
    const result = await pool.query("SELECT * FROM categories");

    return NextResponse.json(result);
  } catch (error: any) {
    console.log(error);
    return NextResponse.json({ message: error.message }, { status: 500 });
  }
}

export async function POST(request: NextRequest) {
  try {
    const searchParams = request.nextUrl.searchParams;
    const categoryDescription = searchParams.get("description");

    // Verifica que el rol del usuario sea de administrador
    const data = await verifyAuth(request);

    if (!data.ok) {
      return data;
    }

    const { rol } = await data.json();
    if (rol != "admin") {
      return NextResponse.json(
        {
          message: "No tienes los permisos suficientes para hacer este cambio.",
        },
        { status: 403 }
      );
    }

    // Verificacion que se encuentra el parametro "description" en el request
    if (!categoryDescription) {
      return NextResponse.json(
        {
          message: "No hay valor para la descripcion de la categoria.",
        },
        { status: 406 }
      );
    }

    // Verificacion si ya existe una categoria con la misma descripcion
    const alreadyExist: RequestBody[] = await pool.query(
      "SELECT 1 FROM categories WHERE category_Description = ?",
      categoryDescription
    );

    if (alreadyExist.length > 0) {
      return NextResponse.json(
        {
          message: "Ya existe una categoria con ese nombre.",
        },
        { status: 409 }
      );
    }

    // Una vez verificado aqui se continua con la insercion de los datos en la BD

    const result: RequestBody = await pool.query(
      "INSERT INTO categories SET ?",
      {
        category_Description: categoryDescription,
      }
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
