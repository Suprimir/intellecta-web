"use client";

import { useState, useEffect } from "react";
import { StarIcon, UserIcon, CalendarIcon } from "@heroicons/react/24/outline";
import { PlayIcon as PlayIconSolid } from "@heroicons/react/24/solid";
import { CourseWithUnitContent } from "@/types/api";
import { useRouter } from "next/navigation";
import { useAuth } from "@/libs/context/AuthContext";
import { useAlert } from "@/libs/context/AlertContext";
import { CirclePlus, LoaderCircle, Trash2 } from "lucide-react";

export default function CourseContentView({
  params,
}: {
  params: Promise<{ courseId: string }>;
}) {
  const [loading, setLoading] = useState(true);
  const [handleLoading, setHandleLoading] = useState(false);
  const [course, setCourse] = useState<CourseWithUnitContent>();
  const [isAdded, setIsAdded] = useState(false);
  const { user, loadingUser } = useAuth();
  const { showAlert } = useAlert();

  const router = useRouter();

  useEffect(() => {
    const loadInitialData = async () => {
      try {
        const courseId = await params.then((p) => p.courseId);

        const res = await fetch(
          `/api/courses/getByID/${courseId}/publicContents`
        );
        const data: CourseWithUnitContent[] = await res.json();

        setCourse(data[0]);
        setIsAdded(data[0].location === "cart");
      } catch (error) {
        console.error("Error loading initial data:", error);
      } finally {
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
        setLoading(false);
      }
    };

    loadInitialData();
  }, [loadingUser]);

  const handleCartAction = async () => {
    setHandleLoading(true);

    try {
      const endpoint = isAdded ? "/api/cart/remove" : "/api/cart/add";

      const response = await fetch(endpoint, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ courseId: course?.id }),
      });

      if (!response.ok) {
        throw new Error("Error al procesar la solicitud");
      }

      setIsAdded(!isAdded);
    } catch (error) {
      console.error(error);
      showAlert(
        "Debes estar loggeado para realizar esta accion.",
        "error",
        "Error",
        2000
      );
    } finally {
      setHandleLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="bg-gradient-to-br from-yellow-50 to-orange-50 min-h-screen flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-yellow-500 mx-auto mb-4"></div>
          <p className="text-yellow-700 font-medium">Cargando contenido...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-gradient-to-br from-yellow-50 to-orange-50 min-h-screen p-6">
      {course && (
        <div className="max-w-7xl mx-auto">
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            <div className="lg:col-span-2">
              <div className="bg-white rounded-xl shadow-lg border border-yellow-200 p-6">
                <div className="flex items-center justify-between mb-6">
                  <h2 className="text-2xl font-bold text-gray-900">
                    Contenido del Curso
                  </h2>
                </div>

                <div className="space-y-3">
                  {course?.units.map((unit, index) => (
                    <div key={index} className="space-y-3">
                      <div className="flex items-center p-4 rounded-lg bg-gradient-to-r from-yellow-500 to-yellow-600 shadow-md">
                        <div className="flex items-center justify-center px-4 py-2 rounded-full bg-yellow-100 text-yellow-800 text-sm font-bold mr-4">
                          Unidad {unit.unit_number}
                        </div>
                        <div className="flex-1">
                          <h3 className="font-bold text-white text-lg">
                            {unit.title}
                          </h3>
                          <p className="text-yellow-100 text-sm mt-1">
                            {unit.contents.length} lección
                            {unit.contents.length !== 1 ? "es" : ""}
                          </p>
                        </div>
                      </div>
                      {unit.contents.map((content, index) => (
                        <div
                          key={index}
                          className="flex items-center p-4 rounded-lg border-2 transition-all duration-200 ml-4 border-gray-200 bg-white hover:border-yellow-300 hover:bg-yellow-50 hover:shadow-sm"
                        >
                          <div className="flex items-center flex-1">
                            <div className="flex items-center justify-center w-8 h-8 rounded-full bg-yellow-100 text-yellow-700 text-sm font-medium mr-4">
                              {index + 1}
                            </div>

                            <div className="mr-3">
                              {/* aqui iria el icono */}
                            </div>

                            <div className="flex-1">
                              <h3 className="font-medium text-gray-700">
                                {content.title}
                              </h3>
                            </div>
                          </div>
                        </div>
                      ))}
                    </div>
                  ))}
                </div>
              </div>
            </div>

            <div className="lg:col-span-1">
              <div className="bg-white rounded-xl shadow-lg border border-yellow-200 overflow-hidden sticky top-6">
                <div className="relative">
                  <img
                    src={course.image}
                    alt={course.name}
                    className="w-full h-48 object-cover"
                  />
                  <div className="absolute top-4 right-4 bg-white rounded-full px-3 py-1 text-sm font-medium text-gray-700 shadow-md">
                    {course.category_name}
                  </div>
                  <div className="absolute inset-0 bg-gradient-to-t from-black/20 to-transparent"></div>
                </div>

                <div className="p-6">
                  <h1 className="text-xl font-bold text-gray-900 mb-3">
                    {course.name}
                  </h1>

                  <p className="text-gray-600 text-sm mb-4 leading-relaxed">
                    {course.description}
                  </p>

                  <div className="space-y-3 mb-6">
                    <div className="flex items-center text-sm text-gray-600 bg-gray-50 p-3 rounded-lg">
                      <UserIcon className="size-4 mr-2 text-yellow-600" />
                      <span className="font-medium">{course.instructor}</span>
                    </div>

                    <div className="flex items-center text-sm text-gray-600 bg-gray-50 p-3 rounded-lg">
                      <StarIcon className="size-4 mr-2 text-yellow-400 fill-current" />
                      <span className="font-medium">
                        {course.rating.toFixed(1)}
                      </span>
                    </div>

                    <div className="flex items-center text-sm text-gray-600 bg-gray-50 p-3 rounded-lg">
                      <CalendarIcon className="size-4 mr-2 text-yellow-600" />
                      <span>
                        Creado el{" "}
                        {course &&
                          new Date(course.date).toLocaleDateString("es-ES")}
                      </span>
                    </div>
                  </div>

                  <div className="space-y-3">
                    {course.location === "purchased" && (
                      <button
                        onClick={() =>
                          router.push(
                            `/dashboard/courses?courseId=${course.id}`
                          )
                        }
                        className="w-full bg-gradient-to-r from-yellow-500 to-yellow-600 text-white cursor-pointer py-3 px-4 rounded-xl font-medium hover:from-yellow-600 hover:to-yellow-700 transition-all duration-200 flex items-center justify-center shadow-md hover:shadow-lg transform hover:-translate-y-0.5"
                      >
                        <PlayIconSolid className="size-5 mr-2" />
                        Continuar Curso
                      </button>
                    )}
                    {course.location !== "purchased" ? (
                      isAdded ? (
                        <button
                          onClick={() => handleCartAction()}
                          disabled={handleLoading}
                          className="w-full bg-gradient-to-r from-red-500 to-red-600 text-white cursor-pointer py-3 px-4 rounded-xl font-medium hover:from-red-600 hover:to-red-700 transition-all duration-200 flex items-center justify-center shadow-md hover:shadow-lg transform hover:-translate-y-0.5"
                        >
                          {handleLoading ? (
                            <svg
                              className="size-5 animate-spin"
                              viewBox="0 0 24 24"
                            >
                              <LoaderCircle />
                            </svg>
                          ) : (
                            <>
                              <Trash2 className="size-5 mr-2" />
                              Remover del Carrito
                            </>
                          )}
                        </button>
                      ) : (
                        <button
                          onClick={() => handleCartAction()}
                          disabled={handleLoading}
                          className="w-full bg-gradient-to-r from-green-500 to-green-600 text-white cursor-pointer py-3 px-4 rounded-xl font-medium hover:from-green-600 hover:to-green-700 transition-all duration-200 flex items-center justify-center shadow-md hover:shadow-lg transform hover:-translate-y-0.5"
                        >
                          {handleLoading ? (
                            <svg
                              className="size-5 animate-spin"
                              viewBox="0 0 24 24"
                            >
                              <LoaderCircle />
                            </svg>
                          ) : (
                            <>
                              <CirclePlus className="size-5 mr-2" />
                              Agregar al Carrito
                            </>
                          )}
                        </button>
                      )
                    ) : (
                      ""
                    )}
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
