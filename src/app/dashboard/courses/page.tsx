"use client";

import { useEffect, useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { useAuth } from "@/libs/context/AuthContext";
import { Content, ContentCompleted, CourseWithUnitContent } from "@/types/api";
import {
  Play,
  FileText,
  Clock,
  Users,
  BookOpen,
  ChevronRight,
  ChevronDown,
  Menu,
  X,
} from "lucide-react";
import {
  ArrowLeftCircleIcon,
  CheckCircleIcon,
} from "@heroicons/react/24/outline";
import { useAlert } from "@/libs/context/AlertContext";

export default function CourseContentPage() {
  const searchParams = useSearchParams();
  const courseId = searchParams.get("courseId");

  const [course, setCourse] = useState<CourseWithUnitContent>();
  const [selectedUnitIndex, setSelectedUnitIndex] = useState<number | null>(
    null
  );
  const [contentsIds, setContentsIds] = useState<number[]>([]);
  const [selectedContent, setSelectedContent] = useState<Content | null>(null);
  const [contentCompleted, setContentCompleted] = useState<number[]>([]);
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [progress, setProgress] = useState<number>(0);
  const [loading, setLoading] = useState(true);
  const router = useRouter();
  const { user, loadingUser } = useAuth();
  const { showAlert } = useAlert();

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

        const resContent = await fetch(
          `/api/courses/getByID/${courseId}/contents`
        );
        const dataContent: CourseWithUnitContent[] = await resContent.json();
        setCourse(dataContent[0]);

        const contentsIds: any[] = dataContent[0].units.flatMap((unit) =>
          unit.contents.map((content) => content.id)
        );
        setContentsIds(contentsIds);

        const resCompleted = await fetch(
          `/api/contents/getByUUID/${user?.uuid}/completed`,
          {
            method: "POST",
            body: JSON.stringify({ contentsIds }),
          }
        );
        const dataCompleted: ContentCompleted[] = await resCompleted.json();
        const contentCompletedIds = dataCompleted.flatMap(
          (contentCompleted) => contentCompleted.content_ID
        );
        setContentCompleted(contentCompletedIds);

        const totalContents = contentsIds.length;
        const completedContents = contentCompletedIds.length;
        const progressPercentage =
          totalContents > 0 ? (completedContents / totalContents) * 100 : 0;
        setProgress(progressPercentage);
      } catch (err) {
        console.error("Error al iniciar los datos:", err);
      } finally {
        setLoading(false);
      }
    };

    loadInitialData();
  }, [courseId, loadingUser]);

  const getCompleted = async () => {
    const resCompleted = await fetch(
      `/api/contents/getByUUID/${user?.uuid}/completed`,
      {
        method: "POST",
        body: JSON.stringify({ contentsIds }),
      }
    );
    const dataCompleted: ContentCompleted[] = await resCompleted.json();
    const contentCompletedIds = dataCompleted.flatMap(
      (contentCompleted) => contentCompleted.content_ID
    );
    setContentCompleted(contentCompletedIds);

    return contentCompletedIds;
  };

  const handleGetCertificate = async () => {
    // Aqui ira la logica para obtener certificado
  };

  const handleUnitClick = (index: number) => {
    setSelectedUnitIndex(selectedUnitIndex === index ? null : index);
    if (selectedUnitIndex !== index) {
      setSelectedContent(null);
    }
  };

  const handleContentClick = (content: Content) => {
    if (content.id !== undefined && contentCompleted.includes(content.id)) {
      content.isMarked = true;
    } else {
      content.isMarked = false;
    }

    setSelectedContent(content);
    setSidebarOpen(false);
  };
  const getTotalDuration = () => {
    return (
      course?.units.reduce((acc, unit) => acc + unit.contents.length * 8, 0) ||
      0
    );
  };

  const handleMarkCompleted = async (content: Content) => {
    const endpoint = content.isMarked
      ? `/api/contents/getByID/${content.id}/completed/remove`
      : `/api/contents/getByID/${content.id}/completed/add`;

    const res = await fetch(endpoint, {
      method: "POST",
      body: JSON.stringify({
        uuid: user?.uuid,
      }),
    });

    const data = await res.json();

    if (res.ok) {
      try {
        showAlert(data.message, "success", "Exito", 2000);
      } catch (err) {
        console.error(err);
      } finally {
        content.isMarked = !content.isMarked;
        const totalContents = contentsIds.length;
        const completedContents = (await getCompleted()).length;
        const progressPercentage =
          totalContents > 0 ? (completedContents / totalContents) * 100 : 0;
        setProgress(progressPercentage);
      }
    } else {
      showAlert(data.message, "error", "Error", 2000);
    }
  };

  const getContentIcon = (content: Content) => {
    if (content.media_Path) return <Play className="w-4 h-4 text-amber-600" />;
    if (content.document_Path)
      return <FileText className="w-4 h-4 text-green-600" />;
    return <BookOpen className="w-4 h-4 text-emerald-600" />;
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-purple-50 to-blue-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-amber-600 mx-auto mb-4"></div>
          <p className="text-gray-600 font-medium">
            Cargando contenido del curso...
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-100">
      <header className="bg-white shadow-sm border-b">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            <div className="flex items-center">
              <button
                onClick={() => router.push("/dashboard")}
                className="cursor-pointer me-6 text-white bg-red-400 p-1 rounded-full"
              >
                <ArrowLeftCircleIcon className="size-8" />
              </button>

              <button
                onClick={() => setSidebarOpen(!sidebarOpen)}
                className="lg:hidden p-2 rounded-md text-gray-600 hover:text-gray-900 hover:bg-gray-100"
              >
                {sidebarOpen ? (
                  <X className="w-6 h-6" />
                ) : (
                  <Menu className="w-6 h-6" />
                )}
              </button>
              <div className="ml-4 lg:ml-0">
                <h1 className="text-xl font-semibold text-gray-900 truncate">
                  {course?.name}
                </h1>
                <div className="flex items-center space-x-4 mt-1">
                  <div className="flex items-center text-sm text-gray-500">
                    <Clock className="w-4 h-4 mr-1" />
                    {getTotalDuration()} min
                  </div>
                </div>
              </div>
            </div>
            <div className="flex items-center space-x-4">
              {progress === 100 && (
                <button
                  onClick={() => router.push("/dashboard")}
                  className="cursor-pointer me-6 text-white bg-green-400 p-1 rounded-full"
                >
                  <CheckCircleIcon className="size-8" />
                </button>
              )}
              <div className="hidden sm:block">
                <div className="text-sm text-gray-600">Progreso del curso</div>
                <div className="w-32 bg-gray-200 rounded-full h-2 mt-1">
                  <div
                    className="bg-gradient-to-r from-purple-600 to-blue-600 h-2 rounded-full transition-all duration-300"
                    style={{ width: `${progress}%` }}
                  ></div>
                </div>
                <div className="text-xs text-gray-500 mt-1">
                  {Math.round(progress)}% completado
                </div>
              </div>
            </div>
          </div>
        </div>
      </header>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
        <div className="flex flex-col lg:flex-row gap-6">
          <main className="flex-1 lg:order-2">
            <div className="bg-white rounded-xl shadow-sm overflow-hidden">
              {selectedContent ? (
                <div className="p-6">
                  {/* Video/Media */}
                  {selectedContent.media_Path && (
                    <div className="relative mb-6">
                      <video
                        controls
                        className="w-full h-64 sm:h-80 lg:h-96 rounded-lg bg-black"
                      >
                        <source
                          src={selectedContent.media_Path}
                          type="video/mp4"
                        />
                        Tu navegador no soporta la reproducción de video.
                      </video>
                    </div>
                  )}

                  <div className="space-y-4">
                    <div className="flex items-start justify-between">
                      <div className="flex-1">
                        <div className="flex items-center space-x-2 mb-2">
                          {getContentIcon(selectedContent)}
                          <span className="text-sm font-medium text-gray-500">
                            Lección {selectedContent.id}
                          </span>
                        </div>
                        <h2 className="text-2xl font-bold text-gray-900 mb-3">
                          {selectedContent.title}
                        </h2>
                      </div>
                    </div>

                    <div className="prose max-w-none">
                      <p className="text-gray-700 leading-relaxed text-lg">
                        {selectedContent.description}
                      </p>
                    </div>

                    {/* Documento adjunto */}
                    {selectedContent.document_Path && (
                      <div className="mt-6 p-4 bg-teal-50 rounded-lg border border-teal-200">
                        <div className="flex items-center justify-between">
                          <div className="flex items-center space-x-3">
                            <FileText className="w-8 h-8 text-teal-600" />
                            <div>
                              <h3 className="font-medium text-teal-900">
                                Material
                              </h3>
                              <p className="text-sm text-teal-700">
                                Documento disponible para descarga
                              </p>
                            </div>
                          </div>
                          <a
                            href={selectedContent.document_Path}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="bg-teal-600 text-white px-4 py-2 rounded-lg hover:bg-teal-700 transition-colors font-medium"
                          >
                            Descargar
                          </a>
                        </div>
                      </div>
                    )}
                  </div>
                  <div className="flex justify-center items-center pt-6">
                    <button
                      onClick={() => handleMarkCompleted(selectedContent)}
                      className="cursor-pointer shadow-md bg-amber-200 text-amber-800 font-extrabold px-6 py-2 rounded-lg hover:bg-amber-300 transition-all"
                    >
                      {selectedContent.isMarked
                        ? "Desmarcar como completada"
                        : "Marcar como completada"}
                    </button>
                  </div>
                </div>
              ) : (
                <div className="p-12 text-center">
                  <BookOpen className="w-16 h-16 text-gray-300 mx-auto mb-4" />
                  <h3 className="text-xl font-medium text-gray-900 mb-2">
                    Bienvenido al curso
                  </h3>
                  <p className="text-gray-600 max-w-md mx-auto">
                    Selecciona una lección del menú lateral para comenzar tu
                    aprendizaje. Cada lección incluye videos y documentos.
                  </p>
                </div>
              )}
            </div>
          </main>

          <aside
            className={`lg:w-80 lg:order-1 ${
              sidebarOpen ? "block" : "hidden lg:block"
            }`}
          >
            <div className="bg-white rounded-xl shadow-sm overflow-hidden">
              <div className="p-6 bg-yellow-600 text-white">
                <h2 className="text-lg font-semibold mb-2">
                  Contenido del curso
                </h2>
                <div className="text-purple-100 text-sm">
                  {course?.units.reduce(
                    (acc, unit) => acc + unit.contents.length,
                    0
                  )}{" "}
                  lecciones
                </div>
              </div>

              <div className="max-h-96 lg:max-h-[calc(100vh-12rem)] overflow-y-auto">
                {course?.units.map((unit, index) => (
                  <div
                    key={unit.id}
                    className="border-b border-gray-100 last:border-b-0"
                  >
                    <button
                      onClick={() => handleUnitClick(index)}
                      className="w-full p-4 text-left hover:bg-gray-50 transition-colors group"
                    >
                      <div className="flex items-center justify-between">
                        <div className="flex-1">
                          <div className="flex items-center space-x-2">
                            <span className="text-xs font-medium text-yellow-600 bg-yellow-100 px-2 py-1 rounded">
                              Sección {unit.unit_number}
                            </span>
                          </div>
                          <h3 className="font-medium text-gray-900 mt-1 group-hover:text-yellow-600 transition-colors">
                            {unit.title}
                          </h3>
                          <p className="text-sm text-gray-500 mt-1">
                            {unit.contents.length} lección
                            {unit.contents.length !== 1 ? "es" : ""}
                          </p>
                        </div>
                        <div className="ml-2">
                          {selectedUnitIndex === index ? (
                            <ChevronDown className="w-5 h-5 text-gray-400" />
                          ) : (
                            <ChevronRight className="w-5 h-5 text-gray-400" />
                          )}
                        </div>
                      </div>
                    </button>

                    {selectedUnitIndex === index && (
                      <div className="bg-gray-50">
                        {unit.contents.map((content) => (
                          <button
                            key={content.id}
                            onClick={() => handleContentClick(content)}
                            className={`w-full p-4 pl-8 text-left hover:bg-white transition-colors border-l-4 ${
                              selectedContent?.id === content.id
                                ? "border-yellow-600 bg-white"
                                : "border-transparent"
                            }`}
                          >
                            <div className="flex items-start space-x-3">
                              {getContentIcon(content)}
                              <div className="flex-1 min-w-0">
                                <h4
                                  className={`font-medium ${
                                    selectedContent?.id === content.id
                                      ? "text-yellow-600"
                                      : "text-gray-900"
                                  } truncate`}
                                >
                                  {content.title}
                                </h4>
                                <p className="text-sm text-gray-500 mt-1">
                                  {content.media_Path ? "Video" : "Lectura"}
                                </p>
                              </div>
                            </div>
                          </button>
                        ))}
                      </div>
                    )}
                  </div>
                ))}
              </div>
            </div>
          </aside>
        </div>
      </div>

      {/* Overlay para móvil */}
      {sidebarOpen && (
        <div
          className="fixed inset-0 bg-black bg-opacity-50 z-40 lg:hidden"
          onClick={() => setSidebarOpen(false)}
        />
      )}
    </div>
  );
}
