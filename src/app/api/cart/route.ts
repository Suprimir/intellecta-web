import { RequestBody, ShoppingCart, ShoppingCartDetails } from "@/types/api";
import { NextRequest, NextResponse } from "next/server";
import { pool } from "@/libs/mysql";

export const getShoppingCart = async (uuid: string) => {
  const shoppingCartIDArray: ShoppingCart[] = await pool.query(
    "SELECT id FROM shoppingCarts WHERE uuid = ? LIMIT 1",
    uuid
  );

  if (shoppingCartIDArray.length > 0) {
    return shoppingCartIDArray[0];
  } else {
    const newShoppingCart: RequestBody = await pool.query(
      "INSERT INTO shoppingCarts SET ?",
      {
        uuid: uuid,
      }
    );

    return { id: newShoppingCart.insertId };
  }
};

export async function GET(request: NextRequest) {
  try {
    const searchParams = request.nextUrl.searchParams;
    const uuid = searchParams.get("uuid");

    if (!uuid) {
      return NextResponse.json(
        {
          message: "Faltan parametros.",
        },
        { status: 500 }
      );
    }

    const shoppingCartID = (await getShoppingCart(uuid)).id;

    const shoppingCartDetails: ShoppingCartDetails[] = await pool.query(
      "SELECT course_ID FROM shoppingCarts_details WHERE shoppingCart_ID = ?",
      shoppingCartID
    );

    return NextResponse.json(shoppingCartDetails);
  } catch (error: unknown) {
    console.error()
    return NextResponse.json(
      {
        message: error instanceof Error ? error.message : "Error desconocido",
      },
      { status: 500 }
    );
  }
}
