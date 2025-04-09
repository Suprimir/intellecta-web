export interface userInput {
  user_ID: string;
  username: string;
  email: string;
  password: string;
  role: "student" | "instructor" | "admin";
  profilePicture: string | null;
}

export interface userErrors {
  field: string;
  messsage: string;
}

export function validateUser(data: userInput) {
  const errors: userErrors[] = [];

  // Verificamos que todos los campos necesarios estan.
  if (!data.username || !data.email || !data.password) {
    errors.push({ field: "all", messsage: "No hay campos." });
  }

  //   Si el nombre de usuario es menor a 8 regresamos un error para avisar al usuario
  if (data.username.length < 8) {
    errors.push({
      field: "username",
      messsage: "El usuario debe tener más de 8 caracteres.",
    });
  }

  // Verificamos que el correo tengo un formato exacto
  if (!/\S+[@]+\S+[.]+\S+/.test(data.email)) {
    errors.push({
      field: "email",
      messsage:
        "El email debe estar en el formato correcto: example@example.com.",
    });
  }

  // Verificamos que la contraseña tenga mas de 8 caracteres si no regresa error
  if (data.password.length < 8) {
    errors.push({
      field: "password",
      messsage: "La contraseña debe más de 8 caracteres.",
    });
  }

  return errors;
}
