"use client";

import { useSearchParams } from "next/navigation";
import { useState, useEffect } from "react";

export default function ResetPasswordPage() {
  const searchParams = useSearchParams();
  const token = searchParams.get("token");

  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
  const [touched, setTouched] = useState(false);

  useEffect(() => {
    if (password && confirmPassword && touched) {
      if (password.length < 6) {
        setError("La contraseña debe tener al menos 6 caracteres.");
      } else if (password !== confirmPassword) {
        setError("Las contraseñas no coinciden.");
      } else {
        setError("");
      }
    }
  }, [password, confirmPassword, touched]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setTouched(true);

    if (!token) {
      setError("Token inválido o expirado.");
      return;
    }

    if (error || !password || !confirmPassword) return;

    const res = await fetch("/api/auth/reset-password", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        token,
        newPassword: password,
      }),
    });

    const data = await res.json();

    if (!res.ok) {
      setError(data.message || "Hubo un error al cambiar la contraseña.");
    } else {
      setSuccess("¡Contraseña actualizada con éxito!");
      setPassword("");
      setConfirmPassword("");
    }
  };

  return (
    <main className="min-h-screen flex items-center justify-center bg-gradient-to-br from-yellow-300 to-yellow-500 px-4">
      <div className="w-full max-w-md bg-white rounded-2xl shadow-xl p-8 space-y-6">
        <div className="text-center">
          <h1 className="text-3xl font-bold text-gray-800">
            Cambiar contraseña
          </h1>
          <p className="text-gray-500 text-sm">
            Ingresa una nueva contraseña para tu cuenta.
          </p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label
              htmlFor="password"
              className="block text-sm font-medium text-gray-700"
            >
              Nueva contraseña
            </label>
            <input
              id="password"
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              onBlur={() => setTouched(true)}
              className="mt-1 w-full px-4 py-2 border border-gray-300 rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-yellow-400"
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
              type="password"
              value={confirmPassword}
              onChange={(e) => setConfirmPassword(e.target.value)}
              onBlur={() => setTouched(true)}
              className="mt-1 w-full px-4 py-2 border border-gray-300 rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-yellow-400"
            />
          </div>

          {touched && error && (
            <p className="text-red-500 text-sm mt-1">{error}</p>
          )}

          {success && (
            <p className="text-green-600 font-medium text-sm mt-1">{success}</p>
          )}

          <button
            type="submit"
            className="w-full bg-yellow-500 hover:bg-yellow-600 text-white font-semibold py-2 px-4 rounded-lg shadow transition"
          >
            Cambiar contraseña
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
