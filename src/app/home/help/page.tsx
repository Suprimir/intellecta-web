"use client";

import { useState } from "react";

export default function HelpCenterPage() {
  const [submitted, setSubmitted] = useState(false);
  const [loading, setLoading] = useState(false);

  const problemCategories = [
    { value: "technical", label: "Técnico" },
    { value: "functional", label: "Funcional" },
    { value: "bug", label: "Error/Bug" },
    { value: "other category", label: "Otra categoría" },
  ];

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setLoading(true);

    const formData = new FormData(e.currentTarget);

    try {
      const response = await fetch("/api/support-tickets", {
        method: "POST",
        body: formData,
      });

      if (response.ok) {
        setSubmitted(true);
      } else {
        throw new Error("Error al enviar el ticket");
      }
    } catch (error) {
      console.error("Error:", error);
      alert(
        "Hubo un error al enviar el ticket. Por favor, inténtalo de nuevo."
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <main className="min-h-screen bg-gray-50 px-4 py-12">
      <div className="max-w-3xl mx-auto">
        <h1 className="text-4xl font-bold text-center text-gray-800 mb-4">
          Centro de Ayuda INTELLECTA
        </h1>
        <p className="text-center text-gray-600 mb-12">
          ¿Tienes problemas o preguntas? Envíanos un ticket de soporte y nuestro
          equipo te ayudará lo antes posible.
        </p>

        {!submitted ? (
          <form
            onSubmit={handleSubmit}
            className="bg-white p-8 rounded-xl shadow space-y-6"
          >
            <div>
              <label
                htmlFor="problem_Category"
                className="block font-medium text-gray-700 mb-2"
              >
                Categoría del problema *
              </label>
              <select
                id="problem_Category"
                name="problem_Category"
                required
                className="w-full border border-gray-300 rounded-lg px-4 py-3 focus:outline-none focus:ring-2 focus:ring-teal-500 focus:border-transparent"
              >
                <option value="">Selecciona una categoría</option>
                {problemCategories.map((category) => (
                  <option key={category.value} value={category.value}>
                    {category.label}
                  </option>
                ))}
              </select>
            </div>

            <div>
              <label
                htmlFor="description"
                className="block font-medium text-gray-700 mb-2"
              >
                Descripción del problema *
              </label>
              <textarea
                id="description"
                name="description"
                rows={8}
                required
                placeholder="Describe detalladamente el problema que estás experimentando..."
                className="resize-none w-full border border-gray-300 rounded-lg px-4 py-3 focus:outline-none focus:ring-2 focus:ring-teal-500 focus:border-transparent resize-vertical"
              />
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full bg-teal-600 hover:bg-teal-700 disabled:bg-teal-400 disabled:cursor-not-allowed text-white font-medium py-3 rounded-lg transition duration-200 flex items-center justify-center"
            >
              {loading ? (
                <>
                  <svg
                    className="animate-spin -ml-1 mr-3 h-5 w-5 text-white"
                    xmlns="http://www.w3.org/2000/svg"
                    fill="none"
                    viewBox="0 0 24 24"
                  >
                    <circle
                      className="opacity-25"
                      cx="12"
                      cy="12"
                      r="10"
                      stroke="currentColor"
                      strokeWidth="4"
                    ></circle>
                    <path
                      className="opacity-75"
                      fill="currentColor"
                      d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                    ></path>
                  </svg>
                  Enviando...
                </>
              ) : (
                "Enviar ticket de soporte"
              )}
            </button>
          </form>
        ) : (
          <div className="bg-white p-8 rounded-xl shadow text-center space-y-6">
            <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto">
              <svg
                className="w-8 h-8 text-green-600"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth="2"
                  d="M5 13l4 4L19 7"
                ></path>
              </svg>
            </div>
            <h2 className="text-2xl font-bold text-green-600">
              ¡Ticket enviado con éxito!
            </h2>
            <p className="text-gray-700">
              Tu ticket de soporte ha sido registrado correctamente. Nuestro
              equipo revisará tu solicitud y se pondrá en contacto contigo
              pronto.
            </p>
            <p className="text-sm text-gray-500">
              Recibirás actualizaciones sobre el estado de tu ticket por correo
              electrónico.
            </p>
            <button
              onClick={() => setSubmitted(false)}
              className="bg-teal-600 hover:bg-teal-700 text-white font-medium py-2 px-6 rounded-lg transition duration-200"
            >
              Enviar otro ticket
            </button>
          </div>
        )}
      </div>
    </main>
  );
}
