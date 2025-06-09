"use client";

import { useState, useEffect } from "react";
import {
  User,
  BookOpen,
  Award,
  FileText,
  Upload,
  CheckCircle,
} from "lucide-react";
import { useAlert } from "@/libs/context/AlertContext";

interface TouchedFields {
  experience: boolean;
  specialties: boolean;
}

export default function ApplyPage() {
  const [formData, setFormData] = useState({
    experience: "",
    specialties: "",
  });

  const [loadingSubmit, setLoadingSubmit] = useState(false);
  const [loading, setLoading] = useState(true);
  const [submitted, setSubmitted] = useState(false);
  const { showAlert } = useAlert();

  const [touched, setTouched] = useState<TouchedFields>({
    experience: false,
    specialties: false,
  });

  const [errors, setErrors] = useState({
    experience: false,
    specialties: false,
    bio: false,
    cv: false,
  });

  useEffect(() => {
    const loadInitialData = async () => {
      try {
        const res = await fetch(`/api/applications/byUUID/`);

        if (res.ok) {
          setSubmitted(true);
        }
      } catch (err) {
        console.error("Error al inciar los datos:", err);
      } finally {
        setLoading(false);
      }
    };
    loadInitialData();
  }, []);

  useEffect(() => {
    setErrors((prev) => ({
      ...prev,
      experience: formData.experience.length <= 10,
      specialties: formData.specialties.length <= 5,
    }));
  }, [formData]);

  const handleInputChange = (field: keyof typeof formData, value: string) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
  };

  const handleBlur = (field: keyof TouchedFields) => {
    setTouched((prev) => ({ ...prev, [field]: true }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoadingSubmit(true);

    const allTouched = Object.keys(touched).reduce((acc, key) => {
      acc[key as keyof TouchedFields] = true;
      return acc;
    }, {} as TouchedFields);

    setTouched(allTouched);

    const res = await fetch("/api/applications/", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(formData),
    });

    if (!res.ok) {
      showAlert(
        "Error al enviar la aplicación. Por favor, inténtalo de nuevo más tarde.",
        "error",
        "Error",
        3000
      );
      setLoadingSubmit(false);
    } else {
      showAlert(
        "¡Aplicación enviada exitosamente! Te contactaremos pronto.",
        "success",
        "Éxito",
        3000
      );
      setLoadingSubmit(false);
      setSubmitted(true);
    }
  };

  const getInputBorderClass = (fieldName: keyof typeof errors) => {
    return touched[fieldName as keyof TouchedFields] && errors[fieldName]
      ? "border-red-500 focus:ring-red-300"
      : "border-gray-300 focus:ring-yellow-400";
  };

  if (loading) {
    return (
      <main className="min-h-screen flex items-center justify-center bg-gradient-to-br from-yellow-300 to-yellow-500 px-4">
        <div className="w-full max-w-md bg-white rounded-2xl shadow-xl p-8 text-center">
          <div className="animate-spin rounded-full h-16 w-16 border-4 border-yellow-500 border-t-transparent mx-auto mb-4"></div>
          <h1 className="text-xl font-semibold text-gray-800">
            Cargando aplicación...
          </h1>
        </div>
      </main>
    );
  }

  if (submitted) {
    return (
      <main className="min-h-screen flex items-center justify-center bg-gradient-to-br from-yellow-300 to-yellow-500 px-4">
        <div className="w-full max-w-md bg-white rounded-2xl shadow-xl p-8 text-center space-y-6">
          <div className="flex justify-center">
            <CheckCircle className="size-16 text-green-500" />
          </div>
          <div>
            <h1 className="text-3xl font-bold text-gray-800 mb-2">
              ¡Aplicación Enviada!
            </h1>
            <p className="text-gray-600">
              Hemos recibido tu solicitud para ser instructor. Te contactaremos
              pronto para continuar con el proceso.
            </p>
          </div>
        </div>
      </main>
    );
  }

  return (
    <main className="min-h-screen bg-gradient-to-br from-yellow-300 to-yellow-500 px-4 py-8">
      <div className="mt-16 max-w-3xl mx-auto bg-white rounded-2xl shadow-xl p-8 space-y-6">
        <div className="text-center">
          <Award className="size-8 text-yellow-500 mx-auto mb-4" />
          <h1 className="text-2xl font-bold text-gray-800">
            Únete como Instructor
          </h1>
          <p className="text-gray-500 text-sm">
            Comparte tu conocimiento y ayuda a otros a aprender
          </p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="bg-gray-50 p-6 rounded-lg space-y-4">
            <h3 className="text-md font-semibold text-gray-800 flex items-center gap-2">
              <BookOpen className="size-4" />
              Experiencia Profesional
            </h3>

            <div>
              <label
                htmlFor="experience"
                className="block text-sm font-medium text-gray-700"
              >
                Experiencia Profesional *
              </label>
              <textarea
                id="experience"
                name="experience"
                rows={4}
                value={formData.experience}
                onChange={(e) =>
                  handleInputChange("experience", e.target.value)
                }
                onBlur={() => handleBlur("experience")}
                className={`resize-none mt-1 w-full px-4 py-2 border rounded-lg shadow-sm focus:outline-none focus:ring-2 ${getInputBorderClass(
                  "experience"
                )}`}
                placeholder="Describe tu experiencia profesional, años trabajando en el área, empresas donde has laborado, etc."
              />
            </div>

            <div>
              <label
                htmlFor="specialties"
                className="block text-sm font-medium text-gray-700"
              >
                Especialidades y Habilidades *
              </label>
              <input
                id="specialties"
                name="specialties"
                type="text"
                value={formData.specialties}
                onChange={(e) =>
                  handleInputChange("specialties", e.target.value)
                }
                onBlur={() => handleBlur("specialties")}
                className={`mt-1 w-full px-4 py-2 border rounded-lg shadow-sm focus:outline-none focus:ring-2 ${getInputBorderClass(
                  "specialties"
                )}`}
                placeholder="JavaScript, React, Python, Marketing Digital, etc."
              />
            </div>
          </div>

          <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4">
            <p className="text-sm text-yellow-800">
              <strong>Nota:</strong> Una vez enviada tu aplicación, nuestro
              equipo la revisará en un plazo de 3-5 días hábiles. Te
              contactaremos por correo electrónico con los siguientes pasos.
            </p>
          </div>

          <button
            type="submit"
            disabled={loadingSubmit}
            className="w-full bg-yellow-500 hover:bg-yellow-600 disabled:bg-yellow-400 text-white font-semibold py-3 px-4 rounded-lg shadow transition flex items-center justify-center gap-2"
          >
            {loadingSubmit ? (
              <>
                <div className="animate-spin rounded-full h-4 w-4 border-2 border-white border-t-transparent"></div>
                Enviando aplicación...
              </>
            ) : (
              "Enviar Aplicación"
            )}
          </button>
        </form>
      </div>
    </main>
  );
}
