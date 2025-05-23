import { UnitCourse } from "@/types/api";
import { ArrowDownTrayIcon, XMarkIcon } from "@heroicons/react/24/outline";

interface UnitCourseModalProps {
  mode: string | null;
  unit: UnitCourse | null;
  closeModal: () => void;
}

export default function UnitCourseModal({
  mode,
  unit,
  closeModal,
}: UnitCourseModalProps) {
  return (
    <div className="fixed inset-0 flex items-center justify-center bg-black/50">
      <form className="bg-white w-[30%] h-[40%] rounded-2xl p-6 flex flex-col">
        {/* Encabezado */}
        <div className="flex justify-between items-center">
          <h1 className="font-extrabold text-lg">
            {mode === "edit" ? "Editar unidad" : "Nueva unidad"}
          </h1>
          <XMarkIcon
            onClick={closeModal}
            className="size-6 bg-red-400 rounded-md cursor-pointer"
          />
        </div>

        {/* Contenido del formulario */}
        <div className="my-6 flex-1">
          <div className="grid grid-cols-3 gap-4">
            <div className="col-span-3">
              <p className="text-sm text-gray-600 mb-1 font-extrabold">
                Título:
              </p>
              <input
                type="text"
                name="title"
                placeholder={`${unit ? unit.title : ""}`}
                className="text-gray-700 bg-gray-100 p-2 rounded-xl w-full"
              />
            </div>
            <div className="col-span-1">
              <p className="text-sm text-gray-600 mb-1 font-extrabold">
                Unidad:
              </p>
              <input
                type="number"
                name="unitNumber"
                placeholder={`${unit ? unit.unit_number : ""}`}
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
    </div>
  );
}
