"use client";

import { useEffect, useState } from "react";
import { Content } from "@/types/api";
import {
  ArrowDownTrayIcon,
  EyeIcon,
  FolderArrowDownIcon,
  XMarkIcon,
} from "@heroicons/react/24/outline";

interface ContentCourseModalProps {
  mode: string | null;
  content: Content | null;
  closeModal: () => void;
}

export default function ContentCourseModal({
  mode,
  content,
  closeModal,
}: ContentCourseModalProps) {
  const [selectedDoc, setSelectedDoc] = useState<string | undefined>(undefined);
  const [selectedVideo, setSelectedVideo] = useState<string | undefined>(
    undefined
  );
  const [preview, setPreview] = useState(false);

  useEffect(() => {
    if (content) {
      setSelectedDoc(content?.document_Path);
      setSelectedVideo(content?.media_Path);
    }
  }, []);

  const handlePreview = (e: React.MouseEvent<HTMLButtonElement>) => {
    e.preventDefault();
    setPreview(true);
  };

  return (
    <div className="fixed inset-0 flex items-center justify-center bg-black/50">
      <form className="bg-white w-[30%] h-[70%] rounded-2xl p-6 flex flex-col">
        {/* Encabezado */}
        <div className="flex justify-between items-center">
          <h1 className="font-extrabold text-lg">
            {mode === "edit" ? "Editar contenido" : "Nuevo contenido"}
          </h1>
          <XMarkIcon
            onClick={closeModal}
            className="size-6 bg-red-400 rounded-md cursor-pointer"
          />
        </div>

        {/* Contenido del formulario */}
        <div className="my-6 flex-1">
          <div className="grid grid-cols-4 gap-4">
            {/* titulo input */}
            <div className="col-span-4">
              <p className="text-sm text-gray-600 mb-1 font-extrabold">
                Título:
              </p>
              <input
                type="text"
                name="title"
                placeholder={`${content ? content.title : ""}`}
                className="text-gray-700 bg-gray-100 p-2 rounded-xl w-full"
              />
            </div>
            <div className="col-span-4">
              <p className="text-sm text-gray-600 mb-1 font-extrabold">
                Descripcion:
              </p>
              <textarea
                name="description"
                placeholder={`${content ? content.description : ""}`}
                className="text-gray-700 bg-gray-100 p-2 rounded-xl w-full resize-none"
              />
            </div>
            <div className="col-span-2">
              <p className="text-sm text-gray-600 mb-1 font-extrabold">
                Documento:
              </p>

              <label
                htmlFor="document_Path"
                className="flex flex-col items-center justify-center w-full h-40 border-2 border-dashed border-gray-300 rounded-xl cursor-pointer hover:bg-gray-50 transition"
              >
                <FolderArrowDownIcon className="size-8" />
                <span className="text-sm text-gray-600 font-semibold">
                  {selectedDoc && (
                    <p className="text-xs text-green-600 mt-1 font-semibold text-center">
                      {selectedDoc}
                    </p>
                  )}
                </span>
                <span className="text-xs text-gray-400">PDF/DOCX</span>
              </label>

              <input
                id="document_Path"
                name="document_Path"
                type="file"
                className="hidden"
                accept=".pdf,.doc,.docx"
                onChange={(e) =>
                  setSelectedDoc(e.target.files?.[0]?.name || undefined)
                }
              />
            </div>

            {/* Video input */}
            <div className="col-span-2">
              <p className="text-sm text-gray-600 mb-1 font-extrabold">
                Video:
              </p>

              <label
                htmlFor="video_Path"
                className="flex flex-col items-center justify-center w-full h-40 border-2 border-dashed border-gray-300 rounded-xl cursor-pointer hover:bg-gray-50 transition"
              >
                <FolderArrowDownIcon className="size-8" />
                <span className="text-sm text-gray-600 font-semibold">
                  {selectedVideo && (
                    <p className="text-xs text-green-600 mt-1 font-semibold text-center">
                      {selectedVideo}
                    </p>
                  )}
                </span>
                <span className="text-xs text-gray-400">MP4</span>
              </label>

              <input
                id="video_Path"
                name="video_Path"
                type="file"
                className="hidden"
                accept="video/mp4"
                onChange={(e) =>
                  setSelectedVideo(e.target.files?.[0]?.name || undefined)
                }
              />
              {selectedVideo && (
                <div className="flex justify-center w-full m-2">
                  <button
                    onClick={(e) => handlePreview(e)}
                    className="cursor-pointer bg-blue-200 p-1 rounded-md font-extrabold inline-flex gap-1"
                  >
                    <EyeIcon className="size-6" />
                    Preview
                  </button>
                </div>
              )}
            </div>

            <div className="col-span-4">
              <p className="text-sm text-gray-600 mb-1 font-extrabold">
                Orden:
              </p>
              <input
                type="number"
                name="order_number"
                placeholder={`${content ? content.order_number : ""}`}
                className="text-gray-700 bg-gray-100 p-2 rounded-xl w-full"
              />
            </div>
          </div>
        </div>

        {/* Boton de guardar los cambios :v */}
        <div className="flex justify-end">
          <button
            type="submit"
            className="bg-green-400 inline-flex items-center p-2 gap-2 rounded-xl"
          >
            <ArrowDownTrayIcon className="size-6" />
            <span className="font-extrabold">Guardar cambios</span>
          </button>
        </div>
      </form>
      {preview && (
        <div className="fixed inset-0 flex items-center justify-center bg-black/50">
          <div className="bg-white w-[60%] h-[70%] rounded-2xl p-6">
            <div className="flex w-full justify-end">
              <button
                onClick={() => {
                  setPreview(false);
                }}
                className="cursor-pointer p-2 bg-red-400 inline-flex gap-1 rounded-xl mb-4"
              >
                <XMarkIcon className="size-6" />
                Salir
              </button>
            </div>
            <video
              src={selectedVideo}
              controls
              className="bg-black w-[100%] h-[90%] rounded-xl"
            ></video>
          </div>
        </div>
      )}
    </div>
  );
}
