"use server";

import { pool } from "@/libs/mysql";
import { Course } from "@/types/api";

export interface courseErrors {
  field: string;
  message: string;
}

export async function validateCourses(data: Course) {
  const errors: courseErrors[] = [];

  // Si un curso con el mismo nombre ya existe
  const courseAlreadyExist: [] = await pool.query(
    "SELECT 1 FROM courses WHERE name = ?",
    data.name
  );

  pool.end();

  if (courseAlreadyExist.length > 0) {
    errors.push({
      field: "course_already_exists",
      message: "Un curso con el mismo nombre ya existe",
    });
    return errors;
  }

  // Verificar que el id de la categoria existe
  const categoryExists: [] = await pool.query(
    "SELECT 1 FROM categories WHERE id = ?",
    data.category_ID
  );

  pool.end();

  if (categoryExists.length <= 0) {
    errors.push({ field: "category", message: "La categoria no existe" });
    return errors;
  }

  // Verifica que el ID del instructor exista en la BD
  const instructorExists: [] = await pool.query(
    "SELECT 1 FROM users WHERE uuid = ? AND role = 'admin' OR role = 'instructor'",
    data.uuid
  );

  pool.end();

  if (instructorExists.length <= 0) {
    errors.push({
      field: "instructorUuid",
      message: "El instructor no existe.",
    });
    return errors;
  }

  const localDate = new Date(new Date(Date.now()).toISOString().split("T")[0]);
  const receivedDate = new Date(data.date);

  if (receivedDate < localDate) {
    errors.push({
      field: "date",
      message: "La fecha de creacion del curso es menor a la fecha actual.",
    });
    return errors;
  }

  return errors;
}
