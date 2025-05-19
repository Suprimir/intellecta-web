import { NextRequest, NextResponse } from "next/server";
import { pool } from "@/libs/mysql";
import { ShoppingCart } from "@/types/api";
const stripe = require("stripe")(process.env.STRIPE_SECRET_KEY);

interface RequestBody {
  insertId: number;
  affectedRows: number;
}

export async function GET(request: NextRequest) {
  const { searchParams } = new URL(request.url);
  const payment_intent = searchParams.get("payment_intent");

  if (!payment_intent) {
    return NextResponse.json(
      { error: "Se requiere payment_intent" },
      { status: 400 }
    );
  }

  const paymentIntentAlreadyExists: RequestBody[] = await pool.query(
    "SELECT 1 FROM payments WHERE payment_intent = ?",
    payment_intent
  );

  if (paymentIntentAlreadyExists.length !== 0) {
    return NextResponse.json(
      { error: "Este pago ya fue procesado anteriormente." },
      { status: 500 }
    );
  }

  try {
    const paymentIntent = await stripe.paymentIntents.retrieve(payment_intent);

    if (paymentIntent.status === "succeeded") {
      const { uuid, courses } = paymentIntent.metadata;
      const courseIds = JSON.parse(courses);

      const placeholders = courseIds.map(() => "(?, ?, ?)").join(", ");

      const values = courseIds.flatMap((id: number) => [
        uuid,
        id,
        new Date().toISOString().slice(0, 19).replace("T", " "),
      ]);

      await pool.query("START TRANSACTION");

      await pool.query(
        `INSERT INTO purchased_courses (user_ID, course_ID, purchase_date) VALUES ${placeholders}`,
        values
      );

      await pool.query(
        "INSERT INTO payments (user_ID, payment_intent) VALUE (?, ?)",
        [uuid, paymentIntent.id]
      );

      const placeholdersDelete = courseIds.map(() => "?").join(",");

      const shoppingCartID: ShoppingCart[] = await pool.query(
        "SELECT id FROM shoppingcarts WHERE uuid = ?",
        uuid
      );

      await pool.query(
        `DELETE FROM shoppingcarts_details WHERE course_ID IN (${placeholdersDelete}) AND shoppingCart_ID = ${shoppingCartID[0].id}`,
        courseIds
      );

      await pool.query("COMMIT");
      await pool.end();

      return NextResponse.json({
        success: true,
        message: "Pago verificado correctamente",
        uuid,
        courseIds,
      });
    } else {
      return NextResponse.json(
        {
          success: false,
          message: "El pago no ha sido completado",
          status: paymentIntent.status,
        },
        { status: 400 }
      );
    }
  } catch (error: any) {
    await pool.query("ROLLBACK");
    console.error("Error al verificar el pago:", error);
    return NextResponse.json(
      { error: error.message || "Error del servidor" },
      { status: 500 }
    );
  }
}
