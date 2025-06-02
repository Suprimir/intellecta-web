"use client";

import React, { useEffect, useState } from "react";
import Image from "next/image";
import { Certificate, Profile, User } from "@/types/api";
import { useAuth } from "@/libs/context/AuthContext";
import { useSearchParams } from "next/navigation";

export default function UserProfile({
  params,
}: {
  params: Promise<{ uuid: string }>;
}) {
  const defaultUser: Partial<User> = {
    uuid: "",
    profilePicture: null,
    username: "",
    email: "",
    password: "",
    role: "student",
  };

  const [userData, setUserData] = useState<Partial<Profile>>(defaultUser);
  const [loading, setLoading] = useState(true);
  const { user, loadingUser } = useAuth();
  const defaultProfileImage = "/userImages/default.webp";
  const searchParams = useSearchParams();
  const uuid = searchParams.get("uuid");

  useEffect(() => {
    const loadInitialData = async () => {
      try {
        const waitForAuth = () =>
          new Promise<void>((resolve) => {
            const interval = setInterval(() => {
              if (!loadingUser) {
                clearInterval(interval);
                resolve();
              }
            }, 100);
          });
        await waitForAuth();

        const res = await fetch(`/api/profile/${uuid}`);
        const userData: Partial<User> = await res.json();
        setUserData(userData);
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    };

    loadInitialData();
  }, [loadingUser]);

  if (loading) {
    return <div>Cargando...</div>;
  }

  return (
    <div className="bg-gray-100 min-h-screen">
      <div className="bg-[#FFBD008A] text-white py-8">
        <div className="max-w-6xl mx-auto px-4">
          <div className="flex flex-col md:flex-row items-center md:items-start gap-8">
            {/* Foto de perfil */}
            <div className="relative w-32 h-32 md:w-40 md:h-40">
              <div className="rounded-full overflow-hidden border-4 border-white shadow-lg">
                <Image
                  src={
                    userData.profilePicture
                      ? userData.profilePicture
                      : defaultProfileImage
                  }
                  alt="Foto de perfil"
                  width={160}
                  height={160}
                  className="object-cover"
                />
              </div>
            </div>

            {/* Información básica */}
            <div className="text-center md:text-left space-y-2">
              <h1 className="text-3xl font-bold">{userData.username}</h1>
              <div className="flex justify-center md:justify-start gap-4 mt-2">
                <span className="flex items-center gap-1">
                  <svg
                    className="w-5 h-5"
                    fill="currentColor"
                    viewBox="0 0 20 20"
                  >
                    <path d="M2.003 5.884L10 9.882l7.997-3.998A2 2 0 0016 4H4a2 2 0 00-1.997 1.884z" />
                    <path d="M18 8.118l-8 4-8-4V14a2 2 0 002 2h12a2 2 0 002-2V8.118z" />
                  </svg>
                  {userData.email}
                </span>
              </div>
            </div>

            {/* Botones de acción */}
            {uuid === user?.uuid && (
              <div className="mt-4 md:mt-0 md:ml-auto">
                <button
                  onClick={() => {
                    console.log(user);
                  }}
                  className="bg-white text-teal-600 px-6 py-2 rounded-md font-medium hover:bg-teal-50 transition-colors"
                >
                  Editar perfil
                </button>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Contenido principal */}
      <div className="max-w-6xl mx-auto px-4 py-8">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {/* Columna izquierda */}
          <div className="space-y-6">
            {/* Sobre mí */}
            <div className="bg-white rounded-lg shadow-md p-6">
              <h2 className="text-xl font-bold text-gray-800 border-b pb-3 mb-4">
                Sobre mí
              </h2>
              <p className="text-gray-700"></p>
            </div>

            {/* Datos personales */}
            <div className="bg-white rounded-lg shadow-md p-6">
              <h2 className="text-xl font-bold text-gray-800 border-b pb-3 mb-4">
                Datos
              </h2>
            </div>

            {/* Redes sociales */}
            <div className="bg-white rounded-lg shadow-md p-6">
              <h2 className="text-xl font-bold text-gray-800 border-b pb-3 mb-4">
                Redes sociales
              </h2>
            </div>
          </div>

          {/* Columna derecha - Contenido principal */}
          <div className="md:col-span-2 space-y-6">
            {/* Progreso académico */}
            <div className="bg-white rounded-lg shadow-md p-6">
              <h2 className="text-xl font-bold text-gray-800 border-b pb-3 mb-4">
                Progreso académico
              </h2>
            </div>

            {/* Certificaciones */}
            <div className="bg-white rounded-lg shadow-md p-6">
              <h2 className="text-xl font-bold text-gray-800 border-b pb-3 mb-4">
                Certificaciones
              </h2>

              {userData.certificates &&
                userData.certificates.map((certificate, index) => (
                  <div key={index}>
                    <h1>{certificate.name}</h1>
                  </div>
                ))}

              <div className="mt-6">
                <a
                  href="#"
                  className="text-teal-600 font-medium hover:text-teal-700 transition-colors flex items-center gap-1"
                >
                  Ver todas las certificaciones
                  <svg
                    className="w-4 h-4"
                    fill="currentColor"
                    viewBox="0 0 20 20"
                  >
                    <path
                      fillRule="evenodd"
                      d="M7.293 14.707a1 1 0 010-1.414L10.586 10 7.293 6.707a1 1 0 011.414-1.414l4 4a1 1 0 010 1.414l-4 4a1 1 0 01-1.414 0z"
                      clipRule="evenodd"
                    />
                  </svg>
                </a>
              </div>
            </div>

            {/* Cursos en progreso */}
            <div className="bg-white rounded-lg shadow-md p-6">
              <h2 className="text-xl font-bold text-gray-800 border-b pb-3 mb-4">
                Cursos en progreso
              </h2>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
