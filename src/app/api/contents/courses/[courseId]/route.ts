import { NextRequest, NextResponse } from "next/server";
import { pool } from "@/libs/mysql";
import { Content } from "@/types/api";

export async function GET(
  request: NextRequest,
  {
    params,
  }: {
    params: Promise<{ courseId: number }>;
  }
) {
  const { courseId } = await params;
  console.log(courseId);
  try {
    const contents: Content[] = await pool.query(
      "SELECT * FROM contentsFrontend WHERE course_ID = ?",
      courseId
    );

    return NextResponse.json(contents);
  } catch (error: unknown) {
    console.error(error);
    return NextResponse.json(
      { message: (error as Error).message },
      { status: 500 }
    );
  }
}
