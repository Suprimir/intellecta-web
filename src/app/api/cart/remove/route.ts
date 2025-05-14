"use server";

import { NextRequest, NextResponse } from "next/server";
import { getShoppingCart } from "../route";
import { pool } from "@/libs/mysql";
import { ShoppingCartDetails } from "@/types/api";
import { verifyAuth } from "@/libs/auth";
import { User } from "@/types/api";

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

    const shoppingCartID = (await getShoppingCart(user.uuid)).id;

    const cartItems: ShoppingCartDetails[] = await pool.query(
      "SELECT id FROM shoppingCarts_details WHERE shoppingCart_ID = ? AND course_ID = ?",
      [shoppingCartID, courseId]
    );

    if (!cartItems || cartItems.length === 0) {
      return NextResponse.json(
        { message: "El curso no está en el carrito" },
        { status: 404 }
      );
    }

    await pool.query(
      "DELETE FROM shoppingCarts_details WHERE shoppingCart_ID = ? AND course_ID = ?",
      [shoppingCartID, courseId]
    );

    // 4. Actualizar la fecha de modificación del carrito
    //await pool.query(
    //  "UPDATE shoppingCarts SET updated_at = NOW() WHERE id = ?",
    //  [cartId]
    //);

    return NextResponse.json(
      {
        message: "Curso removido del carrito exitosamente",
      },
      { status: 200 }
    );
  } catch (error) {
    console.error("Error al remover curso del carrito:", error);
    return NextResponse.json(
      {
        message: error instanceof Error ? error.message : "Error desconocido",
      },
      { status: 500 }
    );
  }
}
