/*
  Retorna un array con los errores
  de validacion del usuario (username, email y password)
*/

"use server";

import { User } from "@/types/api";

export interface userErrors {
  field: string;
  messsage: string;
}

export async function validateUser(user: User) {
  const errors: userErrors[] = [];

  // Verificamos que todos los campos necesarios estan.
  if (
    !user.name ||
    !user.lastname ||
    !user.username ||
    !user.email ||
    !user.password
  ) {
    errors.push({
      field: "all",
      messsage: "Todos los campos deben estar llenos.",
    });
    return errors;
  }

  //   Si el nombre de usuario es menor a 8 regresamos un error para avisar al usuario
  if (user.username.length < 8) {
    errors.push({
      field: "username",
      messsage: "El usuario debe tener más de 8 caracteres.",
    });
    return errors;
  }

  // Verificamos que el correo tengo un formato exacto
  if (!/\S+[@]+\S+[.]+\S+/.test(user.email)) {
    errors.push({
      field: "email",
      messsage:
        "El email debe estar en el formato correcto: example@example.com.",
    });
    return errors;
  }

  // Verificamos que la contraseña tenga mas de 8 caracteres si no regresa error
  if (user.password.length < 8) {
    errors.push({
      field: "password",
      messsage: "La contraseña debe más de 8 caracteres.",
    });
    return errors;
  }

  return errors;
}
