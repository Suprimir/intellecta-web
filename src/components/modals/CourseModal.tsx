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
  closeModal: () => void;
}

export default function CourseModal({ uuid, closeModal }: CourseModalProps) {
  const [categories, setCategories] = useState<Category[]>([]);
  const [image, setImage] = useState("/coursesImages/defaultThumbnail.png");
  const [imageFile, setImageFile] = useState<File>();
  const [loading, setLoading] = useState(true);
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
    <div className="fixed inset-0 flex items-center justify-center bg-black/50">
      <form
        onSubmit={handleSaveCourse}
        className="bg-white w-full max-w-xl h-auto max-h-fit rounded-2xl p-6 flex flex-col overflow-auto"
      >
        {/* Encabezado */}
        <div className="flex justify-between items-center">
          <h1 className="font-extrabold text-lg">Nuevo curso</h1>
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
                className="text-gray-700 bg-gray-100 p-2 rounded-xl w-full"
              />
            </div>
            <div className="col-span-4">
              <p className="text-sm text-gray-600 mb-1 font-extrabold">
                Descripcion:
              </p>
              <textarea
                name="description"
                className="text-gray-700 bg-gray-100 p-2 rounded-xl w-full resize-none"
              />
            </div>

            <div className="col-span-4">
              <p className="text-sm text-gray-600 mb-1 font-extrabold">
                Precio:
              </p>
              <input
                type="number"
                name="price"
                className="text-gray-700 bg-gray-100 p-2 rounded-xl w-full"
              />
            </div>
            <div className="col-span-4">
              <p className="text-sm text-gray-600 mb-1 font-extrabold">
                Categoria:
              </p>
              <select
                name="category"
                className="text-gray-700 bg-gray-100 p-2 rounded-xl w-full"
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

            <div className="col-span-4">
              <p className="text-sm text-gray-600 mb-1 font-extrabold">
                Imagen:
              </p>
              <div className="bg-gray-100 rounded-2xl h-[30vh] p-4 relative overflow-hidden group">
                <Image
                  alt="Imagen del curso"
                  src={image}
                  fill
                  className="object-cover p-3 rounded-3xl"
                />
                <div className="absolute inset-0 bg-white/30 opacity-0 group-hover:opacity-100 transition duration-300 rounded-3xl flex items-center justify-center">
                  <label className="cursor-pointer bg-white p-2 rounded-full border-4">
                    <PencilIcon className="size-8 text-gray-700" />
                    <input
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
                  </label>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Boton de guardar los cambios :v */}
        <div className="flex justify-end">
          <button
            type="submit"
            className="cursor-pointer bg-green-400 inline-flex items-center p-2 gap-2 rounded-xl"
          >
            <ArrowDownTrayIcon className="size-6" />
            <span className="font-extrabold">Guardar cambios</span>
          </button>
        </div>
      </form>
    </div>
  );
}
