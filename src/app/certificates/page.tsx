"use client";

import Image from "next/image";
import { CheckBadgeIcon } from "@heroicons/react/24/solid";
import Button from "@/components/common/Button";
import { useRouter } from "next/navigation";

export default function CertificatesPage() {
  const router = useRouter();
  return (
    <main className="w-full bg-gray-50 py-16 px-4">
      <div className="max-w-7xl mx-auto space-y-16">
        {/* Encabezado */}
        <section className="text-center space-y-6">
          <h1 className="text-4xl md:text-5xl font-bold text-gray-800">
            Certificados de Estudio INTELLECTA
          </h1>
          <p className="text-lg text-gray-600 max-w-3xl mx-auto">
            Todos nuestros cursos incluyen un certificado oficial que puedes
            usar para mejorar tu CV, compartir en redes profesionales como
            LinkedIn, y demostrar tus competencias ante el mundo laboral.
          </p>
        </section>

        {/* Contenido principal */}
        <section className="grid md:grid-cols-2 gap-12 items-center">
          {/* Imagen */}
          <div className="relative w-full h-72 md:h-96">
            <Image
              src="/mainPageImage3.webp"
              alt="Certificado de ejemplo"
              fill
              className="object-contain rounded-xl shadow-lg"
              priority
            />
          </div>

          {/* Detalles */}
          <div className="space-y-6">
            <h2 className="text-2xl font-semibold text-gray-800">
              ¿Qué incluye tu certificado?
            </h2>
            <ul className="space-y-4">
              <li className="flex items-start gap-3">
                <CheckBadgeIcon className="h-6 w-6 text-green-500 mt-1" />
                <span className="text-gray-700">
                  Nombre del curso y duración en horas.
                </span>
              </li>
              <li className="flex items-start gap-3">
                <CheckBadgeIcon className="h-6 w-6 text-green-500 mt-1" />
                <span className="text-gray-700">
                  Tu nombre completo como participante.
                </span>
              </li>
              <li className="flex items-start gap-3">
                <CheckBadgeIcon className="h-6 w-6 text-green-500 mt-1" />
                <span className="text-gray-700">
                  Fecha de finalización y firma institucional.
                </span>
              </li>
              <li className="flex items-start gap-3">
                <CheckBadgeIcon className="h-6 w-6 text-green-500 mt-1" />
                <span className="text-gray-700">
                  Código único de verificación en línea.
                </span>
              </li>
            </ul>
          </div>
        </section>

        {/* CTA */}
        <section className="text-center space-y-6">
          <h3 className="text-2xl md:text-3xl font-bold text-teal-700">
            Empieza hoy y obtén tu certificado
          </h3>
          <Button
            onClick={() => router.push("/courses")}
            text="Ver todos los cursos"
            className="bg-teal-600 hover:bg-teal-700 text-white px-6 py-3 rounded-lg font-medium text-lg transition-all"
          />
          <p className="text-sm text-gray-500">Acceso gratuito para siempre</p>
        </section>
      </div>
    </main>
  );
}
