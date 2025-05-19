"use client";

import { useState, useEffect } from "react";
import Button from "@/components/common/Button";
import { useSearchParams, useRouter } from "next/navigation";
import { ResponseBody } from "@/types/api";

export default function PaymentSucces() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const payment_intent = searchParams.get("payment_intent");
  const [loading, setLoading] = useState(true);
  const [paymentStatus, setPaymentStatus] = useState("");
  const [responseData, setResponseData] = useState<ResponseBody>();

  useEffect(() => {
    const verifyPayment = async () => {
      if (!payment_intent) return;

      try {
        const response = await fetch(
          `/api/verify-payment?payment_intent=${payment_intent}`
        );

        const data: ResponseBody = await response.json();
        setResponseData(data);

        if (response.ok) {
          setPaymentStatus("success");
        } else {
          setPaymentStatus("failed");
        }
      } catch (error) {
        console.error("Error al verificar el pago:", error);
        setPaymentStatus("error");
      } finally {
        setLoading(false);
      }
    };

    if (payment_intent) {
      verifyPayment();
    } else {
      setLoading(false);
    }
  }, [payment_intent]);

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-yellow-400"></div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 flex items-center justify-center py-12">
      <div className="bg-white rounded-lg shadow-md p-8 max-w-md w-full">
        {paymentStatus === "success" ? (
          <>
            <div className="flex justify-center mb-6">
              <div className="bg-green-100 p-3 rounded-full">
                <svg
                  className="w-16 h-16 text-green-500"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth="2"
                    d="M5 13l4 4L19 7"
                  ></path>
                </svg>
              </div>
            </div>
            <h1 className="text-2xl font-bold text-center mb-4">
              ¡Pago completado con éxito!
            </h1>
            <p className="text-center text-gray-600 mb-6">
              Tu curso ya está disponible en tu cuenta. Puedes acceder a él de
              inmediato.
            </p>
          </>
        ) : (
          <>
            <div className="flex justify-center mb-6">
              <div className="bg-red-100 p-3 rounded-full">
                <svg
                  className="w-16 h-16 text-red-500"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth="2"
                    d="M6 18L18 6M6 6l12 12"
                  ></path>
                </svg>
              </div>
            </div>
            <h1 className="text-2xl font-bold text-center mb-4">
              Ocurrió un problema con tu pago
            </h1>
            <p className="text-center bg-gray-300 text-black rounded-xl font-bold p-4 mb-2">
              {responseData?.error}
            </p>
            <p className="text-center text-gray-600 mb-6">
              Por favor, intenta de nuevo o contacta a soporte si el problema
              persiste.
            </p>
          </>
        )}

        <div className="flex justify-center">
          <Button
            onClick={() => router.push("/dashboard")}
            text="Ir a mis cursos"
            className="bg-yellow-400 hover:bg-yellow-500 py-2 px-6 rounded text-gray-800 font-medium"
          />
        </div>
      </div>
    </div>
  );
}
