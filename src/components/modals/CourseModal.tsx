"use client";

import { useEffect, useState } from "react";
import { Category } from "@/types/api";
import {
  ArrowDownTrayIcon,
  PencilIcon,
  XMarkIcon,
} from "@heroicons/react/24/outline";
import Image from "next/image";
import { useAlert } from "@/libs/context/AlertContext";

interface CourseModalProps {
  uuid: string;
  visible?: boolean;
  refreshTable: () => void;
  closeModal: () => void;
}

export default function CourseModal({
  uuid,
  visible,
  refreshTable,
  closeModal,
}: CourseModalProps) {
  const [categories, setCategories] = useState<Category[]>([]);
  const [image, setImage] = useState("/coursesImages/defaultThumbnail.png");
  const [imageFile, setImageFile] = useState<File>();
  const [loading, setLoading] = useState(true);
  const [isVisible, setIsVisible] = useState(false);
  const { showAlert } = useAlert();

  useEffect(() => {
    const loadInitialData = async () => {
      try {
        const res = await fetch("/api/categories");
        const categories: Category[] = await res.json();

        setCategories(categories);
      } catch (err) {
        console.error("Error al inciar los datos:", err);
      } finally {
        setLoading(false);
      }
    };

    loadInitialData();
  }, []);

  useEffect(() => {
    if (visible) {
      setIsVisible(true);
    } else {
      setTimeout(() => setIsVisible(false), 200);
    }
  }, [visible]);

  const handleSaveCourse = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    const formData = new FormData(e.currentTarget);

    formData.append("uuid", uuid);

    if (imageFile) {
      formData.append("file", imageFile);
    }

    const res = await fetch("/api/courses", {
      method: "POST",
      body: formData,
    });

    const data = await res.json();
    if (res.status === 200) {
      showAlert(data.message, "success", "Actualizado", 2000);
    } else {
      showAlert(data.message, "error", "Error", 2000);
    }
  };

  if (loading) {
    return <></>;
  }

  return (
    <div
      className={`fixed inset-0 flex items-center justify-center bg-black/50 transition-opacity duration-200 z-10 ${
        visible && isVisible ? "opacity-100" : "opacity-0"
      } ${isVisible || visible ? "block" : "hidden"}`}
    >
      <form
        onSubmit={handleSaveCourse}
        className="bg-white w-full max-w-xl h-auto rounded-2xl flex flex-col overflow-auto"
      >
        <div className="border-b shadow-md">
          <div className="flex justify-between items-center p-4">
            <div className="flex items-center gap-2">
              <div className="cursor-pointer hover:bg-gray-100 rounded-full transition-colors duration-300 p-1">
                <XMarkIcon onClick={closeModal} className="size-8" />
              </div>
              <h1 className="font-extrabold text-lg">Crear Curso</h1>
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
          <div className="grid grid-cols-2 grid-rows-2 gap-4">
            <div className="col-span-1 row-span-2 border-1 relative border-gray-300 rounded-lg p-2">
              <label htmlFor="imageInput">
                <div className="overflow-hidden group ">
                  <Image
                    alt="Imagen del curso"
                    src={image}
                    fill
                    className="object-cover rounded-lg"
                  />
                  <input
                    id="imageInput"
                    type="file"
                    accept=".jpg,.jpeg,.png"
                    className="hidden"
                    onChange={(e) => {
                      const file = e.target.files?.[0];
                      if (file) {
                        const imageURL = URL.createObjectURL(file);
                        setImage(imageURL);
                        setImageFile(file || null);
                      }
                    }}
                  />
                </div>
              </label>
            </div>
            <div className="col-span-1 border-1 border-gray-300 rounded-lg p-2">
              <label htmlFor="titleInput">
                <p className="text-sm text-gray-400">Titulo:</p>
              </label>
              <input
                id="titleInput"
                name="title"
                type="text"
                className="w-full focus:outline-none text-black"
              />
            </div>
            <div className="col-span-1 border-1 border-gray-300 rounded-lg p-2">
              <label htmlFor="priceInput">
                <p className="text-sm text-gray-400">Precio:</p>
              </label>
              <input
                id="priceInput"
                name="price"
                type="number"
                className="w-full focus:outline-none text-black"
              />
            </div>
            <div className="col-span-2 row-span-2 border-1 border-gray-300 rounded-lg p-2">
              <label htmlFor="descriptionInput">
                <p className="text-sm text-gray-400">Descripcion:</p>
              </label>
              <textarea
                id="descriptionInput"
                name="description"
                className="w-full focus:outline-none text-black resize-none"
              />
            </div>
            <div className="col-span-2 border-1 border-gray-300 rounded-lg p-2">
              <label htmlFor="categoryInput">
                <p className="text-sm text-gray-400">Categoria:</p>
              </label>
              <select
                id="categoryInput"
                name="category"
                className="w-full focus:outline-none text-black"
                required
              >
                <option value="">Selecciona una categoría</option>
                {categories.map((cat) => (
                  <option key={cat.id} value={cat.id}>
                    {cat.description}
                  </option>
                ))}
              </select>
            </div>
          </div>
        </div>
      </form>
    </div>
  );
}
