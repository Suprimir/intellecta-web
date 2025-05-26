"use client";

import { useState, useEffect } from "react";
import { ChevronLeftIcon, ChevronRightIcon } from "@heroicons/react/24/outline";
import { Payments } from "@/types/api";
import { useAuth } from "@/libs/context/AuthContext";
import React from "react";

export default function PanelCoursesPage() {
  const [loading, setLoading] = useState(true);
  const [payments, setPayments] = useState<Payments[]>([]);
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage] = useState(7);
  const { user, loadingUser } = useAuth();

  // Calcular datos de paginación
  const totalItems = payments.length;
  const totalPages = Math.ceil(totalItems / itemsPerPage);
  const startIndex = (currentPage - 1) * itemsPerPage;
  const endIndex = startIndex + itemsPerPage;
  const currentPayments = payments.slice(startIndex, endIndex);
  const startItem = startIndex + 1;
  const endItem = Math.min(endIndex, totalItems);

  useEffect(() => {
    const loadInitialData = async () => {
      try {
        const res = await fetch("/api/payments");
        const data: Payments[] = await res.json();
        setPayments(data);
      } catch (err) {
        console.error("Error al inciar los datos:", err);
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

  return (
    <div className="w-full">
      <div className="mb-8 pt-16 lg:pt-0">
        <h1 className="text-3xl font-bold mb-2 text-gray-800">
          Gestión de Pagos
        </h1>
        <p className="text-gray-600">Administra todos los pagos desde aquí</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
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
                    Payment Intent ID
                  </th>
                  <th
                    scope="col"
                    className="px-6 py-4 font-semibold hidden xl:table-cell"
                  >
                    Monto
                  </th>
                  <th
                    scope="col"
                    className="px-6 py-4 font-semibold hidden md:table-cell"
                  >
                    Estado
                  </th>
                  <th scope="col" className="px-6 py-4 font-semibold">
                    Moneda
                  </th>
                  <th scope="col" className="px-6 py-4 font-semibold">
                    Cliente
                  </th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-200">
                {currentPayments.length === 0 ? (
                  <tr>
                    <td
                      colSpan={5}
                      className="px-6 py-8 text-center text-gray-500"
                    >
                      {loading
                        ? "Cargando datos..."
                        : "No hay datos disponibles"}
                    </td>
                  </tr>
                ) : (
                  currentPayments.map((payment: Payments, index) => (
                    <tr
                      key={index}
                      className="bg-white hover:bg-gray-50 transition-colors duration-200"
                    >
                      <td className="px-6 py-4 font-medium text-gray-900">
                        {payment.payment_intent || "N/A"}
                      </td>
                      <td className="px-6 py-4 max-w-xs hidden xl:table-cell truncate">
                        {payment.amount
                          ? `${payment.amount.toFixed(2)}`
                          : "N/A"}
                      </td>
                      <td className="px-6 py-4 font-semibold hidden md:table-cell">
                        <span
                          className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${
                            payment.status === "succeded"
                              ? "bg-green-100 text-green-800"
                              : payment.status === "failed"
                              ? "bg-red-100 text-red-800"
                              : "bg-gray-100 text-gray-800"
                          }`}
                        >
                          {payment.status || "N/A"}
                        </span>
                      </td>
                      <td className="px-6 py-4 uppercase">
                        {payment.currency || "N/A"}
                      </td>
                      <td className="px-6 py-4">{payment.email}</td>
                    </tr>
                  ))
                )}
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
                                ? "z-10 bg-[#599f96] hover:bg-[#77afa1] text-white focus-visible:outline-2 focus-visible:outline-offset-2"
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
    </div>
  );
}
