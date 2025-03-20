// working on the validations - Luis MPP

"use client";

import { useState, useEffect } from "react";
import { SignUp } from "@/app/actions/auth";

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

  const [passValidations, setPassValidations] = useState({
    mayus: "",
    numbers: "",
    symbols: "",
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

  useEffect(() => {
    if (password) {
      const isPassValidLength = password.length > 8;
      const isPassValidMayus = /[A-Z]+/.test(password);
      const isPassValidNumbers = /[0-9]+/.test(password);
      const isPassValidSymbols = /[!@#$%^&*()_+\-=\[\]{};':"\\|,.<>\/?]+/.test(
        password
      );

      setErrors((prev) => ({
        ...prev,
        password: isPassValidLength
          ? ""
          : "La contraseña debe ser mayor a 8 caracteres.",
      }));

      if (isPassValidLength) {
        setPassValidations((prev) => ({
          ...prev,
          mayus: isPassValidMayus ? "" : "Colocar mayusculas [A-Z].",
          numbers: isPassValidNumbers ? "" : "Colocar numeros [0-9].",
          symbols: isPassValidSymbols ? "" : "Colocar simbolos [@!#%].",
        }));
      }
    }
  }, [password]);

  useEffect(() => {
    if (confirmPassword) {
      setErrors((prev) => ({
        ...prev,
        confirmPassword:
          confirmPassword == password ? "" : "Las contraseñas no coinciden.",
      }));
    }
  }, [confirmPassword]);

  const handleBlur = (field: keyof TouchedFields) => {
    setTouched((prev) => ({ ...prev, [field]: true }));
  };

  const handleSubmit = async (formData: FormData) => {
    setTouched({
      username: true,
      email: true,
      password: true,
      confirmPassword: true,
    });

    if (Object.values(errors).some((error) => error != "")) {
      return;
    }

    const signUpSuccesfully = await SignUp(formData);

    if (signUpSuccesfully.status == 200) {
      alert("Registro exitoso");
    }
  };

  return (
    <div className="h-[calc(100vh-7rem)] flex justify-center items-center">
      <form action={handleSubmit} className="w-1/4">
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
            onChange={(e) => setPassword(e.target.value)}
            onBlur={() => handleBlur("password")}
            className="p-3 mb-2 rounded bg-slate-900 text-slate-300 w-full"
          />
          {touched.password && errors.password && (
            <p className="text-sm text-red-500">{errors.password}</p>
          )}
          {(passValidations.mayus ||
            passValidations.numbers ||
            passValidations.symbols) &&
            !errors.password && (
              <p className="text-red-500 text-sm">
                Puedes mejorar tu contraseña de la siguientes maneras:
              </p>
            )}
          <ul className="list-disc">
            {passValidations.mayus && !errors.password && (
              <li className="text-sm text-red-500">{passValidations.mayus}</li>
            )}
            {passValidations.numbers && !errors.password && (
              <li className="text-sm text-red-500">
                {passValidations.numbers}
              </li>
            )}
            {passValidations.symbols && !errors.password && (
              <li className="text-sm text-red-500">
                {passValidations.symbols}
              </li>
            )}
          </ul>
        </div>
        <div>
          <label htmlFor="confirmPassword" className="text-white mb-2 text-sm ">
            Confirm Password
          </label>
          <input
            id="confirmPassword"
            name="confirmPassword"
            onChange={(e) => setConfirmPassword(e.target.value)}
            onBlur={() => handleBlur("confirmPassword")}
            className="p-3 mb-2 rounded bg-slate-900 text-slate-300 w-full"
          />
          {touched.confirmPassword && errors.confirmPassword && (
            <p className="text-sm text-red-500">{errors.confirmPassword}</p>
          )}
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
