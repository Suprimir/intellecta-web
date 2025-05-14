"use client";

import { useAuth } from "@/libs/context/AuthContext";
import { Course } from "@/types/api";
import { useState, useEffect } from "react";
import { ShoppingCart } from "lucide-react";

interface CourseCardProps {
  course: Course;
  nameMaxLength?: number;
  descriptionMaxLength?: number;
  isInCart?: boolean;
  isInMainPage?: boolean;
}

export default function CourseCard({
  course,
  nameMaxLength = 25,
  descriptionMaxLength = 80,
  isInCart,
  isInMainPage,
}: CourseCardProps) {
  const [isLoading, setIsLoading] = useState(false);
  const [isAdded, setIsAdded] = useState(isInCart);

  const truncateText = (text: string, maxLength: number) => {
    if (text.length <= maxLength) return text;
    return text.slice(0, maxLength) + "...";
  };

  const handleCartAction = async () => {
    setIsLoading(true);

    try {
      const endpoint = isAdded ? "/api/cart/remove" : "/api/cart/add";

      const response = await fetch(endpoint, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          courseId: course.id,
        }),
      });

      if (!response.ok) {
        throw new Error(
          `Error al ${isAdded ? "remover del" : "agregar al"} carrito`
        );
      }

      setIsAdded(!isAdded);
    } catch (error) {
      console.error(
        `Error al ${isAdded ? "remover del" : "agregar al"} carrito:`,
        error
      );
      alert(
        `No se pudo ${isAdded ? "remover" : "agregar"} el curso ${
          isAdded ? "del" : "al"
        } carrito`
      );
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="border border-gray-200 rounded-lg overflow-hidden bg-white shadow-sm hover:shadow-md transition-shadow">
      <div className="relative">
        <img
          src={course.image}
          alt={course.name}
          className="w-full h-52 object-cover"
        />
      </div>
      <div className="p-4">
        <h3 className="font-bold text-lg mb-1 line-clamp-1" title={course.name}>
          {truncateText(course.name, nameMaxLength)}
        </h3>
        <p
          className="text-sm text-gray-700 mb-2 line-clamp-2"
          title={course.description}
        >
          {truncateText(course.description, descriptionMaxLength)}
        </p>
        <p className="text-xs text-gray-600 mb-3 truncate" title={course.uuid}>
          {course.uuid}
        </p>

        <div className="flex items-center text-sm mb-2">
          <span className="font-bold text-amber-700">5</span>
          <div className="flex text-amber-400 ml-1">
            {"★".repeat(Math.floor(5))}
            {5 % 1 > 0 ? "½" : ""}
            {"☆".repeat(5 - Math.ceil(5))}
          </div>
        </div>

        <div className="flex flex-wrap text-xs text-gray-700 mb-3 gap-1">
          <span>{(course.duration / 60 / 60).toFixed(2)} total hours</span>
        </div>
        {!isInMainPage && (
          <button
            onClick={handleCartAction}
            disabled={isLoading}
            className={`w-full py-2 px-4 rounded-md flex items-center justify-center gap-2 font-medium transition-all duration-200 ${
              isAdded
                ? "bg-red-500 text-white hover:bg-red-600"
                : "bg-blue-600 text-white hover:bg-blue-700"
            } disabled:opacity-70 disabled:cursor-not-allowed`}
          >
            <ShoppingCart size={18} />
            {isLoading
              ? isAdded
                ? "Removiendo..."
                : "Agregando..."
              : isAdded
              ? "Remover del Carrito"
              : "Agregar al Carrito"}
          </button>
        )}
      </div>
    </div>
  );
}
