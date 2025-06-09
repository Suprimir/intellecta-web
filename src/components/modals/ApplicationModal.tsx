import { useAlert } from "@/libs/context/AlertContext";
import { InstructorApplications } from "@/types/api";
import { ArrowDownTrayIcon, XMarkIcon } from "@heroicons/react/24/outline";
import { useEffect, useState } from "react";

interface ApplicationModalProps {
  application?: InstructorApplications;
  visible?: boolean;
  refreshData: () => void;
  closeModal: () => void;
}

export default function ApplicationModal({
  application,
  visible,
  refreshData,
  closeModal,
}: ApplicationModalProps) {
  const [isVisible, setIsVisible] = useState(false);
  const { showAlert } = useAlert();

  useEffect(() => {
    if (visible) {
      setIsVisible(true);
    } else {
      setTimeout(() => setIsVisible(false), 200);
    }
  }, [visible]);

  const handleSaveApplication = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    const action = (e.nativeEvent as SubmitEvent).submitter?.getAttribute(
      "data-action"
    );

    try {
      let endpoint = "";
      if (action === "accept") {
        endpoint = `/api/applications/accept/`;
      } else if (action === "reject") {
        endpoint = `/api/applications/reject/`;
      }

      if (endpoint) {
        const res = await fetch(endpoint, {
          method: "POST",
          body: JSON.stringify({
            applicationId: application?.id,
            uuid: application?.user_ID,
          }),
          headers: {
            "Content-Type": "application/json",
          },
        });

        if (res.ok) {
          showAlert(
            `La aplicación ha sido ${
              action === "accept" ? "aceptada" : "rechazada"
            } exitosamente.`,
            "success",
            "Operación exitosa",
            2000
          );
          refreshData();
          closeModal();
        } else {
          showAlert(
            "Hubo un error al procesar la solicitud.",
            "error",
            "Error",
            2000
          );
        }
      }
    } catch (error) {
      console.error("Error al procesar la solicitud:", error);
      showAlert(
        "Hubo un error al procesar la solicitud.",
        "error",
        "Error",
        2000
      );
    }
  };

  return (
    <div
      className={`fixed inset-0 flex items-center justify-center bg-black/50 transition-opacity duration-200 ${
        visible && isVisible ? "opacity-100" : "opacity-0"
      } ${isVisible || visible ? "block" : "hidden"}`}
    >
      <form
        onSubmit={handleSaveApplication}
        className="bg-white w-full max-w-xl h-auto rounded-2xl flex flex-col overflow-auto"
      >
        <div className="border-b shadow-md">
          <div className="flex justify-between items-center p-4">
            <div className="flex items-center gap-2">
              <div className="cursor-pointer hover:bg-gray-100 rounded-full transition-colors duration-300 p-1">
                <XMarkIcon onClick={closeModal} className="size-8" />
              </div>
              <h1 className="font-extrabold text-lg">Aplicacion</h1>
            </div>
            <div className="flex items-center gap-2">
              <button
                type="submit"
                data-action="accept"
                className="flex text-white items-center gap-2 p-2 rounded-lg cursor-pointer bg-gradient-to-br from-blue-700 to-blue-800 hover:from-blue-800 hover:to-blue-900 transition-colors duration-300 shadow-md"
              >
                <ArrowDownTrayIcon className="size-6" />
                <span className="font-extrabold">Aceptar</span>
              </button>
              <button
                type="submit"
                data-action="reject"
                className="flex text-white items-center gap-2 p-2 rounded-lg cursor-pointer bg-gradient-to-br from-gray-700 to-gray-800 hover:from-gray-800 hover:to-gray-900 transition-colors duration-300 shadow-md"
              >
                <ArrowDownTrayIcon className="size-6" />
                <span className="font-extrabold">Rechazar</span>
              </button>
            </div>
          </div>
        </div>

        <div className="my-6 px-4">
          <div className="grid grid-cols-2 gap-4">
            <div className="col-span-2 border-1 border-gray-300 rounded-lg p-2">
              <p className="text-sm text-gray-400">Experiencia Profesional:</p>
              <textarea
                readOnly
                rows={8}
                defaultValue={
                  application ? application.professional_Experience : ""
                }
                className="resize-none w-full focus:outline-none text-black"
              />
            </div>
            <div className="col-span-2 border-1 border-gray-300 rounded-lg p-2">
              <p className="text-sm text-gray-400">Especialidades:</p>
              <input
                type="text"
                defaultValue={application ? application.qualifications : ""}
                className="w-full focus:outline-none text-black"
              />
            </div>
          </div>
        </div>
      </form>
    </div>
  );
}
