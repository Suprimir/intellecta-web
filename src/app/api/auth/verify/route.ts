import { NextRequest, NextResponse } from "next/server";
import { pool } from "@/libs/mysql";

type VerifyProps = {
  user_ID: string;
};

export async function GET(request: NextRequest) {
  try {
    const searchParams = request.nextUrl.searchParams;
    const verifyToken = searchParams.get("token");

    const resultUserID: VerifyProps[] = await pool.query(
      "SELECT user_ID FROM emailToken WHERE token = ?",
      verifyToken
    );

    if (resultUserID.length > 0) {
      const userUUID = resultUserID[0]["user_ID"];

      await pool.query(
        "UPDATE users SET verified = true WHERE user_ID = ?",
        userUUID
      );

      await pool.query("DELETE FROM emailToken WHERE user_ID = ?", userUUID);

      return NextResponse.json({
        message: "Has sido verificado correctamente",
      });
    }
  } catch (error: unknown) {
    console.log(error);
    return NextResponse.json(
      {
        message: (error as Error).message,
      },
      { status: 500 }
    );
  }
}
