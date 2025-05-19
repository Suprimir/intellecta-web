import { redirect } from "next/navigation";

export async function SignUp(formData: FormData) {
  const name = formData.get("name");
  const lastname = formData.get("lastname");
  const username = formData.get("username");
  const email = formData.get("email");
  const password = formData.get("password");

  const response = await fetch("/api/auth/register", {
    method: "POST",
    body: JSON.stringify({
      name,
      lastname,
      username,
      email,
      password,
    }),
    headers: {
      "Content-Type": "application/json",
    },
  });

  return response;
}

export async function LogIn(formData: FormData) {
  const username = formData.get("username");
  const password = formData.get("password");

  const response = await fetch("/api/auth/login", {
    method: "POST",
    body: JSON.stringify({
      username,
      password,
    }),
    headers: {
      "Content-Type": "application/json",
    },
  });

  return response;
}
