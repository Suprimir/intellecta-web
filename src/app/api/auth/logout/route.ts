import { verify } from "jsonwebtoken";
import { NextRequest, NextResponse } from "next/server";

export async function POST(request: NextRequest) {
  const sessionToken = request.cookies.get("sessionToken")?.value;

  if (!sessionToken) {
    return NextResponse.json({ message: "No hay token." }, { status: 404 });
  }

  try {
    verify(sessionToken, "secret");
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
    return NextResponse.json(
      { message: (error as Error).message },
      { status: 500 }
    );
  }
}
