// working on the validations - Luis MPP

"use client";

import { useState, useEffect } from "react";
import { LogIn } from "@/actions/auth";
import { useAlert } from "@/libs/context/AlertContext";
import { useRouter } from "next/navigation";

interface TouchedFields {
  username: boolean;
  password: boolean;
}

export default function LoginPage() {
  const router = useRouter();
  const { showAlert } = useAlert();

  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [loadingLogin, setLoadingLogin] = useState(false);

  const [touched, setTouched] = useState<TouchedFields>({
    username: false,
    password: false,
  });

  const [errors, setErrors] = useState({
    username: false,
    password: false,
  });

  useEffect(() => {
    setErrors((prev) => ({
      ...prev,
      username: username.length <= 0,
    }));
  }, [username]);

  useEffect(() => {
    setErrors((prev) => ({
      ...prev,
      password: password.length <= 0,
    }));
  }, [password]);

  const handleBlur = (field: keyof TouchedFields) => {
    setTouched((prev) => ({ ...prev, [field]: true }));
  };

  const handleSubmit = async (formData: FormData) => {
    setLoadingLogin(true);

    setTouched({
      username: true,
      password: true,
    });

    const validationErrors = {
      username: username.length <= 0,
      password: password.length <= 0,
    };

    setErrors(validationErrors);

    const loggedIn = await LogIn(formData);
    const data = await loggedIn.json();

    if (loggedIn.status === 200) {
      router.push("/dashboard");
      setLoadingLogin(false);
    } else {
      showAlert(data.message, "error", "Error");
      setLoadingLogin(false);
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
          <h1 className="text-3xl font-bold text-gray-800">
            Bienvenido a Intellecta
          </h1>
          <p className="text-gray-500 text-sm">
            Inicia sesión para acceder a tus cursos
          </p>
        </div>

        <form action={handleSubmit} className="space-y-5">
          <div>
            <label
              htmlFor="username"
              className="block text-sm font-medium text-gray-700"
            >
              Usuario
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
              placeholder="ej: esotilin123"
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
              placeholder="••••••••"
            />
          </div>

          <div className="flex justify-between items-center text-sm">
            <span className="text-gray-600">
              ¿No tienes cuenta?{" "}
              <a
                href="/auth/register"
                className="text-yellow-600 hover:underline"
              >
                Regístrate
              </a>
            </span>
            <a
              href="/auth/forgot-password"
              className="text-yellow-600 hover:underline"
            >
              ¿Olvidaste tu contraseña?
            </a>
          </div>

          <button
            type="submit"
            className="w-full bg-yellow-500 hover:bg-yellow-600 text-white font-semibold py-2 px-4 rounded-lg shadow transition"
          >
            Iniciar sesión
          </button>
        </form>
      </div>
    </main>
  );
}
