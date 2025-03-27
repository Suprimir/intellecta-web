import { NextResponse } from "next/server";
import { pool } from "@/libs/mysql";

type RequestBody = {
  insertId: number;
  affectedRows: number;
};

interface Messages {
    message_ID: number;
    receiver_User_ID: string;
    sender_User_ID: string;
    timestamp: string;
    message_Content: string;
  }
export async function GET(
  request: Request,
  { params }: { params: Promise<{ messageId: number }> }
) {
  try {
    const { messageId } = await params;

    const result = await pool.query(
      "SELECT * FROM messages WHERE message_ID = ?",
      messageId
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
      "INSERT INTO messages SET ?",
      data
    );

    return NextResponse.json({
      message: "Mensaje creado exitosamente",
      messageId: result.insertId,
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
  { params }: { params: Promise<{ messageId: number }> }
) {
  try {
    const data = await request.json();
    const { messageId } = await params;

    const result: RequestBody = await pool.query(
      "UPDATE messages SET ? WHERE message_ID = ?",
      [data, messageId]
    );

    if (result.affectedRows == 0) {
      return NextResponse.json(
        {
          message: "Mensaje no encontrado.",
        },
        {
          status: 404,
        }
      );
    } 
      const [updatedMessage]: Messages[] = await pool.query(
        "SELECT * FROM messages WHERE message_ID = ?",
        messageId
      );
  
      return NextResponse.json(updatedMessage);
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
  { params }: { params: Promise<{ messageId: number }> }
) {
  try {
    const { messageId } = await params;

    const result: RequestBody = await pool.query(
      "DELETE FROM messages WHERE message_ID = ?",
      messageId
    );

    if (result.affectedRows == 0) {
      return NextResponse.json(
        {
          message: "Mensaje no encontrado.",
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
