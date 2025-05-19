import { verifyAuth } from "@/libs/auth";
import { pool } from "@/libs/mysql";
import { NextRequest, NextResponse } from "next/server";
import { Course, User } from "@/types/api";
import { getShoppingCart } from "../route";

export async function GET(request: NextRequest) {
  try {
    const user: User = await (await verifyAuth(request)).json();

    const shoppingCartID = (await getShoppingCart(user.uuid)).id;

    const courses: Course[] = await pool.query(
      "SELECT * FROM coursesCartFrontend WHERE shoppingCart_ID = ?",
      shoppingCartID
    );

    return NextResponse.json(courses);
  } catch (error: unknown) {
    console.error("Error:", error);
    return NextResponse.json(
      { message: (error as Error).message },
      { status: 404 }
    );
  }
}
