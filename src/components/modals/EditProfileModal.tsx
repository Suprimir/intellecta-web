"use client";

import { useState } from "react";
import {
  XMarkIcon,
  ArrowDownTrayIcon,
  CameraIcon,
} from "@heroicons/react/24/outline";
import Image from "next/image";
import { useAlert } from "@/libs/context/AlertContext";

interface EditProfileModal {
  user: any;
  closeModal: () => void;
}

export default function EditProfileModal({
  user,
  closeModal,
}: EditProfileModal) {
  const [image, setImage] = useState<string>();
  const [imageFile, setImageFile] = useState<File>();
  const { showAlert } = useAlert();

  const handleSaveUser = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const formData = new FormData(e.currentTarget);

    if (imageFile) {
      formData.append("file", imageFile);
    }

    const res = await fetch(`/api/profile/${user.uuid}`, {
      method: "PUT",
      body: formData,
    });

    const data = await res.json();
    if (res.status === 200) {
      showAlert(data.message, "success", "Usuario actualizad", 2000);
    } else {
      showAlert(data.message, "error", "Error", 2000);
    }
  };

  return (
    <div className="fixed inset-0 flex items-center justify-center bg-black/50">
      <form
        onSubmit={handleSaveUser}
        className="bg-white w-full max-w-xl h-auto rounded-2xl p-6 flex flex-col overflow-auto"
      >
        <div className="flex justify-between items-center">
          <h1 className="font-extrabold text-lg">Editar Perfil</h1>
          <XMarkIcon
            onClick={closeModal}
            className="size-6 bg-red-400 rounded-md cursor-pointer"
          />
        </div>

        <div className="my-6">
          <div className="grid grid-cols-2 gap-4">
            <div className="col-span-2">
              <p className="font-bold">Foto de perfil</p>
              <div className="flex justify-center mb-4">
                <div className="relative">
                  <div className="w-24 h-24 rounded-full overflow-hidden bg-gray-100 border-2 border-gray-200">
                    <Image
                      alt="Imagen de perfil"
                      src={
                        image ||
                        (user
                          ? user.profilePicture
                          : "/userImages/default.webp")
                      }
                      fill
                      className="object-cover p-1 rounded-full"
                    />

                    <label
                      htmlFor="profileImage"
                      className="cursor-pointer absolute bottom-0 right-0 bg-blue-500 hover:bg-blue-600 rounded-full p-1.5 shadow-lg transition-colors"
                    >
                      <CameraIcon className="size-4 text-white" />
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
              <p className="text-sm font-extrabold text-gray-600">Sobre mí:</p>
              <textarea
                name="bio"
                placeholder="Cuéntanos sobre ti..."
                rows={3}
                className="w-full bg-gray-100 p-2 rounded-xl resize-none transition-colors"
              />
            </div>
          </div>
        </div>

        <div className="flex justify-end">
          <button
            type="submit"
            className="cursor-pointer bg-green-400 inline-flex items-center p-2 gap-2 rounded-xl"
          >
            <ArrowDownTrayIcon className="size-6" />
            <span className="font-extrabold">Guardar</span>
          </button>
        </div>
      </form>
    </div>
  );
}
