"use server";

import { pool } from "@/libs/mysql";

export interface courseInput {
  course_ID: number;
  name: string;
  description: string;
  date: Date;
  duration: number;
  uuid: string;
  category_ID: number;
}

export interface courseErrors {
  field: string;
  message: string;
}

export async function validateCourses(data: courseInput) {
  const errors: courseErrors[] = [];

  const courseAlreadyExist: [] = await pool.query(
    "SELECT 1 FROM courses WHERE course_Name = ?",
    data.name
  );

  pool.end();

  if (!(courseAlreadyExist.length > 0)) {
    errors.push({ field: "category", message: "La categoria no existe" });
    return errors;
  }

  const categoryExists: [] = await pool.query(
    "SELECT 1 FROM categories WHERE category_ID = ?",
    data.category_ID
  );
  console.log(categoryExists);

  pool.end();

  if (!(categoryExists.length > 0)) {
    errors.push({ field: "category", message: "La categoria no existe" });
    return errors;
  }

  const instructorExists: [] = await pool.query(
    "SELECT 1 FROM users WHERE user_ID = ? AND role = 'admin' OR role = 'instructor'",
    data.uuid
  );

  pool.end();

  if (!(instructorExists.length > 0)) {
    errors.push({
      field: "instructorUuid",
      message: "El instructor no existe.",
    });
    return errors;
  }

  if (data.date < new Date(Date.now())) {
    errors.push({
      field: "date",
      message: "La fecha de creacion del curso es menor a la fecha actual.",
    });
    return errors;
  }

  return errors;
}
