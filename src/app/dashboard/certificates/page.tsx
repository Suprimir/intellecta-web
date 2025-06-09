"use client";

import { useAuth } from "@/libs/context/AuthContext";
import { Certificate } from "@/types/api";
import {
  Download,
  Award,
  Calendar,
  User,
  BookOpen,
  FileText,
  AlertCircle,
} from "lucide-react";
import { useSearchParams } from "next/navigation";
import { useState, useEffect } from "react";

export default function CertificatesPage() {
  const [loading, setLoading] = useState<boolean>(true);
  const [certificates, setCertificates] = useState<Certificate[]>([]);
  const [downloadingIds, setDownloadingIds] = useState<Set<number>>(new Set());
  const [error, setError] = useState<string>("");
  const [owner, setOwner] = useState<boolean>(false);
  const { user, loadingUser } = useAuth();
  const searchParams = useSearchParams();

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

        const res = await fetch(
          `/api/certificates/byUUID/${searchParams.get("uuid")}/user/`
        );

        if (!res.ok) {
          throw new Error("Error al cargar los certificados");
        }

        const certificates: Certificate[] = await res.json();
        setCertificates(certificates);
      } catch (err) {
        console.error("Error al iniciar los datos:", err);
        setError(
          "Error al cargar los certificados. Por favor, intenta de nuevo."
        );
      } finally {
        setOwner(user?.uuid === searchParams.get("uuid"));
        setLoading(false);
      }
    };

    loadInitialData();
  }, [loadingUser, searchParams]);

  const handleDownloadCertificate = async (certificate: Certificate) => {
    setDownloadingIds((prev) => new Set(prev).add(certificate.id));

    try {
      if (!certificate.pdf_Path) {
        throw new Error("No se encontró la ruta del certificado PDF");
      }

      const response = await fetch(
        `/api/certificates/download?path=${encodeURIComponent(
          certificate.pdf_Path
        )}`
      );

      if (!response.ok) {
        const errorData = await response.json().catch(() => ({}));
        throw new Error(
          errorData.message || "Error al descargar el certificado"
        );
      }

      const blob = await response.blob();
      const url = window.URL.createObjectURL(blob);
      const a = document.createElement("a");
      a.style.display = "none";
      a.href = url;
      a.download = `certificado-${certificate.name
        .replace(/\s+/g, "-")
        .toLowerCase()}.pdf`;
      document.body.appendChild(a);
      a.click();
      window.URL.revokeObjectURL(url);
      document.body.removeChild(a);
    } catch (err) {
      console.error("Error al descargar:", err);
      const errorMessage =
        err instanceof Error
          ? err.message
          : "Error desconocido al descargar el certificado";
      alert(errorMessage);
    } finally {
      setDownloadingIds((prev) => {
        const newSet = new Set(prev);
        newSet.delete(certificate.id);
        return newSet;
      });
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-16 w-16 border-4 border-yellow-500 border-t-transparent mx-auto mb-4"></div>
          <p className="text-gray-600 font-medium">Cargando certificados...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 flex items-center justify-center p-4">
        <div className="bg-white rounded-lg shadow-lg p-8 max-w-md w-full text-center">
          <AlertCircle className="h-16 w-16 text-red-500 mx-auto mb-4" />
          <h2 className="text-xl font-bold text-gray-800 mb-2">Error</h2>
          <p className="text-gray-600 mb-4">{error}</p>
          <button
            onClick={() => window.location.reload()}
            className="bg-yellow-500 hover:bg-yellow-600 text-white px-6 py-2 rounded-lg transition-colors"
          >
            Reintentar
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100">
      <div className="bg-white shadow-sm border-b">
        <div className="max-w-6xl mx-auto px-4 py-6">
          <div className="flex items-center gap-3">
            <Award className="h-8 w-8 text-yellow-600" />
            <div>
              <h1 className="text-2xl font-bold text-gray-800">
                Mis Certificados
              </h1>
              <p className="text-gray-600">
                {certificates.length} certificado
                {certificates.length !== 1 ? "s" : ""} disponible
                {certificates.length !== 1 ? "s" : ""}
              </p>
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-6xl mx-auto px-4 py-8">
        {certificates.length === 0 ? (
          <div className="bg-white rounded-xl shadow-sm p-12 text-center">
            <FileText className="h-16 w-16 text-gray-400 mx-auto mb-4" />
            <h3 className="text-xl font-semibold text-gray-800 mb-2">
              No hay certificados disponibles
            </h3>
            <p className="text-gray-600">
              Completa cursos para obtener tus certificados.
            </p>
          </div>
        ) : (
          <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
            {certificates.map((certificate, index) => (
              <div
                key={index}
                className="bg-white rounded-xl shadow-sm hover:shadow-lg hover:scale-105 transition-all duration-300 border border-gray-100 overflow-hidden group"
              >
                <div className="bg-gradient-to-r from-yellow-500 to-yellow-600/90 p-6 text-white">
                  <div className="flex items-center justify-between mb-3">
                    <Award className="h-8 w-8" />
                    <div className="bg-white/20 px-3 py-1 rounded-full text-sm font-medium">
                      ID: {certificate.course_ID}
                    </div>
                  </div>
                  <h3 className="text-xl font-bold leading-tight">
                    {certificate.name}
                  </h3>
                </div>

                <div className="p-6">
                  <div className="space-y-3 mb-6">
                    <div className="flex items-center gap-3 text-gray-600">
                      <BookOpen className="h-4 w-4 text-yellow-500" />
                      <span className="text-sm">
                        Curso ID: {certificate.course_ID}
                      </span>
                    </div>
                    <div className="flex items-center gap-3 text-gray-600">
                      <User className="h-4 w-4 text-yellow-500" />
                      <span className="text-sm">
                        Usuario: {certificate.username}
                      </span>
                    </div>
                    <div className="flex items-center gap-3 text-gray-600">
                      <Calendar className="h-4 w-4 text-yellow-500" />
                      <span className="text-sm">
                        Certificado obtenido:{" "}
                        {new Date(certificate.issue_Date).toLocaleDateString(
                          "es-MX",
                          {
                            year: "numeric",
                            month: "long",
                            day: "numeric",
                          }
                        )}
                      </span>
                    </div>
                  </div>

                  {owner && (
                    <button
                      onClick={() => handleDownloadCertificate(certificate)}
                      disabled={
                        downloadingIds.has(certificate.id) ||
                        !certificate.pdf_Path
                      }
                      className="cursor-pointer w-full flex items-center justify-center gap-2 bg-gradient-to-r from-yellow-500 to-yellow-600/90 hover:from-yellow-600 hover:to-yellow-700/90 text-white px-4 py-3 rounded-lg font-medium transition duration-200 disabled:opacity-50 disabled:cursor-not-allowed group-hover:shadow-md hover:scale-105"
                      title={
                        !certificate.pdf_Path
                          ? "PDF no disponible"
                          : "Descargar certificado PDF"
                      }
                    >
                      {downloadingIds.has(certificate.id) ? (
                        <>
                          <div className="animate-spin rounded-full h-4 w-4 border-2 border-white border-t-transparent"></div>
                          Descargando...
                        </>
                      ) : !certificate.pdf_Path ? (
                        <>
                          <AlertCircle className="h-4 w-4" />
                          PDF no disponible
                        </>
                      ) : (
                        <>
                          <Download className="h-4 w-4" />
                          Descargar PDF
                        </>
                      )}
                    </button>
                  )}
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
