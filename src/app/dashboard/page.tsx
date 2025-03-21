"use client";

import { headers } from "next/headers";
import { redirect } from "next/navigation";
import { useState } from "react";

export default function DashboardPage() {
  const [user, setUser] = useState({
    uuid: "",
    username: "",
    email: "",
  });

  const getProfile = async () => {
    const response = await fetch("/api/profile");
    const data = await response.json();
    setUser({
      uuid: data.uuid || "",
      username: data.username || "",
      email: data.email || "",
    });
    console.log(user);
  };

  const logout = async () => {
    const response = await fetch("/api/auth/logout", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
    });
    redirect("/auth/login");
  };

  return (
    <>
      <div>
        <h1>Dashboard</h1>
        <pre>{JSON.stringify(user, null, 2)}</pre>

        <button className="bg-red-500" onClick={getProfile}>
          get profile
        </button>
        <button className="bg-red-500" onClick={logout}>
          logout
        </button>
      </div>
    </>
  );
}
