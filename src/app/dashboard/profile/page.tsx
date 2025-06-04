"use client";

import React, { useEffect, useState } from "react";
import Image from "next/image";
import { useAuth } from "@/libs/context/AuthContext";
import { useSearchParams } from "next/navigation";
import EditProfileModal from "@/components/modals/EditProfileModal";
import { EnvelopeIcon } from "@heroicons/react/24/outline";
import { FolderOpenIcon } from "@heroicons/react/20/solid";

export default function UserProfile({
  params,
}: {
  params: Promise<{ uuid: string }>;
}) {
  const [userData, setUserData] = useState({
    user: {
      username: "",
      email: "",
      role: "",
      profilePicture: "",
      bio: "",
      created_at: "",
    },
    certificates: [{ courseId: 0, courseName: "" }],
    courseCompletion: [
      { courseId: 0, courseName: "", completionPercentage: 0 },
    ],
  });
  const [loading, setLoading] = useState(true);
  const [editProfileModal, setEditProfileModal] = useState(false);
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
        const userData = await res.json();
        console.log("Datos del usuario:", userData);
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
            <div className="relative">
              <div className="w-32 h-32 rounded-full overflow-hidden bg-gray-100 border-2 border-gray-200">
                <Image
                  src={
                    userData.user.profilePicture
                      ? userData.user.profilePicture
                      : defaultProfileImage
                  }
                  alt="Foto de perfil"
                  fill
                  className="object-cover p-1 rounded-full"
                />
              </div>
            </div>

            {/* Información básica */}
            <div className="text-center md:text-left space-y-2">
              <h1 className="text-3xl font-bold">{userData.user.username}</h1>
              <div className="flex justify-center md:justify-start gap-4 mt-2">
                <span className="flex items-center gap-1">
                  <EnvelopeIcon className="w-5 h-5 text-white" />
                  {userData.user.email}
                </span>
              </div>
              <div className="flex justify-center md:justify-start gap-4 mt-2">
                <span className="flex items-center gap-1">
                  <FolderOpenIcon className="w-5 h-5 text-white" />
                  {userData.user.created_at}
                </span>
              </div>
            </div>

            {/* Botones de acción */}
            {uuid === user?.uuid && (
              <div className="mt-4 md:mt-0 md:ml-auto">
                <button
                  onClick={() => setEditProfileModal(true)}
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
              <p className="text-gray-700">{userData.user.bio}</p>
            </div>
          </div>

          {/* Columna derecha - Contenido principal */}
          <div className="md:col-span-2 space-y-6">
            {/* Progreso académico */}
            <div className="bg-white rounded-lg shadow-md p-6">
              <h2 className="text-xl font-bold text-gray-800 border-b pb-3 mb-4">
                Progreso académico
              </h2>

              <div className="space-y-5">
                {userData.courseCompletion &&
                  userData.courseCompletion.map(
                    (course, index) =>
                      course.completionPercentage !== 100 && (
                        <div key={index}>
                          <div className="flex justify-between mb-1">
                            <span className="font-medium text-gray-700">
                              {course.courseName}
                            </span>
                            <span className="text-teal-600">
                              {course.completionPercentage}
                            </span>
                          </div>
                          <div className="w-full bg-gray-200 rounded-full h-2">
                            <div
                              className="bg-teal-500 h-2 rounded-full"
                              style={{
                                width: `${course.completionPercentage}%`,
                              }}
                            ></div>
                          </div>
                        </div>
                      )
                  )}
              </div>
            </div>

            {/* Certificaciones */}
            <div className="bg-white rounded-lg shadow-md p-6">
              <h2 className="text-xl font-bold text-gray-800 border-b pb-3 mb-4">
                Certificaciones
              </h2>
              <div className="space-y-4">
                {userData.certificates &&
                  userData.certificates.map((certificate, index) => (
                    <div key={index} className="flex gap-4 items-start">
                      <div className="bg-teal-100 p-3 rounded-lg">
                        <svg
                          className="w-8 h-8 text-teal-600"
                          fill="currentColor"
                          viewBox="0 0 20 20"
                        >
                          <path d="M10.394 2.08a1 1 0 00-.788 0l-7 3a1 1 0 000 1.84L5.25 8.051a.999.999 0 01.356-.257l4-1.714a1 1 0 11.788 1.838L7.667 9.088l1.94.831a1 1 0 00.787 0l7-3a1 1 0 000-1.838l-7-3zM3.31 9.397L5 10.12v4.102a8.969 8.969 0 00-1.05-.174 1 1 0 01-.89-.89 11.115 11.115 0 01.25-3.762zM9.3 16.573A9.026 9.026 0 007 14.935v-3.957l1.818.78a3 3 0 002.364 0l5.508-2.361a11.026 11.026 0 01.25 3.762 1 1 0 01-.89.89 8.968 8.968 0 00-5.35 2.524 1 1 0 01-1.4 0zM6 18a1 1 0 001-1v-2.065a8.935 8.935 0 00-2-.712V17a1 1 0 001 1z" />
                        </svg>
                      </div>
                      <div>
                        <h3 className="font-semibold text-gray-800">
                          Certificado Oficial en Desarrollo Web Full Stack
                        </h3>
                        <p className="text-gray-600">
                          INTELLECTA • Completado en marzo 2024
                        </p>
                        <div className="mt-2">
                          <a
                            href="#"
                            className="text-sm text-teal-600 hover:underline"
                          >
                            Ver curso
                          </a>
                        </div>
                      </div>
                    </div>
                  ))}
              </div>

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
          </div>
        </div>
      </div>
      {editProfileModal && (
        <EditProfileModal
          user={userData.user}
          closeModal={() => setEditProfileModal(false)}
        />
      )}
    </div>
  );
}
