import { NextRequest, NextResponse } from "next/server";
import { pool } from "@/libs/mysql";
import { User } from "@/types/api";

export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ uuid: string }> }
) {
  try {
    const { uuid } = await params;

    const user: User[] = await pool.query(
      "SELECT username, email, role, profilePicture FROM users WHERE uuid = ? LIMIT 1",
      uuid
    );

    return NextResponse.json(user[0]);
  } catch (error: unknown) {
    return NextResponse.json(
      { message: "No hay sessionToken. " },
      { status: 404 }
    );
  }
}
