import { NextResponse, NextRequest } from "next/server";
import { pool } from "@/libs/mysql";
import { Course } from "@/types/api";

export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ uuid: string }> }
) {
  const { uuid } = await params;

  try {
    const query = `SELECT c.id,
                            pc.user_ID,
                            c.name, 
                            c.description, 
                            c.image, 
                            c.date, 
                            c.duration, 
                            c.instructor_ID, 
                            CONCAT_WS(" ", u.name, u.last_name) AS instructor, 
                            c.category_ID,
                            c.rating,
                            cat.description AS category_name, 
                            c.price
                        FROM courses c 
                        JOIN users u ON u.uuid = c.instructor_ID
                        JOIN categories cat ON c.category_ID = cat.id
                        JOIN purchased_courses pc ON pc.course_ID = c.id
                        WHERE pc.user_ID = ?
        `;

    const purchasedCourses: Course[] = await pool.query(query, uuid);

    return NextResponse.json(purchasedCourses);
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
