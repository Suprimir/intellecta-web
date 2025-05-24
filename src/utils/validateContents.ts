"use server";

import { pool } from "@/libs/mysql";
import { Content } from "@/types/api";

export interface contentErrors {
  field: string;
  message: string;
}

export async function validateContents(data: Partial<Content>) {
  const errors: contentErrors[] = [];

  // La unidad que seleccionaste no existe
  const unitExists: [] = await pool.query(
    "SELECT 1 FROM units_courses WHERE id = ?",
    data.unit_ID
  );

  pool.end();

  if (!(unitExists.length > 0)) {
    errors.push({ field: "course_ID", message: "El curso no existe" });
    return errors;
  }

  return errors;
}
