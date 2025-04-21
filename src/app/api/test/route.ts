import { NextRequest, NextResponse } from "next/server";

export async function GET(request: NextRequest) {
  const date = new Date(Date.now()).toISOString();
  const dateFormatted = date.split("T")[0];

  return NextResponse.json({
    date: dateFormatted,
  });
}
