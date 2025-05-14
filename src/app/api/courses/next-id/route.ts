// Esto lo uso para renombrar las imagenes basicamente

import { pool } from "@/libs/mysql";
import { NextRequest, NextResponse } from "next/server";

interface NextID {
  AUTO_INCREMENT: number;
}

export async function GET(request: NextRequest) {
  try {
    const data: NextID[] = await pool.query(
      "SELECT AUTO_INCREMENT FROM information_schema.TABLES WHERE TABLE_SCHEMA = DATABASE() AND TABLE_NAME = 'courses';"
    );

    const nextId = data[0].AUTO_INCREMENT;

    return NextResponse.json(nextId);
  } catch (error) {
    console.error("Error al obtener el próximo ID:", error);
    return NextResponse.json({ error: "Error al obtener el próximo ID" });
  } finally {
    pool.end();
  }
}
