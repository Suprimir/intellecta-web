"use client";

import { useState, useEffect } from "react";
import { SignUp } from "@/actions/auth";
import { useAlert } from "@/libs/context/AlertContext";

interface TouchedFields {
  name: boolean;
  lastname: boolean;
  username: boolean;
  email: boolean;
  password: boolean;
  confirmPassword: boolean;
}

export default function RegisterPage() {
  const { showAlert } = useAlert();
  const [name, setName] = useState("");
  const [lastname, setLastname] = useState("");
  const [username, setUsername] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");

  const [touched, setTouched] = useState<TouchedFields>({
    name: false,
    lastname: false,
    username: false,
    email: false,
    password: false,
    confirmPassword: false,
  });

  const [errors, setErrors] = useState({
    name: false,
    lastname: false,
    username: false,
    email: false,
    password: false,
    confirmPassword: false,
  });

  useEffect(() => {
    setErrors((prev) => ({
      ...prev,
      name: name.length <= 0,
    }));
  }, [name]);

  useEffect(() => {
    setErrors((prev) => ({
      ...prev,
      lastname: lastname.length <= 0,
    }));
  }, [lastname]);

  useEffect(() => {
    setErrors((prev) => ({
      ...prev,
      username: username.length <= 8,
    }));
  }, [username]);

  useEffect(() => {
    setErrors((prev) => ({
      ...prev,
      email: !/\S+[@]+\S+[.]+\S+/.test(email),
    }));
  }, [email]);

  useEffect(() => {
    setErrors((prev) => ({
      ...prev,
      password: password.length <= 8,
    }));
  }, [password]);

  useEffect(() => {
    setErrors((prev) => ({
      ...prev,
      confirmPassword: password !== confirmPassword,
    }));
  }, [confirmPassword, password]);

  const handleBlur = (field: keyof TouchedFields) => {
    setTouched((prev) => ({ ...prev, [field]: true }));
  };

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    setTouched({
      name: true,
      lastname: true,
      username: true,
      email: true,
      password: true,
      confirmPassword: true,
    });

    const validationErrors = {
      name: name.length <= 0,
      lastname: lastname.length <= 0,
      username: username.length <= 8,
      email: !/\S+[@]+\S+[.]+\S+/.test(email),
      password: password.length <= 8,
      confirmPassword: password !== confirmPassword,
    };

    setErrors(validationErrors);

    const formData = new FormData(e.currentTarget);
    const signUpSuccessfully = await SignUp(formData);
    const data = await signUpSuccessfully.json();

    if (signUpSuccessfully.status === 200) {
      showAlert(
        "Verifica tu correo electronico.",
        "success",
        "Registro exitoso",
        5000
      );
    } else {
      showAlert(data[0].message, "error", "Error", 5000);
    }
  };

  const getInputBorderClass = (fieldName: keyof typeof errors) => {
    return touched[fieldName as keyof TouchedFields] && errors[fieldName]
      ? "border-red-500 focus:ring-red-300"
      : "border-gray-300 focus:ring-yellow-400";
  };

  return (
    <main className="min-h-screen flex items-center justify-center bg-gradient-to-br from-yellow-300 to-yellow-500 px-4">
      <div className="w-full max-w-md bg-white rounded-2xl shadow-xl p-8 space-y-6">
        <div className="text-center">
          <h1 className="text-3xl font-bold text-gray-800">Crea tu cuenta</h1>
          <p className="text-gray-500 text-sm">
            Únete a Intellecta y accede a todos los cursos
          </p>
        </div>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="flex gap-3">
            <div className="w-1/2">
              <label
                htmlFor="name"
                className="block text-sm font-medium text-gray-700"
              >
                Nombre
              </label>
              <input
                id="name"
                name="name"
                type="text"
                value={name}
                onChange={(e) => setName(e.target.value)}
                onBlur={() => handleBlur("name")}
                className={`mt-1 w-full px-4 py-2 border rounded-lg shadow-sm focus:outline-none focus:ring-2 ${getInputBorderClass(
                  "name"
                )}`}
              />
            </div>
            <div className="w-1/2">
              <label
                htmlFor="last_name"
                className="block text-sm font-medium text-gray-700"
              >
                Apellido
              </label>
              <input
                id="lastname"
                name="lastname"
                type="text"
                value={lastname}
                onChange={(e) => setLastname(e.target.value)}
                onBlur={() => handleBlur("lastname")}
                className={`mt-1 w-full px-4 py-2 border rounded-lg shadow-sm focus:outline-none focus:ring-2 ${getInputBorderClass(
                  "lastname"
                )}`}
              />
            </div>
          </div>

          <div>
            <label
              htmlFor="username"
              className="block text-sm font-medium text-gray-700"
            >
              Nombre de usuario
            </label>
            <input
              id="username"
              name="username"
              type="text"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              onBlur={() => handleBlur("username")}
              className={`mt-1 w-full px-4 py-2 border rounded-lg shadow-sm focus:outline-none focus:ring-2 ${getInputBorderClass(
                "username"
              )}`}
            />
          </div>

          <div>
            <label
              htmlFor="email"
              className="block text-sm font-medium text-gray-700"
            >
              Correo electrónico
            </label>
            <input
              id="email"
              name="email"
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              onBlur={() => handleBlur("email")}
              className={`mt-1 w-full px-4 py-2 border rounded-lg shadow-sm focus:outline-none focus:ring-2 ${getInputBorderClass(
                "email"
              )}`}
            />
          </div>

          <div>
            <label
              htmlFor="password"
              className="block text-sm font-medium text-gray-700"
            >
              Contraseña
            </label>
            <input
              id="password"
              name="password"
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              onBlur={() => handleBlur("password")}
              className={`mt-1 w-full px-4 py-2 border rounded-lg shadow-sm focus:outline-none focus:ring-2 ${getInputBorderClass(
                "password"
              )}`}
            />
          </div>

          <div>
            <label
              htmlFor="confirmPassword"
              className="block text-sm font-medium text-gray-700"
            >
              Confirmar contraseña
            </label>
            <input
              id="confirmPassword"
              name="confirmPassword"
              type="password"
              value={confirmPassword}
              onChange={(e) => setConfirmPassword(e.target.value)}
              onBlur={() => handleBlur("confirmPassword")}
              className={`mt-1 w-full px-4 py-2 border rounded-lg shadow-sm focus:outline-none focus:ring-2 ${getInputBorderClass(
                "confirmPassword"
              )}`}
            />
          </div>

          <button
            type="submit"
            className="w-full bg-yellow-500 hover:bg-yellow-600 text-white font-semibold py-2 px-4 rounded-lg shadow transition"
          >
            Registrarse
          </button>
        </form>

        <div className="text-center text-sm text-gray-600">
          ¿Ya tienes cuenta?{" "}
          <a href="/auth/login" className="text-yellow-600 hover:underline">
            Inicia sesión
          </a>
        </div>
      </div>
    </main>
  );
}
