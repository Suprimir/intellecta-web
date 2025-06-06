"use client";

import React, { useEffect, useState } from "react";
import Image from "next/image";
import { useAuth } from "@/libs/context/AuthContext";
import { useSearchParams } from "next/navigation";
import EditProfileModal from "@/components/modals/EditProfileModal";
import { EnvelopeIcon } from "@heroicons/react/24/outline";
import { FolderOpenIcon } from "@heroicons/react/20/solid";
import {
  CalendarPlus,
  ChevronRight,
  GraduationCap,
  Mail,
  Pencil,
} from "lucide-react";

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
  const [refresh, setRefresh] = useState(false);
  const { user, loadingUser } = useAuth();
  const defaultProfileImage = "/userImages/default.webp";
  const searchParams = useSearchParams();
  const uuid = searchParams.get("uuid");

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

  useEffect(() => {
    loadInitialData();
  }, [loadingUser, refresh]);

  if (loading) {
    return <div>Cargando...</div>;
  }

  return (
    <div className="bg-gray-100 min-h-screen">
      <div className="bg-gradient-to-tr from-yellow-500 to-yellow-600 text-white py-8">
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

            {/* Informacion basica */}
            <div className="text-center md:text-left space-y-2">
              <h1 className="text-3xl font-bold">{userData.user.username}</h1>
              <div className="flex justify-center md:justify-start gap-4 mt-2">
                <span className="flex items-center gap-1">
                  <Mail className="size-5 text-white" />
                  {userData.user.email}
                </span>
              </div>
              <div className="flex justify-center md:justify-start gap-4 mt-2">
                <span className="flex items-center gap-1">
                  <CalendarPlus className="w-5 h-5 text-white" />
                  Cuenta creada el:{" "}
                  {new Date(userData.user.created_at).toLocaleDateString(
                    "es-MX"
                  )}
                </span>
              </div>
            </div>

            {/* Boton de editar */}
            {uuid === user?.uuid && (
              <div className="mt-4 md:mt-0 md:ml-auto">
                <button
                  onClick={() => setEditProfileModal(true)}
                  className="cursor-pointer w-full bg-gradient-to-r from-teal-500 to-teal-600 text-white py-2 px-4 rounded-lg font-medium hover:from-teal-600 hover:to-teal-700 transition-all duration-200 flex items-center justify-center shadow-md hover:shadow-lg transform hover:-translate-y-0.5"
                >
                  <Pencil className="size-5 mr-2" />
                  Editar perfil
                </button>
              </div>
            )}
          </div>
        </div>
      </div>

      <div className="max-w-6xl mx-auto px-4 py-8">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          <div className="space-y-6">
            {/* Sobre mi */}
            <div className="bg-white rounded-lg shadow-md p-6">
              <h2 className="text-xl font-bold text-gray-800 border-b pb-3 mb-4">
                Sobre mí
              </h2>
              <p className="text-gray-700">{userData.user.bio}</p>
            </div>
          </div>

          <div className="md:col-span-2 space-y-6">
            {/* Progreso de cursos */}
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
                      <div className="bg-gradient-to-b from-teal-100 to-teal-200 p-3 rounded-lg">
                        <GraduationCap className="size-8 text-teal-600" />
                      </div>
                      <div>
                        <h3 className="font-semibold text-gray-800">
                          Certificado de {certificate.courseName}
                        </h3>
                        <p className="text-gray-600">INTELLECTA</p>
                        <div className="mt-2">
                          <a
                            href={`/home/courses/${certificate.courseId}`}
                            className="text-sm text-teal-600 hover:underline"
                          >
                            Ver curso
                          </a>
                        </div>
                      </div>
                    </div>
                  ))}
              </div>
            </div>
          </div>
        </div>
      </div>
      <EditProfileModal
        visible={editProfileModal}
        user={userData.user}
        closeModal={() => setEditProfileModal(false)}
        refreshProfile={() => loadInitialData()}
      />
    </div>
  );
}
