"use client";

import { useEffect, useState } from "react";
import { useSearchParams } from "next/navigation";
import { useAuth } from "@/libs/context/AuthContext";

interface Content {
  id: number;
  unit_ID: number;
  title: string;
  description: string;
  media_Path: string;
  document_Path: string;
}

interface Unit {
  id: number;
  unit_number: number;
  course_ID: number;
  title: string;
  contents: Content[];
}

export default function CourseContentPage() {
  const searchParams = useSearchParams();
  const courseId = searchParams.get("courseId");

  const [units, setUnits] = useState<Unit[]>([]);
  const [selectedUnitIndex, setSelectedUnitIndex] = useState<number | null>(
    null
  );
  const [selectedContent, setSelectedContent] = useState<Content | null>(null);
  const [loading, setLoading] = useState(true);

  const { user, loadingUser } = useAuth();
  useEffect(() => {
    const loadInitialData = async () => {
      try {
        const res = await fetch(`/api/courses/${courseId}/contents`);
        const data = await res.json();

        setUnits(data);
      } catch (err) {
        console.error("Error al iniciar los datos:", err);
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
  }, [courseId]);

  const handleUnitClick = (index: number) => {
    setSelectedUnitIndex(index);
    setSelectedContent(null);
  };

  const handleContentClick = (content: Content) => {
    setSelectedContent(content);
  };

  return (
    <div className="flex h-screen">
      <div className="flex-1 p-6 overflow-y-auto bg-gray-100">
        {selectedContent ? (
          <div>
            <h2 className="text-2xl font-bold mb-2">{selectedContent.title}</h2>
            <p className="mb-4 text-gray-700">{selectedContent.description}</p>
            {selectedContent.media_Path && (
              <video
                controls
                className="w-[1280px] h-[568px] mb-4 rounded-2xl bg-black"
              >
                <source src={selectedContent.media_Path} type="video/mp4" />
                Tu navegador no soporta la reproducción de video.
              </video>
            )}
            {selectedContent.document_Path && (
              <a
                href={selectedContent.document_Path}
                target="_blank"
                rel="noopener noreferrer"
                className="text-blue-600 hover:underline"
              >
                Ver documento adjunto
              </a>
            )}
          </div>
        ) : (
          <p className="text-gray-600">
            Selecciona un contenido para ver los detalles.
          </p>
        )}
      </div>

      <div className="w-1/3 overflow-y-auto p-4 bg-gray-100">
        <div className="bg-gray-200 h-[100%] p-8 rounded-2xl">
          <h2 className="text-xl font-bold mb-4">Contenido del curso</h2>
          {units.map((unit, index) => (
            <div key={unit.id} className="mb-4">
              <button
                onClick={() => handleUnitClick(index)}
                className="text-left w-full font-semibold text-purple-700 hover:underline"
              >
                Sección {unit.unit_number}: {unit.title}
              </button>
              {selectedUnitIndex === index && (
                <ul className="ml-4 mt-2">
                  {unit.contents.map((content) => (
                    <li key={content.id}>
                      <button
                        onClick={() => handleContentClick(content)}
                        className="text-sm text-gray-800 hover:text-purple-700"
                      >
                        - {content.title}
                      </button>
                    </li>
                  ))}
                </ul>
              )}
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
