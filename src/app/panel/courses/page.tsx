"use client";

import { useState, useEffect } from "react";
import {
  InformationCircleIcon,
  PencilSquareIcon,
  TrashIcon,
  ChevronLeftIcon,
  ChevronRightIcon,
  FolderPlusIcon,
} from "@heroicons/react/24/outline";
import { Course } from "@/types/api";
import { useAuth } from "@/libs/context/AuthContext";
import { useRouter } from "next/navigation";
import React from "react";
import CourseModal from "@/components/modals/CourseModal";
import ConfirmationModal from "@/components/modals/ConfirmationModal";

export default function PanelCoursesPage() {
  const [loading, setLoading] = useState(true);
  const [courses, setCourses] = useState<Course[]>([]);
  const [courseModal, setCourseModal] = useState(false);
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage] = useState(8);
  const [confirmationModal, setConfirmationModal] = useState(false);
  const [selectedCourse, setSelectedCourse] = useState<Course | null>(null);
  const { user, loadingUser } = useAuth();
  const router = useRouter();

  // Calcular datos de paginación
  const totalItems = courses.length;
  const totalPages = Math.ceil(totalItems / itemsPerPage);
  const startIndex = (currentPage - 1) * itemsPerPage;
  const endIndex = startIndex + itemsPerPage;
  const currentCourses = courses.slice(startIndex, endIndex);
  const startItem = startIndex + 1;
  const endItem = Math.min(endIndex, totalItems);

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

      const resMyCourses = await fetch(
        `/api/courses/getByUUID/${user?.uuid}/creator`
      );
      const myCoursesData: Course[] = await resMyCourses.json();
      setCourses(myCoursesData);
    } catch (err) {
      console.error("Error al inciar los datos:", err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadInitialData();
  }, [loadingUser]);

  const goToPage = (page: number) => {
    setCurrentPage(page);
  };

  const goToPreviousPage = () => {
    if (currentPage > 1) {
      setCurrentPage(currentPage - 1);
    }
  };

  const goToNextPage = () => {
    if (currentPage < totalPages) {
      setCurrentPage(currentPage + 1);
    }
  };

  const getPageNumbers = () => {
    const pages = [];
    const maxVisiblePages = 5;

    if (totalPages <= maxVisiblePages) {
      for (let i = 1; i <= totalPages; i++) {
        pages.push(i);
      }
    } else {
      if (currentPage <= 3) {
        pages.push(1, 2, 3, "...", totalPages);
      } else if (currentPage >= totalPages - 2) {
        pages.push(1, "...", totalPages - 2, totalPages - 1, totalPages);
      } else {
        pages.push(
          1,
          "...",
          currentPage - 1,
          currentPage,
          currentPage + 1,
          "...",
          totalPages
        );
      }
    }

    return pages;
  };

  const handleDeleteCourse = async () => {
    if (!selectedCourse) return;

    try {
      const res = await fetch(
        `/api/courses/getByID/${selectedCourse.id}/delete`,
        {
          method: "DELETE",
        }
      );

      if (res.ok) {
        setCourses((prevCourses) =>
          prevCourses.filter((course) => course.id !== selectedCourse.id)
        );
        setConfirmationModal(false);
        setSelectedCourse(null);
      } else {
        console.error("Error al eliminar el curso");
      }
    } catch (err) {
      console.error("Error al eliminar el curso:", err);
    }
  };

  return (
    <div className="w-full">
      <div className="mb-8 pt-16 lg:pt-0">
        <h1 className="text-3xl font-bold mb-2 text-gray-800">
          Gestión de Cursos
        </h1>
        <p className="text-gray-600">
          Administra y edita todos tus cursos desde aquí
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
        <div className="col-span-1">
          <button
            onClick={() => setCourseModal(true)}
            className="cursor-pointer text-white flex gap-2 bg-gradient-to-r from-teal-500/90 to-cyan-600/90 transition transform hover:scale-105 px-4 py-2 rounded-xl"
          >
            <FolderPlusIcon className="size-6" />
            Agregar curso
          </button>
        </div>

        <div className="col-span-full">
          <div
            className={`relative overflow-x-auto ${
              totalPages > 1 ? "rounded-t-2xl" : "rounded-2xl"
            } shadow`}
          >
            {loading && (
              <div className="absolute inset-0 bg-white bg-opacity-75 flex items-center justify-center z-10">
                <div className="flex items-center space-x-2">
                  <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-[#599f96]"></div>
                  <span className="text-sm text-gray-600">Cargando...</span>
                </div>
              </div>
            )}
            <table className="w-full text-sm text-left rtl:text-right text-gray-500">
              <thead className="text-xs text-gray-700 uppercase bg-gray-50 border-b border-gray-200">
                <tr>
                  <th scope="col" className="px-6 py-4 font-semibold">
                    Curso
                  </th>
                  <th
                    scope="col"
                    className="px-6 py-4 font-semibold hidden xl:table-cell"
                  >
                    Descripción
                  </th>
                  <th
                    scope="col"
                    className="px-6 py-4 font-semibold hidden md:table-cell"
                  >
                    Precio
                  </th>
                  <th scope="col" className="px-6 py-4 font-semibold">
                    Fecha
                  </th>
                  <th scope="col" className="px-6 py-4 font-semibold">
                    Categoría
                  </th>
                  <th scope="col" className="px-6 py-4 font-semibold">
                    Acciones
                  </th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-200">
                {currentCourses.map((course: Course, index) => (
                  <tr
                    key={index}
                    className="bg-white hover:bg-gray-50 transition-colors duration-200"
                  >
                    <td className="px-6 py-4 font-medium text-gray-900">
                      {course.name}
                    </td>
                    <td className="px-6 py-4 max-w-xs hidden xl:table-cell truncate">
                      {course.description}
                    </td>
                    <td className="px-6 py-4 font-semibold text-green-600 hidden md:table-cell">
                      MXN${course.price}
                    </td>
                    <td className="px-6 py-4">
                      {new Date(course.date).toLocaleDateString("es-MX")}
                    </td>
                    <td className="px-6 py-4">
                      <span className="px-2 py-1 text-xs font-medium bg-blue-100 text-blue-800 rounded-full">
                        {course.category_name}
                      </span>
                    </td>
                    <td className="px-6 py-4">
                      <div className="flex gap-2">
                        <button
                          onClick={() =>
                            router.push(
                              `/panel/courses/edit?courseId=${course.id}`
                            )
                          }
                          className="cursor-pointer bg-gradient-to-r from-green-500/90 to-green-600/90 hover:from-green-600/90 hover:to-green-700/90 text-white p-2 rounded-md transition-colors duration-300"
                          title="Editar curso"
                        >
                          <PencilSquareIcon className="size-4" />
                        </button>
                        <button
                          onClick={() => {
                            setSelectedCourse(course);
                            setConfirmationModal(true);
                          }}
                          className="cursor-pointer bg-gradient-to-r from-red-500/90 to-red-600/90 hover:from-red-600/90 hover:to-red-700/90 text-white p-2 rounded-md transition-colors duration-300"
                          title="Eliminar curso"
                        >
                          <TrashIcon className="size-4" />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          {/* Paginación */}
          {totalPages > 1 && (
            <div className="flex items-center justify-between border-t shadow border-gray-200 bg-white px-4 py-3 sm:px-6 rounded-b-2xl">
              <div className="flex flex-1 justify-between sm:hidden">
                <button
                  onClick={goToPreviousPage}
                  disabled={currentPage === 1}
                  className="relative inline-flex items-center rounded-md border border-gray-300 bg-white px-4 py-2 text-sm font-medium text-gray-700 hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  Previous
                </button>
                <button
                  onClick={goToNextPage}
                  disabled={currentPage === totalPages}
                  className="relative ml-3 inline-flex items-center rounded-md border border-gray-300 bg-white px-4 py-2 text-sm font-medium text-gray-700 hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  Next
                </button>
              </div>

              {/* Navegación desktop */}
              <div className="hidden sm:flex sm:flex-1 sm:items-center sm:justify-between">
                <div>
                  <p className="text-sm text-gray-700">
                    Mostrando <span className="font-medium">{startItem}</span> a{" "}
                    <span className="font-medium">{endItem}</span> de{" "}
                    <span className="font-medium">{totalItems}</span> resultados
                  </p>
                </div>
                <div>
                  <nav
                    className="isolate inline-flex -space-x-px rounded-md shadow-xs"
                    aria-label="Pagination"
                  >
                    {/* Botón Previous */}
                    <button
                      onClick={goToPreviousPage}
                      disabled={currentPage === 1}
                      className="relative inline-flex items-center rounded-l-md px-2 py-2 text-gray-400 ring-1 ring-gray-300 ring-inset hover:bg-gray-50 focus:z-20 focus:outline-offset-0 disabled:opacity-50 disabled:cursor-not-allowed"
                    >
                      <span className="sr-only">Previous</span>
                      <ChevronLeftIcon className="size-5" />
                    </button>

                    {/* Números de página */}
                    {getPageNumbers().map((page, index) => (
                      <React.Fragment key={index}>
                        {page === "..." ? (
                          <span className="relative inline-flex items-center px-4 py-2 text-sm font-semibold text-gray-700 ring-1 ring-gray-300 ring-inset focus:outline-offset-0">
                            ...
                          </span>
                        ) : (
                          <button
                            onClick={() => goToPage(page as number)}
                            className={`relative inline-flex items-center px-4 py-2 text-sm font-semibold focus:z-20 focus:outline-offset-0 ${
                              currentPage === page
                                ? "z-10 bg-gradient-to-r from-teal-500/60 to-cyan-600/60 text-white focus-visible:outline-2 focus-visible:outline-offset-2"
                                : "text-gray-900 ring-1 ring-gray-300 ring-inset hover:bg-gray-50"
                            }`}
                          >
                            {page}
                          </button>
                        )}
                      </React.Fragment>
                    ))}

                    {/* Botón Next */}
                    <button
                      onClick={goToNextPage}
                      disabled={currentPage === totalPages}
                      className="relative inline-flex items-center rounded-r-md px-2 py-2 text-gray-400 ring-1 ring-gray-300 ring-inset hover:bg-gray-50 focus:z-20 focus:outline-offset-0 disabled:opacity-50 disabled:cursor-not-allowed"
                    >
                      <span className="sr-only">Next</span>
                      <ChevronRightIcon className="size-5" />
                    </button>
                  </nav>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
      <CourseModal
        closeModal={() => setCourseModal(false)}
        uuid={user ? user.uuid : ""}
        visible={courseModal}
        refreshTable={() => loadInitialData()}
      />
      {confirmationModal && selectedCourse && (
        <ConfirmationModal
          visible={confirmationModal}
          onClose={() => setConfirmationModal(false)}
          onConfirm={handleDeleteCourse}
          name={selectedCourse.name}
        />
      )}
    </div>
  );
}
