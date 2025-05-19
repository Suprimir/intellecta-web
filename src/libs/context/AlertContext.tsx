"use client";

import React, { useState, useEffect, ReactNode, JSX } from "react";

type AlertType = "info" | "success" | "warning" | "error" | "teal";

interface Alert {
  id: string;
  message: string;
  type: AlertType;
  title: string;
  duration: number;
}

interface AlertContextType {
  showAlert: (
    message: string,
    type?: AlertType,
    title?: string,
    duration?: number
  ) => string;
  hideAlert: (id: string) => void;
}

interface AlertProviderProps {
  children: ReactNode;
}

interface AlertContainerProps {
  alerts: Alert[];
  onClose: (id: string) => void;
}

interface AlertProps {
  id: string;
  type: AlertType;
  title: string;
  message: string;
  onClose: (id: string) => void;
}

export const AlertContext = React.createContext<AlertContextType>({
  showAlert: () => "",
  hideAlert: () => {},
});

export function AlertProvider({ children }: AlertProviderProps): JSX.Element {
  const [alerts, setAlerts] = useState<Alert[]>([]);

  const showAlert = (
    message: string,
    type: AlertType = "info",
    title = "",
    duration = 5000
  ): string => {
    const id = Date.now().toString();
    const newAlert: Alert = { id, message, type, title, duration };
    setAlerts((prev) => [...prev, newAlert]);

    if (duration) {
      setTimeout(() => {
        hideAlert(id);
      }, duration);
    }

    return id;
  };

  const hideAlert = (id: string): void => {
    setAlerts((prev) => prev.filter((alert) => alert.id !== id));
  };

  return (
    <AlertContext.Provider value={{ showAlert, hideAlert }}>
      {children}
      <AlertContainer alerts={alerts} onClose={hideAlert} />
    </AlertContext.Provider>
  );
}

export function useAlert(): AlertContextType {
  const context = React.useContext(AlertContext);
  if (!context) {
    throw new Error("useAlert debe ser usado dentro de un AlertProvider");
  }
  return context;
}

function AlertContainer({
  alerts,
  onClose,
}: AlertContainerProps): JSX.Element | null {
  if (!alerts.length) return null;

  return (
    <div className="fixed bottom-4 right-4 z-50 flex flex-col gap-2 max-w-md">
      {alerts.map((alert) => (
        <Alert
          key={alert.id}
          id={alert.id}
          type={alert.type}
          title={alert.title}
          message={alert.message}
          onClose={onClose}
        />
      ))}
    </div>
  );
}

function Alert({
  id,
  type = "info",
  title,
  message,
  onClose,
}: AlertProps): JSX.Element {
  const [isExiting, setIsExiting] = useState<boolean>(false);

  useEffect(() => {
    // Animación de entrada
    const element = document.getElementById(`alert-${id}`);
    if (element) {
      element.style.opacity = "0";
      element.style.transform = "translateY(-20px)";
      setTimeout(() => {
        element.style.opacity = "1";
        element.style.transform = "translateY(0)";
      }, 10);
    }
  }, [id]);

  const handleClose = (): void => {
    setIsExiting(true);
    setTimeout(() => {
      onClose(id);
    }, 300);
  };

  // Configurar los estilos según el tipo de alerta
  const alertStyles: Record<AlertType, string> = {
    info: "bg-blue-100 border-blue-500 text-blue-900",
    success: "bg-green-100 border-green-500 text-green-900",
    warning: "bg-yellow-100 border-yellow-500 text-yellow-900",
    error: "bg-red-100 border-red-500 text-red-900",
    teal: "bg-teal-100 border-teal-500 text-teal-900",
  };

  const iconStyles: Record<AlertType, string> = {
    info: "text-blue-500",
    success: "text-green-500",
    warning: "text-yellow-500",
    error: "text-red-500",
    teal: "text-teal-500",
  };

  return (
    <div
      id={`alert-${id}`}
      className={`border-t-4 rounded-b px-4 py-3 shadow-md transition-all duration-300 ${
        alertStyles[type] || alertStyles.info
      } ${isExiting ? "opacity-0 translate-y-[-20px]" : "opacity-100"}`}
      role="alert"
    >
      <div className="flex justify-between">
        <div className="flex">
          <div className="py-1">
            <svg
              className={`fill-current h-6 w-6 mr-4 ${
                iconStyles[type] || iconStyles.info
              }`}
              xmlns="http://www.w3.org/2000/svg"
              viewBox="0 0 20 20"
            >
              <path d="M2.93 17.07A10 10 0 1 1 17.07 2.93 10 10 0 0 1 2.93 17.07zm12.73-1.41A8 8 0 1 0 4.34 4.34a8 8 0 0 0 11.32 11.32zM9 11V9h2v6H9v-4zm0-6h2v2H9V5z" />
            </svg>
          </div>
          <div>
            {title && <p className="font-bold">{title}</p>}
            <p className="text-sm">{message}</p>
          </div>
        </div>
        <button
          onClick={handleClose}
          className="text-gray-500 hover:text-gray-700"
        >
          <svg
            className="h-4 w-4"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth="2"
              d="M6 18L18 6M6 6l12 12"
            />
          </svg>
        </button>
      </div>
    </div>
  );
}
