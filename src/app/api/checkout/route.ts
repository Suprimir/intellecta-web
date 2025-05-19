import { NextRequest, NextResponse } from "next/server";
const stripe = require("stripe")(process.env.STRIPE_SECRET_KEY);

export async function POST(request: NextRequest) {
  try {
    const { amount, uuid, courses } = await request.json();
    if (!uuid || !courses || !Array.isArray(courses) || courses.length === 0) {
      return NextResponse.json(
        { error: "Se requiere uuid y al menos un curso" },
        { status: 400 }
      );
    }

    const paymentIntent = await stripe.paymentIntents.create({
      amount: amount,
      currency: "mxn",
      payment_method_types: ["card"],
      metadata: {
        uuid,
        courses: JSON.stringify(courses.map((c: any) => c.id)),
      },
      description: `Compra de curso(s): ${courses
        .map((c: any) => c.name)
        .join(", ")}`,
    });

    return NextResponse.json({
      clientSecret: paymentIntent.client_secret,
      amount,
    });
  } catch (error: any) {
    console.error("Error al crear el Payment Intent:", error);
    return NextResponse.json(
      { error: error.message || "Error del servidor" },
      { status: 500 }
    );
  }
}
