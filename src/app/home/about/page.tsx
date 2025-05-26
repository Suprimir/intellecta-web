// AboutSection.jsx
import React from "react";
import Image from "next/image";

const AboutSection = () => {
  return (
    <section className="bg-slate-200 py-12 md:py-16 lg:py-20">
      {/* Contenedor principal */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Encabezado */}
        <div className="text-center mb-8 md:mb-12">
          <h2 className="text-3xl md:text-4xl font-bold text-gray-900">
            Sobre <span className="text-[#31B2A5]">Nosotros</span>
          </h2>
          <div className="w-20 h-1 bg-[#0D7682] mx-auto mt-4"></div>
        </div>

        {/* Grid para contenido principal */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 md:gap-12 items-center">
          {/* Columna de imagen */}
          <div className="rounded-lg overflow-hidden shadow-xl">
            <div className="relative h-64 sm:h-80 md:h-96">
              <Image
                src="/aboutPageImage.webp"
                alt="Estudiantes aprendiendo"
                layout="fill"
                objectFit="cover"
                className="rounded-lg"
              />
            </div>
          </div>

          {/* Columna de texto */}
          <div className="space-y-6">
            <h3 className="text-2xl md:text-3xl font-semibold text-gray-800">
              Transformando el aprendizaje para todos
            </h3>

            <p className="text-gray-600 text-base md:text-lg">
              En{" "}
              <span className="font-semibold text-[#0D7682]">Intellecta</span>,
              creemos que el conocimiento debe ser accesible para todos. Nuestra
              misión es proporcionar educación de calidad a través de cursos
              online diseñados por expertos en cada área.
            </p>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-2">
              <div className="flex items-start">
                <div className="flex-shrink-0">
                  <div className="flex items-center justify-center h-10 w-10 rounded-md bg-[#31B2A5] text-white">
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      className="h-6 w-6"
                      fill="none"
                      viewBox="0 0 24 24"
                      stroke="currentColor"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"
                      />
                    </svg>
                  </div>
                </div>
                <div className="ml-4">
                  <h4 className="text-lg font-medium text-gray-900">
                    Cursos de calidad
                  </h4>
                  <p className="mt-1 text-sm text-gray-500">
                    Contenido actualizado y de alto nivel académico
                  </p>
                </div>
              </div>

              <div className="flex items-start">
                <div className="flex-shrink-0">
                  <div className="flex items-center justify-center h-10 w-10 rounded-md bg-[#31B2A5] text-white">
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      className="h-6 w-6"
                      fill="none"
                      viewBox="0 0 24 24"
                      stroke="currentColor"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z"
                      />
                    </svg>
                  </div>
                </div>
                <div className="ml-4">
                  <h4 className="text-lg font-medium text-gray-900">
                    Aprende a tu ritmo
                  </h4>
                  <p className="mt-1 text-sm text-gray-500">
                    Acceso 24/7 desde cualquier dispositivo
                  </p>
                </div>
              </div>

              <div className="flex items-start">
                <div className="flex-shrink-0">
                  <div className="flex items-center justify-center h-10 w-10 rounded-md bg-[#31B2A5] text-white">
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      className="h-6 w-6"
                      fill="none"
                      viewBox="0 0 24 24"
                      stroke="currentColor"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z"
                      />
                    </svg>
                  </div>
                </div>
                <div className="ml-4">
                  <h4 className="text-lg font-medium text-gray-900">
                    Comunidad activa
                  </h4>
                  <p className="mt-1 text-sm text-gray-500">
                    Interactúa con estudiantes y profesores
                  </p>
                </div>
              </div>

              <div className="flex items-start">
                <div className="flex-shrink-0">
                  <div className="flex items-center justify-center h-10 w-10 rounded-md bg-[#31B2A5] text-white">
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      className="h-6 w-6"
                      fill="none"
                      viewBox="0 0 24 24"
                      stroke="currentColor"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197M13 7a4 4 0 11-8 0 4 4 0 018 0z"
                      />
                    </svg>
                  </div>
                </div>
                <div className="ml-4">
                  <h4 className="text-lg font-medium text-gray-900">
                    Instructores expertos
                  </h4>
                  <p className="mt-1 text-sm text-gray-500">
                    Aprende de profesionales con experiencia real
                  </p>
                </div>
              </div>
            </div>

            <div className="pt-4">
              <a
                href="/courses"
                className="inline-flex items-center px-6 py-3 border border-transparent text-base font-medium rounded-md shadow-sm text-white bg-[#0D7682] hover:bg-[#0A5D65] focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-[#31B2A5] transition-colors"
              >
                Conoce nuestros cursos
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  className="h-5 w-5 ml-2"
                  viewBox="0 0 20 20"
                  fill="currentColor"
                >
                  <path
                    fillRule="evenodd"
                    d="M10.293 5.293a1 1 0 011.414 0l4 4a1 1 0 010 1.414l-4 4a1 1 0 01-1.414-1.414L12.586 11H5a1 1 0 110-2h7.586l-2.293-2.293a1 1 0 010-1.414z"
                    clipRule="evenodd"
                  />
                </svg>
              </a>
            </div>
          </div>
        </div>

        {/* Estadísticas */}
        <div className="mt-16 pt-10 border-t border-gray-200">
          <dl className="grid grid-cols-2 gap-x-4 gap-y-8 sm:grid-cols-4">
            <div className="text-center">
              <dt className="text-base font-normal text-gray-500">
                Cursos disponibles
              </dt>
              <dd className="mt-1 text-3xl font-extrabold text-[#0D7682]">
                100+
              </dd>
            </div>

            <div className="text-center">
              <dt className="text-base font-normal text-gray-500">
                Estudiantes activos
              </dt>
              <dd className="mt-1 text-3xl font-extrabold text-[#0D7682]">
                15k+
              </dd>
            </div>

            <div className="text-center">
              <dt className="text-base font-normal text-gray-500">
                Instructores
              </dt>
              <dd className="mt-1 text-3xl font-extrabold text-[#0D7682]">
                50+
              </dd>
            </div>

            <div className="text-center">
              <dt className="text-base font-normal text-gray-500">
                Satisfacción
              </dt>
              <dd className="mt-1 text-3xl font-extrabold text-[#0D7682]">
                98%
              </dd>
            </div>
          </dl>
        </div>
      </div>
    </section>
  );
};

export default AboutSection;
