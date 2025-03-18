// working on the validations - Luis MPP

"use client";

import { useState, useEffect } from "react";
import { SignUpValidation } from "@/app/actions/auth";

interface TouchedFields {
  username: boolean;
  email: boolean;
  password: boolean;
  confirmPassword: boolean;
}

export default function RegisterPage() {
  const [username, setUsername] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");

  const [touched, setTouched] = useState({
    username: false,
    email: false,
    password: false,
    confirmPassword: false,
  });

  const [errors, setErrors] = useState({
    username: "",
    email: "",
    password: "",
    confirmPassword: "",
  });

  useEffect(() => {
    if (username) {
      setErrors((prev) => ({
        ...prev,
        username:
          username.length > 3
            ? ""
            : "El usuario debe tener mas de 3 caracteres.",
      }));
    }
  }, [username]);

  useEffect(() => {
    if (email) {
      const isEmailValid = /\S+[@]+\S+[.]+\S+/.test(email);
      setErrors((prev) => ({
        ...prev,
        email: isEmailValid ? "" : "El email es invalido.",
      }));
    }
  }, [email]);

  const handleBlur = (field: keyof TouchedFields) => {
    setTouched((prev) => ({ ...prev, [field]: true }));
  };

  return (
    <div className="h-[calc(100vh-7rem)] flex justify-center items-center">
      <form action={SignUpValidation} className="w-1/4">
        <h1 className="font-bold text-slate-300 text-4xl mb-4 text-center">
          Register
        </h1>
        <div>
          <label htmlFor="username" className="text-white mb-2 text-sm ">
            Username
          </label>
          <input
            id="username"
            name="username"
            type="text"
            onChange={(e) => setUsername(e.target.value)}
            onBlur={() => handleBlur("username")}
            className="p-3 mb-2 rounded bg-slate-900 text-slate-300 w-full"
          />
          {touched.username && errors.username && (
            <p className="text-sm text-red-500">{errors.username}</p>
          )}
        </div>
        <div>
          <label htmlFor="email" className="text-white mb-2 text-sm ">
            Email
          </label>
          <input
            id="email"
            name="email"
            type="email"
            onChange={(e) => setEmail(e.target.value)}
            onBlur={() => handleBlur("email")}
            className="p-3 mb-2 rounded bg-slate-900 text-slate-300 w-full"
          />
          {touched.email && errors.email && (
            <p className="text-sm text-red-500">{errors.email}</p>
          )}
        </div>
        <div>
          <label htmlFor="password" className="text-white mb-2 text-sm ">
            Password
          </label>
          <input
            id="password"
            name="password"
            type="password"
            className="p-3 mb-2 rounded bg-slate-900 text-slate-300 w-full"
          />
        </div>
        <div>
          <label htmlFor="confirmPassword" className="text-white mb-2 text-sm ">
            Confirm Password
          </label>
          <input
            id="confirmPassword"
            name="confirmPassword"
            type="password"
            className="p-3 mb-2 rounded bg-slate-900 text-slate-300 w-full"
          />
        </div>
        <button
          type="submit"
          className="bg-blue-500 text-white p-3 my-4 w-full rounded-lg font-bold"
        >
          Register
        </button>
      </form>
    </div>
  );
}
