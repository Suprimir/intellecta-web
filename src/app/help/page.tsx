// app/help/page.tsx

"use client";

import { useState } from "react";

export default function HelpCenterPage() {
  const [form, setForm] = useState({
    name: "",
    email: "",
    subject: "",
    message: "",
  });
  const [submitted, setSubmitted] = useState(false);

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    // Aquí podrías hacer una llamada a tu API para registrar el ticket
    // Ejemplo: await fetch("/api/support-ticket", { method: "POST", body: JSON.stringify(form) });
    setSubmitted(true);
  };

  return (
    <main className="min-h-screen bg-gray-50 px-4 py-12">
      <div className="max-w-3xl mx-auto">
        <h1 className="text-4xl font-bold text-center text-gray-800 mb-4">
          Centro de Ayuda INTELLECTA
        </h1>
        <p className="text-center text-gray-600 mb-12">
          ¿Tienes problemas o preguntas? Envíanos un ticket y nuestro equipo de
          soporte te ayudará lo antes posible.
        </p>

        {!submitted ? (
          <form
            onSubmit={handleSubmit}
            className="bg-white p-8 rounded-xl shadow space-y-6"
          >
            <div>
              <label
                htmlFor="name"
                className="block font-medium text-gray-700 mb-1"
              >
                Nombre
              </label>
              <input
                type="text"
                id="name"
                name="name"
                required
                className="w-full border rounded px-4 py-2 focus:outline-none focus:ring-2 focus:ring-teal-500"
                value={form.name}
                onChange={handleChange}
              />
            </div>

            <div>
              <label
                htmlFor="email"
                className="block font-medium text-gray-700 mb-1"
              >
                Correo electrónico
              </label>
              <input
                type="email"
                id="email"
                name="email"
                required
                className="w-full border rounded px-4 py-2 focus:outline-none focus:ring-2 focus:ring-teal-500"
                value={form.email}
                onChange={handleChange}
              />
            </div>

            <div>
              <label
                htmlFor="subject"
                className="block font-medium text-gray-700 mb-1"
              >
                Asunto
              </label>
              <input
                type="text"
                id="subject"
                name="subject"
                required
                className="w-full border rounded px-4 py-2 focus:outline-none focus:ring-2 focus:ring-teal-500"
                value={form.subject}
                onChange={handleChange}
              />
            </div>

            <div>
              <label
                htmlFor="message"
                className="block font-medium text-gray-700 mb-1"
              >
                Mensaje
              </label>
              <textarea
                id="message"
                name="message"
                rows={5}
                required
                className="w-full border rounded px-4 py-2 focus:outline-none focus:ring-2 focus:ring-teal-500"
                value={form.message}
                onChange={handleChange}
              />
            </div>

            <button
              type="submit"
              className="w-full bg-teal-600 hover:bg-teal-700 text-white font-medium py-3 rounded transition"
            >
              Enviar ticket
            </button>
          </form>
        ) : (
          <div className="bg-white p-8 rounded-xl shadow text-center space-y-4">
            <h2 className="text-2xl font-bold text-green-600">
              ¡Ticket enviado con éxito!
            </h2>
            <p className="text-gray-700">
              Nuestro equipo se pondrá en contacto contigo pronto.
            </p>
          </div>
        )}
      </div>
    </main>
  );
}
