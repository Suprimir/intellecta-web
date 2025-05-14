"use server";

import { NextRequest, NextResponse } from "next/server";
import { pool } from "@/libs/mysql";
import { getShoppingCart } from "../route";
import { verifyAuth } from "@/libs/auth";
import { User } from "@/types/api";

interface RequestBody {
  insertId: number;
  affectedRows: number;
}

export async function POST(request: NextRequest) {
  try {
    const { courseId } = await request.json();

    const user: User = await (await verifyAuth(request)).json();

    if (!courseId || !user.uuid) {
      return NextResponse.json(
        { message: "Faltan parametros." },
        { status: 400 }
      );
    }

    const shoppingCartID = await getShoppingCart(user.uuid);

    const requestInsertShoppingCartDetails: RequestBody = await pool.query(
      "INSERT INTO shoppingCarts_details SET ?",
      {
        shoppingCart_ID: shoppingCartID.id,
        course_ID: courseId,
      }
    );

    pool.end();

    return NextResponse.json({
      message: "Agregado al carrito exitosamente.",
      shoppingCartDetailsID: requestInsertShoppingCartDetails.insertId,
    });
  } catch (error: unknown) {
    console.error("Error al remover curso del carrito:", error);
    return NextResponse.json(
      { message: (error as Error).message },
      { status: 404 }
    );
  }
}
