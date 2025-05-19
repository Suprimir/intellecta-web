import { NextRequest, NextResponse } from "next/server";
import { pool } from "@/libs/mysql";
import { PurchasedCourses } from "@/types/api";

export async function POST(request: NextRequest) {
  try {
    const purchasedCourses: PurchasedCourses[] = await request.json();

    console.log(purchasedCourses);

    const placeholders = purchasedCourses.map((item) => "(?, ?, ?)").join(", ");
    const values = purchasedCourses.flatMap((purchase) => [
      purchase.user_ID,
      purchase.course_ID,
      purchase.purchase_date ||
        new Date().toISOString().slice(0, 19).replace("T", " "),
    ]);

    console.log(placeholders);
    console.log(values);

    return NextResponse.json("Free fair");
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
