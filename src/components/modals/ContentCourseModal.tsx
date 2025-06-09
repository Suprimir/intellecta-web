"use client";

import { useEffect, useState } from "react";
import { Content } from "@/types/api";
import {
  ArrowDownTrayIcon,
  EyeIcon,
  FolderArrowDownIcon,
  XMarkIcon,
} from "@heroicons/react/24/outline";
import { useAlert } from "@/libs/context/AlertContext";

interface ContentCourseModalProps {
  uuid: string;
  unitId?: number;
  mode: string | null;
  content: Content | null;
  visible?: boolean;
  refreshData: () => void;
  closeModal: () => void;
}

export default function ContentCourseModal({
  uuid,
  unitId,
  mode,
  content,
  visible,
  refreshData,
  closeModal,
}: ContentCourseModalProps) {
  const [isVisible, setIsVisible] = useState(false);
  const [selectedDoc, setSelectedDoc] = useState<string | undefined>(undefined);
  const [selectedVideo, setSelectedVideo] = useState<string | undefined>(
    undefined
  );
  const [preview, setPreview] = useState(false);
  const { showAlert } = useAlert();

  useEffect(() => {
    if (content) {
      setSelectedDoc(content?.document_Path);
      setSelectedVideo(content?.media_Path);
    }
  }, []);

  useEffect(() => {
    if (visible) {
      setIsVisible(true);
    } else {
      setTimeout(() => setIsVisible(false), 200);
    }
  }, [visible]);

  const handlePreview = (e: React.MouseEvent<HTMLButtonElement>) => {
    e.preventDefault();
    setPreview(true);
  };

  const handleSaveUnit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    const formData = new FormData(e.currentTarget);

    formData.append("uuid", uuid);

    if (mode === "create") {
      if (unitId) {
        formData.append("unitId", String(unitId));
      }
      const res = await fetch("/api/contents", {
        method: "POST",
        body: formData,
      });
      const data = await res.json();
      if (res.status === 200) {
        showAlert(data.message, "success", "Actualizado", 2000);
        refreshData();
        closeModal();
      } else {
        showAlert(data.message, "error", "Error", 2000);
      }
    } else {
      if (content) {
        formData.append("contentId", String(content.id));
      }
      const res = await fetch("/api/contents", {
        method: "PUT",
        body: formData,
      });
      const data = await res.json();
      if (res.status === 200) {
        showAlert(data.message, "success", "Actualizado", 2000);
        refreshData();
        closeModal();
      } else {
        showAlert(data.message, "error", "Error", 2000);
      }
    }
  };

  return (
    <div
      className={`fixed inset-0 flex items-center justify-center bg-black/50 transition-opacity duration-200 ${
        visible && isVisible ? "opacity-100" : "opacity-0"
      } ${isVisible || visible ? "block" : "hidden"}`}
    >
      <form
        onSubmit={handleSaveUnit}
        className="bg-white w-full max-w-xl h-auto rounded-2xl flex flex-col overflow-auto"
      >
        <div className="border-b shadow-md">
          <div className="flex justify-between items-center p-4">
            <div className="flex items-center gap-2">
              <div className="cursor-pointer hover:bg-gray-100 rounded-full transition-colors duration-300 p-1">
                <XMarkIcon onClick={closeModal} className="size-8" />
              </div>
              <h1 className="font-extrabold text-lg">
                {mode === "create" ? "Crear Contenido" : "Editar Contenido"}
              </h1>
            </div>
            <button
              type="submit"
              className="flex text-white items-center gap-2 p-2 rounded-lg cursor-pointer bg-gradient-to-br from-gray-700 to-gray-800 hover:from-gray-800 hover:to-gray-900 transition-colors duration-300 shadow-md"
            >
              <ArrowDownTrayIcon className="size-6" />
              <span className="font-extrabold">Guardar</span>
            </button>
          </div>
        </div>

        <div className="my-6 px-4">
          <div className="grid grid-cols-4 gap-4">
            <div className="col-span-4 border-1 border-gray-300 rounded-lg p-2">
              <label htmlFor="titleInput">
                <p className="text-sm text-gray-400">Titulo:</p>
              </label>
              <input
                id="titleInput"
                name="title"
                defaultValue={content ? content.title : ""}
                className="w-full focus:outline-none text-black"
              />
            </div>
            <div className="col-span-4 border-1 border-gray-300 rounded-lg p-2">
              <label htmlFor="descriptionInput">
                <p className="text-sm text-gray-400">Descripcion:</p>
              </label>
              <textarea
                id="descriptionInput"
                name="description"
                defaultValue={content ? content.description : ""}
                className="resize-none w-full focus:outline-none text-black"
              />
            </div>
            <div className="col-span-2 border-2 h-[12vh] border-dashed border-gray-300 rounded-xl cursor-pointer hover:bg-gray-50 transition">
              <label htmlFor="document_Path">
                <p className="text-sm text-gray-400 p-2">Documento:</p>

                <div className="flex flex-col items-center justify-center">
                  <FolderArrowDownIcon className="size-8" />
                  <span className="text-sm text-gray-600 font-semibold">
                    {selectedDoc && (
                      <p className="text-xs text-green-600 mt-1 font-semibold text-center">
                        {selectedDoc}
                      </p>
                    )}
                  </span>
                  <span className="text-xs text-gray-400">PDF/DOCX</span>
                </div>
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
            <div className="col-span-2 border-2 h-[12vh] border-dashed border-gray-300 rounded-xl cursor-pointer hover:bg-gray-50 transition">
              <label htmlFor="video_Path">
                <p className="text-sm text-gray-400 p-2">Video:</p>

                <div className="flex flex-col items-center justify-center">
                  <FolderArrowDownIcon className="size-8" />
                  <span className="text-sm text-gray-600 font-semibold">
                    {selectedVideo && (
                      <p className="text-xs text-green-600 mt-1 font-semibold text-center">
                        {selectedVideo}
                      </p>
                    )}
                  </span>
                  <span className="text-xs text-gray-400">MP4</span>{" "}
                </div>
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

            <div className="col-span-4 border-1 border-gray-300 rounded-lg p-2">
              <label htmlFor="orderNumberInput">
                <p className="text-sm text-gray-400 mb-1">Orden:</p>
              </label>
              <input
                id="orderNumberInput"
                type="number"
                name="orderNumber"
                defaultValue={content ? content.order_number : ""}
                className="w-full focus:outline-none text-black"
              />
            </div>
          </div>
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
