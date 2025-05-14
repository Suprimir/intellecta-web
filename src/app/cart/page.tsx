"use client";

import { useEffect, useState } from "react";
import {
  Trash2,
  ArrowLeft,
  ShoppingBag,
  Truck,
  Tag,
  CreditCard,
  BookOpen,
  Play,
  Award,
} from "lucide-react";
import { Course, ShoppingCartDetails } from "@/types/api";

export default function ShoppingCart() {
  const [cartItems, setCartItems] = useState<Course[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    try {
      const getCartItems = async () => {
        const responseCartItems = await fetch("/api/cart/courses");
        const objectCartItems: Course[] = await responseCartItems.json();
        console.log(objectCartItems);
        setCartItems(objectCartItems);
      };

      getCartItems();
      setLoading(false);
    } catch (error: unknown) {
      console.error((error as Error).message);
    }
  }, []);
  const removeItem = async (id: number) => {
    const responseRemoveItem = await fetch("/api/cart/remove", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        courseId: id,
      }),
    });
    setCartItems(cartItems.filter((item) => item.id !== id));
  };

  const subtotal = 1;
  const discount = 1; // 10% discount
  const total = 1;

  if (loading) {
    return <div>Cargando...</div>;
  }

  return (
    <div className="min-h-screen bg-slate-200">
      <div className="max-w-7xl mx-auto px-4 py-8">
        <div className="flex items-center mb-8">
          <button className="flex items-center text-gray-600 hover:text-gray-900">
            <ArrowLeft className="mr-2 h-5 w-5" />
            <span>Cursos</span>
          </button>
          <h1 className="text-2xl font-bold text-gray-900 ml-auto">Carrito</h1>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          <div className="lg:col-span-2">
            <div className="bg-white rounded-lg shadow-md p-6 mb-6">
              <div className="flex items-center justify-between pb-4 border-b border-gray-200">
                <h2 className="text-lg font-semibold text-teal-600">
                  Cursos Seleccionados ({cartItems.length})
                </h2>
                <BookOpen className="h-6 w-6 text-gray-500" />
              </div>

              {cartItems.length === 0 ? (
                <div className="py-12 text-center">
                  <BookOpen className="h-16 w-16 mx-auto text-gray-300 mb-4" />
                  <p className="text-gray-500 mb-4">Tu Carrito esta vacio.</p>
                  <button className="bg-blue-600 text-white px-6 py-2 rounded-md hover:bg-blue-700">
                    Ver Cursos
                  </button>
                </div>
              ) : (
                <div className="divide-y divide-gray-200">
                  {cartItems.map((item) => (
                    <div
                      key={item.id}
                      className="py-6 flex flex-col sm:flex-row"
                    >
                      <div className="flex-shrink-0 w-full sm:w-24 h-24 mb-4 sm:mb-0 relative group">
                        <img
                          src={item.image}
                          alt={item.name}
                          className="w-full h-full object-cover rounded-md"
                        />
                        <div className="absolute inset-0 bg-black bg-opacity-50 opacity-0 group-hover:opacity-100 rounded-md flex items-center justify-center transition-opacity">
                          <Play className="h-8 w-8 text-white" />
                        </div>
                      </div>

                      <div className="flex-1 ml-0 sm:ml-6">
                        <div className="flex flex-col sm:flex-row sm:justify-between mb-2">
                          <h3 className="text-base font-medium text-gray-900">
                            {item.name}
                          </h3>
                          <p className="text-base font-semibold text-gray-900">
                            ${1}
                          </p>
                        </div>

                        <div className="flex flex-col sm:flex-row sm:justify-between items-start sm:items-center text-sm text-gray-500">
                          <div>
                            <p className="flex items-center">
                              <Award className="h-4 w-4 mr-1" /> Instructor:{" "}
                              {item.uuid}
                            </p>
                            <p className="flex items-center">
                              <Tag className="h-4 w-4 mr-1" />{" "}
                              {item.category_ID}
                            </p>
                            <p className="flex items-center">
                              <Play className="h-4 w-4 mr-1" />
                              {(item.duration / 60 / 60).toFixed(2)} horas de
                              contenido
                            </p>
                          </div>

                          <div className="flex items-center mt-4 sm:mt-0">
                            <button
                              onClick={() => removeItem(item.id)}
                              className="ml-6 text-red-500 hover:text-red-700 flex items-center"
                            >
                              <Trash2 className="h-5 w-5 mr-1" />
                              <span>Eliminar</span>
                            </button>
                          </div>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>

            <div className="bg-white rounded-lg shadow-md p-6">
              <h2 className="text-lg font-semibold text-teal-600 mb-4">
                Accesos al Curso
              </h2>
              <div className="space-y-4">
                <div className="flex items-center justify-between p-4 border border-gray-200 rounded-md bg-blue-50 border-blue-200">
                  <div className="flex items-center">
                    <div className="h-5 w-5 rounded-full bg-blue-600 mr-3 flex items-center justify-center">
                      <div className="h-2 w-2 rounded-full bg-white"></div>
                    </div>
                    <div>
                      <p className="font-medium">Acceso de por Vida</p>
                      <p className="text-sm text-gray-500">
                        Accede al contenido del curso para siempre.
                      </p>
                    </div>
                  </div>
                  <span className="font-semibold text-green-600">Incluido</span>
                </div>

                <div className="flex items-center justify-between p-4 border border-gray-200 rounded-md">
                  <div className="flex items-center">
                    <div className="h-5 w-5 rounded-full border border-gray-300 mr-3"></div>
                    <div>
                      <p className="font-medium">Certificado</p>
                      <p className="text-sm text-gray-500">
                        Recibe un certificado valido por cada curso.
                      </p>
                    </div>
                  </div>
                  <span className="font-semibold">+$9.99</span>
                </div>
              </div>
            </div>
          </div>

          <div>
            <div className="bg-white rounded-lg shadow-md p-6 sticky top-8">
              <h2 className="text-lg font-semibold text-gray-700 mb-6">
                Resumen de Orden
              </h2>

              <div className="space-y-4">
                <div className="flex justify-between text-base">
                  <span className="text-gray-500">Subtotal</span>
                  <span className="font-medium">${subtotal.toFixed(2)}</span>
                </div>

                <div className="flex justify-between text-base">
                  <span className="text-gray-500">Descuento (10%)</span>
                  <span className="font-medium text-green-600">
                    -${discount.toFixed(2)}
                  </span>
                </div>

                <div className="border-t border-gray-200 pt-4 mt-4">
                  <div className="flex justify-between text-lg font-semibold">
                    <span>Total</span>
                    <span>${total.toFixed(2)}</span>
                  </div>
                  <p className="text-sm text-gray-500 mt-1">Un solo pago</p>
                </div>
              </div>

              <div className="mt-8">
                {/*<div className="flex items-center justify-between mb-4 pb-4 border-b border-gray-200">
                 
                    <div className="flex items-center">
                      <Tag className="h-5 w-5 text-gray-500 mr-2" />
                     <span className="text-gray-600">Add a promo code</span>
                    </div>
                 
                  <span className="text-blue-600 cursor-pointer hover:text-blue-800">
                    Apply
                  </span>
                </div>*/}
                <button className="w-full cursor-pointer bg-yellow-500 text-white py-3 px-4 rounded-md hover:bg-yellow-600 flex items-center justify-center">
                  <CreditCard className="mr-2 h-5 w-5" />
                  Comprar Ahora
                </button>

                <div className="mt-4 flex items-center justify-center text-sm text-gray-500">
                  <BookOpen className="h-4 w-4 mr-1" />
                  <span>Acceso al instante despues del pago</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
