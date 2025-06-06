import { useState } from "react";
import { TrashIcon, XMarkIcon } from "@heroicons/react/24/outline";

interface ConfirmationModalProps {
  visible: boolean;
  onClose: () => void;
  onConfirm: () => void;
  name: string;
}

export default function ConfirmationModal({
  visible,
  onClose,
  onConfirm,
  name,
}: ConfirmationModalProps) {
  if (!visible) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50">
      <div className="bg-white rounded-lg shadow-lg w-full max-w-md p-6">
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-lg font-bold text-gray-800">
            Confirmar eliminación
          </h2>
          <button
            onClick={onClose}
            className="text-gray-500 hover:text-gray-700 transition-colors"
          >
            <XMarkIcon className="size-6" />
          </button>
        </div>
        <p className="text-gray-600">
          ¿Estás seguro de que deseas eliminar <strong>{name}</strong>? Esta
          acción no se puede deshacer.
        </p>
        <div className="flex justify-end gap-4 mt-6">
          <button
            onClick={onClose}
            className="px-4 py-2 rounded-md bg-gray-200 hover:bg-gray-300 text-gray-800 transition-colors"
          >
            Cancelar
          </button>
          <button
            onClick={onConfirm}
            className="px-4 py-2 rounded-md bg-red-500 hover:bg-red-600 text-white transition-colors"
          >
            Eliminar
          </button>
        </div>
      </div>
    </div>
  );
}
