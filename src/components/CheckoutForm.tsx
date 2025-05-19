"use client";
import { useState, useEffect } from "react";
import {
  useStripe,
  useElements,
  PaymentElement,
} from "@stripe/react-stripe-js";
import convertToSubcurrency from "@/libs/convertToSubcurrency";
import { Course, PurchasedCourses } from "@/types/api";
import { useAuth } from "@/libs/context/AuthContext";

interface CheckoutFormProps {
  amount: number;
  cartItems: Course[];
  onSuccess: () => void;
}

export default function CheckoutForm({
  amount,
  cartItems,
  onSuccess,
}: CheckoutFormProps) {
  const stripe = useStripe();
  const elements = useElements();
  const [errorMessage, setErrorMessage] = useState<string>();
  const [loading, setLoading] = useState(false);
  const [clientSecret, setClientSecret] = useState("");
  const { user } = useAuth();

  useEffect(() => {
    const uuid = user?.uuid;
    fetch("/api/checkout", {
      method: "POST",
      headers: {
        "Content-Type": "application/json", // Corregido "applications" a "application"
      },
      body: JSON.stringify({
        amount: amount,
        courses: cartItems,
        uuid,
      }),
    })
      .then((response) => response.json())
      .then((data) => setClientSecret(data.clientSecret));
  }, [amount, cartItems, user?.uuid]);

  const handleSubmit = async (event: React.FormEvent) => {
    event.preventDefault();
    setLoading(true);

    if (!stripe || !elements) {
      setLoading(false);
      return;
    }

    const { error: submitError } = await elements.submit();
    if (submitError) {
      setErrorMessage(submitError.message);
      setLoading(false);
      return;
    }

    const { error } = await stripe.confirmPayment({
      elements,
      clientSecret,
      confirmParams: {
        return_url: `http://localhost:3000/payment-succes?amount=${amount}`,
      },
    });

    if (error) {
      setErrorMessage(error.message);
    } else {
      onSuccess(); // Llama a onSuccess cuando el pago se completa correctamente
    }
    setLoading(false);
  };

  if (!clientSecret) {
    return (
      <div className="flex items-center justify-center py-4">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-gray-900"></div>
      </div>
    );
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      <PaymentElement />
      {errorMessage && (
        <div className="text-red-500 text-sm">{errorMessage}</div>
      )}
      <button
        disabled={loading || !stripe || !elements}
        className="bg-yellow-400 hover:bg-yellow-500 w-full py-3 rounded flex items-center justify-center text-gray-800 font-medium"
      >
        {loading ? (
          <div className="flex items-center gap-2">
            <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-gray-800"></div>
            Procesando...
          </div>
        ) : (
          <span>Comprar Ahora</span>
        )}
      </button>
    </form>
  );
}
