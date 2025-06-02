import { NextRequest, NextResponse } from "next/server";
import { pool } from "@/libs/mysql";
import { Profile } from "@/types/api";

export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ uuid: string }> }
) {
  try {
    const { uuid } = await params;

    const user: Profile[] = await pool.query(
      "SELECT username, email, role, profilePicture FROM users WHERE uuid = ? LIMIT 1",
      uuid
    );

    const certificates: [] = await pool.query(
      ` 
            SELECT c.user_ID, c.course_ID, co.name
            FROM certificates c
            JOIN courses co ON co.id = c.course_ID
            WHERE c.user_ID = ?;
        `,
      [uuid]
    );

    user.map((user) => {
      user.certificates = certificates;
    });

    const coursesIds = await pool.query(
      "SELECT course_ID FROM purchased_courses WHERE user_ID = ?;",
      [uuid]
    );

    const contentIds = await pool.query(
      `
        SELECT c.id FROM contents c
        JOIN units_courses uc ON c.unit_ID = uc.id
        WHERE uc.course_ID IN (?);
      `
    );

    return NextResponse.json(user[0]);
  } catch (error: unknown) {
    return NextResponse.json(
      { message: "No hay sessionToken. " },
      { status: 404 }
    );
  }
}
