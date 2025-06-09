import { useAlert } from "@/libs/context/AlertContext";
import { Ticket } from "@/types/api";
import { ArrowDownTrayIcon, XMarkIcon } from "@heroicons/react/24/outline";
import { useEffect, useState } from "react";

interface TicketModalProps {
  ticket?: Ticket;
  visible?: boolean;
  refreshData: () => void;
  closeModal: () => void;
}

export default function TicketModal({
  ticket,
  visible,
  refreshData,
  closeModal,
}: TicketModalProps) {
  const [isVisible, setIsVisible] = useState(false);
  const { showAlert } = useAlert();

  useEffect(() => {
    console.log(ticket);
    if (visible) {
      setIsVisible(true);
    } else {
      setTimeout(() => setIsVisible(false), 200);
    }
  }, [visible]);

  const handleSaveTicket = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    const action = (e.nativeEvent as SubmitEvent).submitter?.getAttribute(
      "data-action"
    );

    const formData = new FormData(e.currentTarget);

    formData.append("ticketId", String(ticket?.id));

    try {
      let endpoint = "";
      if (action === "in-process") {
        endpoint = `/api/support-tickets/in-process/`;
      } else if (action === "close") {
        endpoint = `/api/support-tickets/close/`;
      }

      if (endpoint) {
        const res = await fetch(endpoint, {
          method: "POST",
          body: formData,
        });

        if (res.ok) {
          showAlert(
            `El ticket ha sido marcado como ${
              action === "in-process" ? "en proceso" : "cerrado"
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
        onSubmit={handleSaveTicket}
        className="bg-white w-full max-w-xl h-auto rounded-2xl flex flex-col overflow-auto"
      >
        <div className="border-b shadow-md">
          <div className="flex justify-between items-center p-4">
            <div className="flex items-center gap-2">
              <div className="cursor-pointer hover:bg-gray-100 rounded-full transition-colors duration-300 p-1">
                <XMarkIcon onClick={closeModal} className="size-8" />
              </div>
              <h1 className="font-extrabold text-lg">Ticket</h1>
            </div>
            <div className="flex items-center gap-2">
              <button
                type="submit"
                data-action="in-process"
                className="flex text-white items-center gap-2 p-2 rounded-lg cursor-pointer bg-gradient-to-br from-blue-700 to-blue-800 hover:from-blue-800 hover:to-blue-900 transition-colors duration-300 shadow-md"
              >
                <ArrowDownTrayIcon className="size-6" />
                <span className="font-extrabold">Procesar</span>
              </button>
              <button
                type="submit"
                data-action="close"
                className="flex text-white items-center gap-2 p-2 rounded-lg cursor-pointer bg-gradient-to-br from-gray-700 to-gray-800 hover:from-gray-800 hover:to-gray-900 transition-colors duration-300 shadow-md"
              >
                <ArrowDownTrayIcon className="size-6" />
                <span className="font-extrabold">Cerrar</span>
              </button>
            </div>
          </div>
        </div>

        <div className="my-6 px-4">
          <div className="grid grid-cols-2 gap-4">
            <div className="col-span-2 border-1 border-gray-300 rounded-lg p-2">
              <p className="text-sm text-gray-400">Tipo de Problema:</p>
              <input
                type="text"
                readOnly
                defaultValue={ticket ? ticket.problem_Category : ""}
                className="resize-none w-full focus:outline-none text-black"
              />
            </div>
            <div className="col-span-2 border-1 border-gray-300 rounded-lg p-2">
              <p className="text-sm text-gray-400">Descripcion del Problema:</p>
              <textarea
                readOnly
                rows={8}
                defaultValue={ticket ? ticket.problem_Description : ""}
                className="resize-none w-full focus:outline-none text-black"
              />
            </div>
            <div className="col-span-2 border-1 border-gray-300 rounded-lg p-2">
              <p className="text-sm text-gray-400">Solucion:</p>
              <textarea
                name="resolution"
                placeholder="Escribe la solución aquí..."
                rows={8}
                className="resize-none w-full focus:outline-none text-black"
              />
            </div>
          </div>
        </div>
      </form>
    </div>
  );
}
