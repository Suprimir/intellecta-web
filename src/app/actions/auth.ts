import { redirect } from "next/navigation";
import { NextResponse } from "next/server";

export async function SignUp(formData: FormData) {
  const username = formData.get("username");
  const email = formData.get("email");
  const password = formData.get("password");

  const response = await fetch("/api/auth/register", {
    method: "POST",
    body: JSON.stringify({
      username,
      email,
      password,
    }),
    headers: {
      "Content-Type": "application/json",
    },
  });

  return NextResponse.json(response);
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

  console.log(response);

  if (response.ok) {
    redirect("/profile");
  }
}
