// ruta /api/payments
import { pool } from "@/libs/mysql";
import { Payments } from "@/types/api";
import { verify } from "jsonwebtoken";
import { NextRequest, NextResponse } from "next/server";
import Stripe from "stripe";
const stripe = new Stripe(process.env.STRIPE_SECRET_KEY!);

interface PaymentIntentRequest {
  paymentIntentIds: string[];
}

interface PaymentIntentResponse {
  success: boolean;
  data?: Stripe.PaymentIntent[];
  errors?: Array<{
    id: string;
    error: string;
  }>;
  message?: string;
}

export async function GET(request: NextRequest) {
  try {
    // Verificar que el usuario sea administrador
    const token = request.cookies.get("sessionToken")?.value;

    if (!token) {
      return NextResponse.json({ message: "No autorizado" }, { status: 401 });
    }
    const payload = verify(token, process.env.JWT_SECRET!) as {
      uuid: string;
      rol: string;
    };

    if (payload.rol !== "admin") {
      return NextResponse.json({ message: "No autorizado" }, { status: 403 });
    }

    // Obtener pagos
    const payments: Payments[] = await pool.query(
      "SELECT p.id, p.payment_intent, p.amount, p.currency, p.status, u.email FROM payments p JOIN users u ON p.user_ID = u.uuid;"
    );

    if (payments.length === 0) {
      return NextResponse.json({ message: "No hay pagos" }, { status: 400 });
    }

    return NextResponse.json(payments);
  } catch (error: unknown) {
    console.log(error);
    return NextResponse.json(
      { message: (error as Error).message },
      { status: 500 }
    );
  }
}
