"use client";

import { useState, useEffect } from "react";

export default function ForgotPasswordPage() {
  const [email, setEmail] = useState("");
  const [touched, setTouched] = useState(false);
  const [error, setError] = useState("");

  useEffect(() => {
    if (email) {
      const isValid = /\S+@\S+\.\S+/.test(email);
      setError(isValid ? "" : "El email es inválido.");
    }
  }, [email]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setTouched(true);

    if (error || !email) return;

    const res = await fetch("/api/auth/forgot-password", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        email: email,
      }),
    });

    const data = res.json();
    console.log(data);
  };

  return (
    <main className="min-h-screen flex items-center justify-center bg-gradient-to-br from-yellow-300 to-yellow-500 px-4">
      <div className="w-full max-w-md bg-white rounded-2xl shadow-xl p-8 space-y-6">
        <div className="text-center">
          <h1 className="text-3xl font-bold text-gray-800">
            ¿Olvidaste tu contraseña?
          </h1>
          <p className="text-gray-500 text-sm">
            Ingresa tu correo electrónico y te enviaremos instrucciones para
            recuperarla.
          </p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label
              htmlFor="email"
              className="block text-sm font-medium text-gray-700"
            >
              Correo electrónico
            </label>
            <input
              id="email"
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              onBlur={() => setTouched(true)}
              className="mt-1 w-full px-4 py-2 border border-gray-300 rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-yellow-400"
            />
            {touched && error && (
              <p className="text-red-500 text-sm mt-1">{error}</p>
            )}
          </div>

          <button
            type="submit"
            className="w-full bg-yellow-500 hover:bg-yellow-600 text-white font-semibold py-2 px-4 rounded-lg shadow transition"
          >
            Recuperar contraseña
          </button>
        </form>

        <div className="text-center text-sm text-gray-600">
          ¿Ya la recordaste nigga?{" "}
          <a href="/auth/login" className="text-yellow-600 hover:underline">
            Inicia sesión
          </a>
        </div>
      </div>
    </main>
  );
}
