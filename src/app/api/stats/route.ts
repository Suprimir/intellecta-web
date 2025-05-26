import { pool } from "@/libs/mysql";
import { stat, Stats } from "fs";
import { NextResponse, NextRequest } from "next/server";

export async function GET(request: NextRequest) {
  try {
    const stats: Stats[] = await pool.query(
      `
        SELECT 
        (SELECT COUNT(*) FROM courses) AS totalCourses,
        (SELECT COUNT(*) FROM users) AS totalUsers,
        (SELECT COUNT(*) FROM payments) AS totalPayments,
        (SELECT SUM(amount) FROM payments) AS totalIncomes;
        `
    );

    return NextResponse.json(stats[0]);
  } catch (error: unknown) {
    console.error(error);
    return NextResponse.json(
      { message: (error as Error).message },
      { status: 500 }
    );
  }
}
