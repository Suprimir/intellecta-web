"use client";

import { useState } from "react";
import {
  XMarkIcon,
  ArrowDownTrayIcon,
  PencilIcon,
} from "@heroicons/react/24/outline";
import Image from "next/image";
import { useAlert } from "@/libs/context/AlertContext";
import { User } from "@/types/api";

interface UserModalProps {
  mode: string | null;
  user: User | null;
  closeModal: () => void;
}

export default function UserModal({ mode, user, closeModal }: UserModalProps) {
  const [image, setImage] = useState("/userImages/default.webp");
  const [imageFile, setImageFile] = useState<File>();
  const { showAlert } = useAlert();

  const handleSaveUser = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const formData = new FormData(e.currentTarget);

    if (imageFile) {
      formData.append("file", imageFile);
    }

    if (mode === "create") {
      const res = await fetch("/api/users", {
        method: "POST",
        body: formData,
      });
      const data = await res.json();
      if (res.status === 200) {
        showAlert(data.message, "success", "Usuario creado", 2000);
      } else {
        showAlert(data.message, "error", "Error", 2000);
      }
    } else {
      if (user) {
        formData.append("uuid", user.uuid);
      }

      const res = await fetch("/api/users", {
        method: "PUT",
        body: formData,
      });
      const data = await res.json();
      if (res.status === 200) {
        showAlert(data.message, "success", "Usuario actualizad", 2000);
      } else {
        showAlert(data.message, "error", "Error", 2000);
      }
    }
  };

  return (
    <div className="fixed inset-0 flex items-center justify-center bg-black/50">
      <form
        onSubmit={handleSaveUser}
        className="bg-white w-full max-w-xl h-auto rounded-2xl p-6 flex flex-col overflow-auto"
      >
        <div className="flex justify-between items-center">
          <h1 className="font-extrabold text-lg">
            {mode === "edit" ? "Editar usuario" : "Nuevo usuario"}
          </h1>
          <XMarkIcon
            onClick={closeModal}
            className="size-6 bg-red-400 rounded-md cursor-pointer"
          />
        </div>

        <div className="my-6">
          <div className="grid grid-cols-2 gap-4">
            <div className="col-span-1">
              <p className="text-sm font-extrabold text-gray-600">Nombre:</p>
              <input
                name="name"
                placeholder={user ? user.name : ""}
                className="w-full bg-gray-100 p-2 rounded-xl"
              />
            </div>
            <div className="col-span-1">
              <p className="text-sm font-extrabold text-gray-600">Apellido:</p>
              <input
                name="last_name"
                placeholder={user ? user.last_name : ""}
                className="w-full bg-gray-100 p-2 rounded-xl"
              />
            </div>
            <div className="col-span-2">
              <p className="text-sm font-extrabold text-gray-600">
                Nombre de usuario:
              </p>
              <input
                name="username"
                placeholder={user ? user.username : ""}
                className="w-full bg-gray-100 p-2 rounded-xl"
              />
            </div>
            <div className="col-span-2">
              <p className="text-sm font-extrabold text-gray-600">Correo:</p>
              <input
                type="email"
                name="email"
                placeholder={user ? user.email : ""}
                className="w-full bg-gray-100 p-2 rounded-xl"
              />
            </div>

            <div className="col-span-2">
              <p className="text-sm font-extrabold text-gray-600">
                Contraseña:
              </p>
              <input
                type="password"
                name="password"
                className="w-full bg-gray-100 p-2 rounded-xl"
              />
            </div>
            {!user && (
              <div className="col-span-2">
                <p className="text-sm font-extrabold text-gray-600">Rol:</p>
                <select
                  name="role"
                  required
                  className="w-full bg-gray-100 p-2 rounded-xl"
                >
                  <option value="">Selecciona un rol</option>
                  <option value="student">Estudiante</option>
                  <option value="instructor">Instructor</option>
                  <option value="admin">Administrador</option>
                </select>
              </div>
            )}
            <div className="col-span-2">
              <p className="text-sm font-extrabold text-gray-600">
                Foto de perfil:
              </p>
              <div className="bg-gray-100 rounded-2xl h-52 p-4 relative overflow-hidden group">
                <Image
                  alt="Imagen de perfil"
                  src={
                    user && user.profilePicture !== null
                      ? user.profilePicture
                      : image
                  }
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
                          setImageFile(file);
                        }
                      }}
                    />
                  </label>
                </div>
              </div>
            </div>
          </div>
        </div>

        <div className="flex justify-end">
          <button
            type="submit"
            className="cursor-pointer bg-green-400 inline-flex items-center p-2 gap-2 rounded-xl"
          >
            <ArrowDownTrayIcon className="size-6" />
            <span className="font-extrabold">Guardar usuario</span>
          </button>
        </div>
      </form>
    </div>
  );
}
