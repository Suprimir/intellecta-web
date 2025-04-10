"use server";

import { verify } from "jsonwebtoken";
import { NextRequest, NextResponse } from "next/server";

const JWT_SECRET = process.env.JWT_SECRET || "";

export async function verifyAuth(request: NextRequest) {
  try {
    const sessionToken = request.cookies.get("sessionToken")?.value;
    if (!sessionToken) {
      return NextResponse.json(
        { message: "No hay un sessionToken." },
        { status: 404 }
      );
    }

    const user = verify(sessionToken, JWT_SECRET);
    return NextResponse.json(user);
  } catch (error: unknown) {
    return NextResponse.json(
      { message: "No hay sessionToken. " },
      { status: 404 }
    );
  }
}
