import { NextResponse, NextRequest } from "next/server";
import { pool } from "@/libs/mysql";
import { Course } from "@/types/api";

export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ uuid: string }> }
) {
  const { uuid } = await params;

  try {
    const courses: Course[] = await pool.query(
      `
        SELECT c.id, 
                c.name, 
                c.description, 
                c.image, 
                c.date, 
                c.duration, 
                c.instructor_ID, 
                CONCAT_WS(" ", u.name, u.last_name) AS instructor, 
                c.category_ID, 
                cat.description AS category_name, 
                c.price 
        FROM courses c 
        JOIN users u ON u.uuid = c.instructor_ID
        JOIN categories cat ON c.category_ID = cat.id
        WHERE c.instructor_ID = ?;
        `,
      uuid
    );

    return NextResponse.json(courses);
  } catch (error: unknown) {
    console.error(error);
    return NextResponse.json(
      { message: (error as Error).message },
      { status: 500 }
    );
  }
}
