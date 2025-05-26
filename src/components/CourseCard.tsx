import { Course } from "@/types/api";
import { useState, useEffect } from "react";
import { ArrowRightIcon, ShoppingCartIcon } from "@heroicons/react/24/outline";
import { useAlert } from "@/libs/context/AlertContext";
import { useRouter } from "next/navigation";

interface CourseCardProps {
  course: Course;
  nameMaxLength?: number;
  descriptionMaxLength?: number;
  isInDashboard?: boolean;
  isInMainPage?: boolean;
}

export default function CourseCard({
  course,
  nameMaxLength = 25,
  descriptionMaxLength = 80,
  isInDashboard,
  isInMainPage,
}: CourseCardProps) {
  const [isLoading, setIsLoading] = useState(false);
  const [isAdded, setIsAdded] = useState(course.location === "cart");
  const router = useRouter();
  const { showAlert } = useAlert();

  useEffect(() => {
    setIsAdded(course.location === "cart");
  }, [course.location]);

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
        body: JSON.stringify({ courseId: course.id }),
      });

      if (!response.ok) {
        throw new Error("Error al procesar la solicitud");
      }

      setIsAdded(!isAdded);
    } catch (error) {
      console.error(error);
      showAlert(
        "Debes estar loggeado para realizar esta accion.",
        "error",
        "Error",
        2000
      );
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="bg-white rounded-2xl shadow hover:shadow-md transition-all overflow-hidden border border-gray-200 flex flex-col h-full">
      <div className="relative">
        <img
          src={course.image}
          alt={course.name}
          className="w-full h-48 object-cover"
        />
      </div>
      <div className="p-5 flex flex-col flex-grow">
        <h3
          className="font-semibold text-lg text-gray-800 mb-1 line-clamp-1"
          title={course.name}
        >
          {truncateText(course.name, nameMaxLength)}
        </h3>
        <p
          className="text-sm text-gray-600 mb-2 line-clamp-2"
          title={course.description}
        >
          {truncateText(course.description, descriptionMaxLength)}
        </p>

        <div className="text-xs text-gray-500 mb-2 truncate">
          {course.instructor}
        </div>

        {!isInMainPage &&
          (course.location === "cart" || course.location === "") && (
            <div className="flex flex-col flex-grow">
              <div className="flex items-center text-sm mb-2">
                <span className="font-bold text-amber-700">
                  {course.rating}
                </span>
                <div className="flex text-amber-400 ml-1">
                  {"★".repeat(Math.floor(course.rating))}
                  {5 % 1 > 0 ? "½" : ""}
                  {"☆".repeat(5 - Math.ceil(course.rating))}
                </div>
              </div>

              <div className="text-xs text-gray-600 mb-3">
                {(course.duration / 60 / 60).toFixed(2)} horas totales
              </div>

              <div className="text-right text-base font-bold text-teal-600 mb-3">
                MX${course.price}
              </div>

              <div className="mt-auto">
                <button
                  onClick={handleCartAction}
                  disabled={isLoading}
                  className={`cursor-pointer w-full py-2 px-4 rounded-md flex items-center justify-center gap-2 font-medium transition-all duration-200 ${
                    isAdded
                      ? "bg-black hover:bg-[#3d3d3d] text-white"
                      : "bg-[#ffd558] hover:bg-[#ffe9a8] text-black"
                  } disabled:opacity-70 disabled:cursor-not-allowed`}
                >
                  <ShoppingCartIcon className="size-6" />
                  {isLoading
                    ? isAdded
                      ? "Removiendo..."
                      : "Agregando..."
                    : isAdded
                    ? "Remover del Carrito"
                    : "Agregar al Carrito"}
                </button>
              </div>
            </div>
          )}

        {(course.location === "purchased" || isInDashboard) && (
          <div className="flex flex-col flex-grow">
            <div className="flex items-center text-sm mb-2">
              <span className="font-bold text-amber-700">{course.rating}</span>
              <div className="flex text-amber-400 ml-1">
                {"★".repeat(Math.floor(course.rating))}
                {5 % 1 > 0 ? "½" : ""}
                {"☆".repeat(5 - Math.ceil(course.rating))}
              </div>
            </div>

            <div className="text-xs text-gray-600 mb-3">
              {(course.duration / 60 / 60).toFixed(2)} horas totales
            </div>

            <div className="mt-auto">
              <button
                onClick={() =>
                  router.push(`/dashboard/courses?courseId=${course.id}`)
                }
                className="cursor-pointer w-full py-2 px-4 rounded-md flex items-center justify-center gap-2 font-medium bg-[#599f96] hover:bg-[#77afa1] text-white transition duration-200"
              >
                <ArrowRightIcon className="size-6" />
                Continuar curso
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
