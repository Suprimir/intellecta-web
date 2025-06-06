import { useAlert } from "@/libs/context/AlertContext";
import { UnitCourse } from "@/types/api";
import { ArrowDownTrayIcon, XMarkIcon } from "@heroicons/react/24/outline";
import { useEffect, useState } from "react";

interface UnitCourseModalProps {
  uuid: string;
  courseId?: number;
  mode: string | null;
  unit: UnitCourse | null;
  visible?: boolean;
  refreshData: () => void;
  closeModal: () => void;
}

export default function UnitCourseModal({
  uuid,
  courseId,
  mode,
  unit,
  visible,
  refreshData,
  closeModal,
}: UnitCourseModalProps) {
  const [isVisible, setIsVisible] = useState(false);
  const { showAlert } = useAlert();

  useEffect(() => {
    if (visible) {
      setIsVisible(true);
    } else {
      setTimeout(() => setIsVisible(false), 200);
    }
  }, [visible]);

  const handleSaveUnitCourse = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    const formData = new FormData(e.currentTarget);

    formData.append("uuid", uuid);

    if (mode === "create") {
      if (courseId) {
        formData.append("courseId", courseId.toString());
      }
      const res = await fetch("/api/units_courses", {
        method: "POST",
        body: formData,
      });
      const data = await res.json();
      if (res.status === 200) {
        showAlert(data.message, "success", "Actualizado", 2000);
      } else {
        showAlert(data.message, "error", "Error", 2000);
      }
    } else {
      if (unit) {
        formData.append("unitId", String(unit?.id));
      }
      const res = await fetch("/api/units_courses", {
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
        onSubmit={handleSaveUnitCourse}
        className="bg-white w-full max-w-xl h-auto rounded-2xl flex flex-col overflow-auto"
      >
        <div className="border-b shadow-md">
          <div className="flex justify-between items-center p-4">
            <div className="flex items-center gap-2">
              <div className="cursor-pointer hover:bg-gray-100 rounded-full transition-colors duration-300 p-1">
                <XMarkIcon onClick={closeModal} className="size-8" />
              </div>
              <h1 className="font-extrabold text-lg">
                {mode === "create" ? "Crear Unidad" : "Editar Unidad"}
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

        {/* Contenido del formulario */}
        <div className="my-6 px-4">
          <div className="grid grid-cols-2 gap-4">
            <div className="col-span-2 border-1 border-gray-300 rounded-lg p-2">
              <label htmlFor="titleInput">
                <p className="text-sm text-gray-400">Titulo:</p>
              </label>
              <input
                id="titleInput"
                name="title"
                defaultValue={unit ? unit.title : ""}
                className="w-full focus:outline-none text-black"
              />
            </div>
            <div className="col-span-2 border-1 border-gray-300 rounded-lg p-2">
              <label htmlFor="unitNumberInput">
                <p className="text-sm text-gray-400">Unidad:</p>
              </label>
              <input
                id="unitNumberInput"
                name="unitNumber"
                type="number"
                defaultValue={unit ? unit.unit_number : ""}
                className="w-full focus:outline-none text-black"
              />
            </div>
          </div>
        </div>

        {/* Boton de guardar los cambios :v */}
      </form>
    </div>
  );
}
