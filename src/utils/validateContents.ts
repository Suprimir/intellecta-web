"use server";

import { pool } from "@/libs/mysql";

export interface contentInput {
  content_ID: number;
  course_ID: number;
  description: string;
  documentPath?: string;
  contentRating?: string;
}

export interface contentErrors {
  field: string;
  message: string;
}

export async function validateContents(data: contentInput) {
  const errors: contentErrors[] = [];

  const courseExists: [] = await pool.query(
    "SELECT 1 FROM courses WHERE course_ID = ?",
    data.course_ID
  );

  if (!(courseExists.length > 0)) {
    errors.push({ field: "course_ID", message: "El curso no existe" });
    return errors;
  }

  return errors;
}
