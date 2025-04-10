"use server";

import { NextRequest } from "next/server";
import { verifyAuth } from "@/libs/auth";

export async function validatePermissions(
  request: NextRequest,
  onlyAdmin: boolean
) {
  const user = await verifyAuth(request);
  const { rol } = await user.json();

  if (onlyAdmin) {
    if (rol === "admin") {
      return true;
    } else {
      return false;
    }
  } else {
    if (rol === "admin" || rol === "instructor") {
      return true;
    } else {
      return false;
    }
  }
}
