"use client";

import { useState, useEffect } from "react";
import {
  XMarkIcon,
  ArrowDownTrayIcon,
  PencilIcon,
} from "@heroicons/react/24/outline";
import Image from "next/image";
import { useAlert } from "@/libs/context/AlertContext";
import { User } from "@/types/api";
import { CameraIcon } from "lucide-react";

interface UserModalProps {
  mode: string | null;
  user: User | null;
  visible?: boolean;
  refreshTable: () => void;
  closeModal: () => void;
}

export default function UserModal({
  mode,
  user,
  visible,
  refreshTable,
  closeModal,
}: UserModalProps) {
  const [image, setImage] = useState("/userImages/default.webp");
  const [imageFile, setImageFile] = useState<File>();
  const [isVisible, setIsVisible] = useState(false);
  const { showAlert } = useAlert();

  useEffect(() => {
    if (visible) {
      setIsVisible(true);
    } else {
      setTimeout(() => setIsVisible(false), 200);
    }
  }, [visible]);

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
    <div
      className={`fixed inset-0 flex items-center justify-center bg-black/50 transition-opacity duration-200 ${
        visible && isVisible ? "opacity-100" : "opacity-0"
      } ${isVisible || visible ? "block" : "hidden"}`}
    >
      <form
        onSubmit={handleSaveUser}
        className="bg-white w-full max-w-xl h-auto rounded-2xl flex flex-col overflow-auto"
      >
        <div className="border-b shadow-md">
          <div className="flex justify-between items-center p-4">
            <div className="flex items-center gap-2">
              <div className="cursor-pointer hover:bg-gray-100 rounded-full transition-colors duration-300 p-1">
                <XMarkIcon onClick={closeModal} className="size-8" />
              </div>
              <h1 className="font-extrabold text-lg">
                {mode === "create" ? "Crear Usuario" : "Editar Usuario"}
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
          <div className="grid grid-cols-2 gap-4">
            <div className="col-span-2">
              <div className="flex justify-center mb-4">
                <div className="relative">
                  <div className="w-24 h-24 rounded-full overflow-hidden bg-gray-100 border-2 border-gray-200">
                    <Image
                      alt="Imagen de perfil"
                      src={
                        image ||
                        (user?.profilePicture
                          ? user.profilePicture
                          : "/userImages/default.webp")
                      }
                      fill
                      className="object-cover p-1 rounded-full"
                    />

                    <label
                      htmlFor="profileImage"
                      className="cursor-pointer absolute bottom-0 right-0 bg-blue-500 hover:bg-blue-600 rounded-full p-1.5 shadow-lg transition-colors duration-200 flex items-center justify-center"
                    >
                      <CameraIcon className="size-4 hover:size-6 transition-all text-white" />
                    </label>
                    <input
                      id="profileImage"
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
                  </div>
                </div>
              </div>
            </div>
            <div className="col-span-1 border-1 border-gray-300 rounded-lg p-2">
              <label htmlFor="nameInput">
                <p className="text-sm text-gray-400">Nombre:</p>
              </label>
              <input
                id="nameInput"
                name="name"
                defaultValue={user ? user.name : ""}
                className="w-full focus:outline-none text-black"
              />
            </div>

            <div className="col-span-1 border-1 border-gray-300 rounded-lg p-2">
              <label htmlFor="lastNameInput">
                <p className="text-sm text-gray-400">Apellido:</p>
              </label>
              <input
                id="lastNameInput"
                name="last_name"
                defaultValue={user ? user.last_name : ""}
                className="w-full focus:outline-none text-black"
              />
            </div>

            <div className="col-span-2 border-1 border-gray-300 rounded-lg p-2">
              <label htmlFor="usernameInput">
                <p className="text-sm text-gray-400">Nombre de usuario:</p>
              </label>
              <input
                id="usernameInput"
                name="username"
                defaultValue={user ? user.username : ""}
                className="w-full focus:outline-none text-black"
              />
            </div>

            <div className="col-span-2 border-1 border-gray-300 rounded-lg p-2">
              <label htmlFor="emailInput">
                <p className="text-sm text-gray-400">Correo:</p>
              </label>
              <input
                id="emailInput"
                name="email"
                defaultValue={user ? user.email : ""}
                className="w-full focus:outline-none text-black"
              />
            </div>

            <div className="col-span-2 border-1 border-gray-300 rounded-lg p-2">
              <label htmlFor="passwordInput">
                <p className="text-sm text-gray-400">Contraseña:</p>
              </label>
              <input
                id="passwordInput"
                name="password"
                className="w-full focus:outline-none text-black"
              />
            </div>

            {!user && (
              <div className="col-span-2 border-1 border-gray-300 rounded-lg p-2">
                <label htmlFor="rolSelect">
                  <p className="text-sm text-gray-400">Rol:</p>
                </label>
                <select
                  id="rolSelect"
                  name="role"
                  required
                  className="w-full focus:outline-none text-black"
                >
                  <option value="">Selecciona un rol</option>
                  <option value="student">Estudiante</option>
                  <option value="instructor">Instructor</option>
                  <option value="admin">Administrador</option>
                </select>
              </div>
            )}
          </div>
        </div>
      </form>
    </div>
  );
}
