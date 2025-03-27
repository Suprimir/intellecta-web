import { NextResponse } from "next/server";
import { pool } from "@/libs/mysql";

type RequestBody = {
  insertId: number;
  affectedRows: number;
};

interface User {
  user_ID: string;
  username: string;
  email: string;
  password: string;
  role: "student" | "instructor" | "admin";
  profilePicture: string | null;
}

export async function GET(
  request: Request,
  { params }: { params: Promise<{ userId: string }> }
) {
  try {
    const { userId } = await params;

    const [user]: User[] = await pool.query(
      "SELECT * FROM users WHERE user_ID = ?",
      userId
    );

    return NextResponse.json(user);
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
    const data: User = await request.json();

    const result: RequestBody = await pool.query(
      "INSERT INTO users SET ?",
      data
    );

    return NextResponse.json({
      message: "Usuario creado exitosamente",
      userId: result.insertId,
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
  { params }: { params: Promise<{ userId: string }> }
) {
  try {
    const data: User = await request.json();
    const { userId } = await params;

    const result: RequestBody = await pool.query(
      "UPDATE users SET ? WHERE user_ID = ?",
      [data, userId]
    );

    if (result.affectedRows == 0) {
      return NextResponse.json(
        {
          message: "Usuario no encontrado.",
        },
        {
          status: 404,
        }
      );
    }

    const [updatedUser]: User[] = await pool.query(
      "SELECT * FROM users WHERE user_ID = ?",
      userId
    );

    return NextResponse.json(updatedUser);
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
  { params }: { params: Promise<{ userId: string }> }
) {
  try {
    const { userId } = await params;

    const result: RequestBody = await pool.query(
      "DELETE FROM users WHERE user_ID = ?",
      userId
    );

    if (result.affectedRows == 0) {
      return NextResponse.json(
        {
          message: "Usuario no encontrado.",
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
