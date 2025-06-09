"use client";

import {
  ChevronLeftIcon,
  ChevronRightIcon,
  Pencil,
  Trash2,
  MoreHorizontal,
} from "lucide-react";
import React from "react";
import { useState, useEffect } from "react";

interface TableProps<T> {
  items: T[];
  itemsPerPage?: number;
  excludedKeys?: string[];
  editable?: boolean;
  watchable?: boolean;
  onEdit?: (item: T) => void;
  onDelete?: (item: T) => void;
  onWatch?: (item: T) => void;
}

export default function Table<T extends Record<string, any>>({
  items,
  itemsPerPage = 8,
  excludedKeys = [],
  editable = false,
  watchable = false,
  onEdit,
  onDelete,
  onWatch,
}: TableProps<T>) {
  const [filteredItems, setFilteredItems] = useState<T[]>([]);
  const [headers, setHeaders] = useState<string[]>([]);
  const [loading, setLoading] = useState(true);
  const [currentPage, setCurrentPage] = useState(1);

  useEffect(() => {
    if (excludedKeys.length === 0) {
      setFilteredItems(items);

      const headers = items.length > 0 ? Object.keys(items[0]) : [];
      setHeaders(headers);
    } else {
      const filtered = items.map((obj) => {
        const nuevo: any = {};
        for (const clave in obj) {
          if (!excludedKeys.includes(clave)) {
            nuevo[clave] = obj[clave];
          }
        }
        return nuevo;
      });

      setFilteredItems(filtered);

      const headers = items.length > 0 ? Object.keys(filtered[0]) : [];
      setHeaders(headers);
    }

    setLoading(false);
  }, [items]);

  const totalItems = filteredItems.length;
  const totalPages = Math.ceil(totalItems / itemsPerPage);
  const startIndex = (currentPage - 1) * itemsPerPage;
  const endIndex = startIndex + itemsPerPage;
  const currentItems = filteredItems.slice(startIndex, endIndex);
  const startItem = startIndex + 1;
  const endItem = Math.min(endIndex, totalItems);

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

  const formatHeader = (header: string) => {
    return header
      .replace(/([A-Z])/g, " $1")
      .replace(/^./, (str) => str.toUpperCase())
      .trim();
  };

  const formatCellValue = (value: any) => {
    if (value === null || value === undefined) return "-";
    if (value === 0 || value === 1) return new Boolean(value) ? "No" : "Sí";
    if (typeof value === "number") return value.toLocaleString();
    if (!isNaN(new Date(value).getTime())) {
      return new Date(value).toLocaleDateString("es-MX", {
        year: "numeric",
        month: "2-digit",
        day: "2-digit",
      });
    }
    if (typeof value === "string" && value.length > 30) {
      return value.substring(0, 30) + "...";
    }
    return String(value);
  };

  return (
    <div className="w-full">
      <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden">
        {loading && (
          <div className="absolute inset-0 bg-white/80 backdrop-blur-sm flex items-center justify-center z-20 rounded-2xl">
            <div className="flex flex-col items-center space-y-3">
              <div className="relative">
                <div className="w-8 h-8 border-3 border-gray-200 rounded-full"></div>
                <div className="w-8 h-8 border-3 border-blue-500 border-t-transparent rounded-full animate-spin absolute top-0"></div>
              </div>
              <span className="text-gray-600 font-medium text-sm">
                Cargando datos...
              </span>
            </div>
          </div>
        )}

        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="border-b border-gray-100">
                {headers.map(
                  (header) =>
                    header !== "id" && (
                      <th
                        key={header}
                        className="px-6 py-4 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider bg-gray-50/50"
                      >
                        {formatHeader(header)}
                      </th>
                    )
                )}
                {editable && (
                  <th className="px-6 py-4 text-center text-xs font-semibold text-gray-600 uppercase tracking-wider bg-gray-50/50 w-20">
                    Acciones
                  </th>
                )}
                {watchable && (
                  <th className="px-6 py-4 text-center text-xs font-semibold text-gray-600 uppercase tracking-wider bg-gray-50/50 w-20">
                    Ver Aplicacion
                  </th>
                )}
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-50">
              {currentItems.length === 0 && !loading ? (
                <tr>
                  <td
                    colSpan={headers.length + 1}
                    className="px-6 py-16 text-center"
                  >
                    <div className="flex flex-col items-center space-y-3">
                      <div className="w-12 h-12 bg-gray-100 rounded-full flex items-center justify-center">
                        <MoreHorizontal className="w-5 h-5 text-gray-400" />
                      </div>
                      <div>
                        <p className="text-gray-900 font-medium">
                          No hay datos disponibles
                        </p>
                        <p className="text-gray-500 text-sm mt-1">
                          Aún no se han agregado elementos a esta tabla
                        </p>
                      </div>
                    </div>
                  </td>
                </tr>
              ) : (
                currentItems.map((item, idx) => (
                  <tr
                    key={idx}
                    className="hover:bg-gray-50/50 transition-all duration-200 group"
                  >
                    {headers.map(
                      (key) =>
                        key !== "id" && (
                          <td
                            key={key}
                            className="px-6 py-4 text-sm text-gray-900 font-medium"
                            title={String(item[key])}
                          >
                            <div className="max-w-xs truncate">
                              {formatCellValue(item[key])}
                            </div>
                          </td>
                        )
                    )}
                    {editable && (
                      <td className="px-6 py-4">
                        <div className="flex items-center justify-center space-x-2 opacity-60 group-hover:opacity-100 transition-opacity duration-200">
                          <button
                            onClick={() => onEdit?.(items[idx])}
                            className="p-2 text-gray-400 hover:text-blue-600 hover:bg-blue-50 rounded-lg transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-1"
                            title="Editar"
                          >
                            <Pencil className="w-4 h-4" />
                          </button>
                          <button
                            onClick={() => onDelete?.(item)}
                            className="p-2 text-gray-400 hover:text-red-600 hover:bg-red-50 rounded-lg transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-red-500 focus:ring-offset-1"
                            title="Eliminar"
                          >
                            <Trash2 className="w-4 h-4" />
                          </button>
                        </div>
                      </td>
                    )}
                    {watchable && (
                      <td className="px-6 py-4">
                        <div className="flex items-center justify-center space-x-2 opacity-60 group-hover:opacity-100 transition-opacity duration-200">
                          <button
                            onClick={() => onWatch?.(items[idx])}
                            className="p-2 text-gray-400 hover:text-blue-600 hover:bg-blue-50 rounded-lg transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-1"
                            title="Ver Aplicación"
                          >
                            <MoreHorizontal className="w-4 h-4" />
                          </button>
                        </div>
                      </td>
                    )}
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>

        {/* Paginación */}
        {totalPages > 1 && (
          <div className="px-6 py-4 border-t border-gray-100 bg-gray-50/30">
            <div className="flex items-center justify-between">
              <div className="flex flex-1 justify-between sm:hidden">
                <button
                  onClick={goToPreviousPage}
                  disabled={currentPage === 1}
                  className="relative inline-flex items-center px-4 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-200 rounded-lg hover:bg-gray-50 disabled:opacity-40 disabled:cursor-not-allowed transition-all duration-200"
                >
                  Anterior
                </button>
                <span className="px-4 py-2 text-sm text-gray-700 self-center">
                  {currentPage} de {totalPages}
                </span>
                <button
                  onClick={goToNextPage}
                  disabled={currentPage === totalPages}
                  className="relative inline-flex items-center px-4 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-200 rounded-lg hover:bg-gray-50 disabled:opacity-40 disabled:cursor-not-allowed transition-all duration-200"
                >
                  Siguiente
                </button>
              </div>

              <div className="hidden sm:flex sm:flex-1 sm:items-center sm:justify-between">
                <div>
                  <p className="text-sm text-gray-600 font-medium">
                    Mostrando{" "}
                    <span className="text-gray-900 font-semibold">
                      {startItem}
                    </span>{" "}
                    a{" "}
                    <span className="text-gray-900 font-semibold">
                      {endItem}
                    </span>{" "}
                    de{" "}
                    <span className="text-gray-900 font-semibold">
                      {totalItems}
                    </span>{" "}
                    resultados
                  </p>
                </div>

                <div className="flex items-center">
                  <button
                    onClick={goToPreviousPage}
                    disabled={currentPage === 1}
                    className="relative inline-flex items-center px-2 py-2 text-sm font-medium text-gray-500 bg-white border border-gray-200 rounded-l-lg hover:bg-gray-50 hover:text-gray-700 disabled:opacity-40 disabled:cursor-not-allowed transition-all duration-200 focus:z-10 focus:outline-none"
                  >
                    <ChevronLeftIcon className="size-5" />
                  </button>

                  {getPageNumbers().map((page, index) => (
                    <React.Fragment key={index}>
                      {page === "..." ? (
                        <span className="relative inline-flex items-center px-4 py-2 text-sm font-medium text-gray-500 bg-white border-t border-b border-gray-200">
                          ...
                        </span>
                      ) : (
                        <button
                          onClick={() => goToPage(page as number)}
                          className={`relative inline-flex items-center px-3 py-2 text-sm font-medium transition-all duration-200 border-t border-b border-gray-200 focus:z-10 focus:outline-none ${
                            currentPage === page
                              ? "z-10 bg-blue-600 text-white border-blue-600 shadow-sm"
                              : "text-gray-700 bg-white hover:bg-gray-50 hover:text-gray-900"
                          }`}
                        >
                          {page}
                        </button>
                      )}
                    </React.Fragment>
                  ))}

                  <button
                    onClick={goToNextPage}
                    disabled={currentPage === totalPages}
                    className="relative inline-flex items-center px-2 py-2 text-sm font-medium text-gray-500 bg-white border border-gray-200 rounded-r-lg hover:bg-gray-50 hover:text-gray-700 disabled:opacity-40 disabled:cursor-not-allowed transition-all duration-200 focus:z-10 focus:outline-none"
                  >
                    <ChevronRightIcon className="size-5" />
                  </button>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
