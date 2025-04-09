"use server";

import { verify } from "jsonwebtoken";
import { NextRequest, NextResponse } from "next/server";

const JWT_SECRET = process.env.JWT_SECRET || "";

export async function POST(request: NextRequest) {
  const sessionToken = request.cookies.get("sessionToken")?.value;

  if (!sessionToken) {
    return NextResponse.json({ message: "No hay token." }, { status: 404 });
  }

  try {
    verify(sessionToken, JWT_SECRET);
    const response = NextResponse.json({
      message: "Cerraste sesion exitosamente.",
    });

    response.cookies.set("sessionToken", "", {
      httpOnly: true,
      maxAge: 0,
      path: "/",
      sameSite: "strict",
      secure: process.env.NODE_ENV === "production",
    });

    return response;
  } catch (error: unknown) {
    console.error("Error en logout:", error);

    return NextResponse.json(
      { message: (error as Error).message },
      { status: 500 }
    );
  }
}
