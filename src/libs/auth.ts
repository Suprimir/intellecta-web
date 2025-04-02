import { verify } from "jsonwebtoken";
import { NextRequest, NextResponse } from "next/server";

export async function verifyAuth(request: NextRequest) {
  try {
    const sessionToken = request.cookies.get("sessionToken")?.value;
    if (!sessionToken) {
      return NextResponse.json(
        { message: "No hay un sessionToken." },
        { status: 404 }
      );
    }

    const user = verify(sessionToken, "secret");

    return NextResponse.json(user);
  } catch (error: unknown) {
    return NextResponse.json(
      { message: "No hay sessionToken. " },
      { status: 404 }
    );
  }
}
