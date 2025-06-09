import { Course } from "@/types/api";
import { useState, useEffect, useRef } from "react";
import { ArrowRightIcon, ShoppingCartIcon } from "@heroicons/react/24/outline";
import { useAlert } from "@/libs/context/AlertContext";
import { useRouter } from "next/navigation";
import { BookOpen, Clock, GraduationCap, StarIcon } from "lucide-react";
import "../styles/CourseCard.css";

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
  const [showRatingDropdown, setShowRatingDropdown] = useState(false);
  const [isRatingLoading, setIsRatingLoading] = useState(false);
  const [userRating, setUserRating] = useState(course.userRating || 0);
  const { showAlert } = useAlert();
  const router = useRouter();
  const dropdownRef = useRef<HTMLDivElement>(null);

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

  const handleRating = async (rating: number) => {
    setIsRatingLoading(true);
    setShowRatingDropdown(false);

    try {
      const res = await fetch(`/api/courses/getByID/${course.id}/ratings`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          rating: rating,
        }),
      });

      if (!res.ok) {
        throw new Error("Error al calificar el curso");
      }

      setUserRating(rating);
      showAlert(
        `Has calificado el curso con ${rating} estrella${
          rating !== 1 ? "s" : ""
        }`,
        "success",
        "Calificación guardada",
        2000
      );
    } catch (error) {
      console.error(error);
      showAlert("Error al guardar la calificación", "error", "Error", 2000);
    } finally {
      setIsRatingLoading(false);
    }
  };

  const renderStars = (rating: number, interactive: boolean = false) => {
    return Array.from({ length: 5 }, (_, i) => {
      const starNumber = i + 1;
      const isFilled = starNumber <= rating;

      if (interactive) {
        return (
          <button
            key={i}
            onClick={() => handleRating(starNumber)}
            className={`size-5 transition-colors duration-200 hover:scale-110 ${
              isFilled
                ? "text-yellow-400"
                : "text-gray-300 hover:text-yellow-300"
            }`}
            disabled={isRatingLoading}
          >
            <StarIcon />
          </button>
        );
      }

      return isFilled ? (
        <StarIcon key={i} className="size-5 text-yellow-400" />
      ) : (
        <StarIcon key={i} className="size-5 text-gray-300" />
      );
    });
  };

  return (
    <div className="bg-white rounded-2xl shadow hover:shadow-md transition-all border border-gray-200 flex flex-col h-full">
      <div className="relative">
        <img
          src={course.image}
          alt={course.name}
          className="w-full h-48 object-cover"
        />
        <div className="absolute top-4 right-4 bg-white rounded-full px-3 py-1 text-sm font-medium text-gray-700 shadow-md">
          {course.category_name}
        </div>
        <div className="absolute inset-0 bg-gradient-to-t from-black/20 to-transparent"></div>
      </div>

      <div className="p-5 flex flex-col flex-grow">
        {/* Nombre del curso */}
        <div className="flex items-center mb-4">
          <h3
            className="font-semibold text-lg text-gray-800 line-clamp-1 flex-grow"
            title={course.name}
          >
            {truncateText(course.name, nameMaxLength)}
          </h3>
        </div>

        {/* Descripción del curso */}
        <div className="flex items-center mb-4">
          <p className="text-sm text-gray-600 line-clamp-2 flex-grow min-h-[2.5rem]">
            {truncateText(course.description, descriptionMaxLength)}
          </p>
        </div>

        {/* Nombre del instructor */}
        <div className="flex items-center mb-4">
          <GraduationCap className="size-4 text-gray-500 mr-2" />
          <span className="text-xs text-gray-500 truncate flex-grow">
            {course.instructor}
          </span>
        </div>

        {/* Duración del curso */}
        <div className="flex items-center mb-4">
          <Clock className="size-4 text-gray-500 mr-2" />
          <span className="text-xs text-gray-600 flex-grow">
            {(course.duration / 60 / 60).toFixed(2)} horas totales
          </span>
        </div>

        {/* Rating del curso */}
        <div className="flex items-center mb-4">
          <span className="font-bold text-amber-700">{course.rating}</span>
          <div className="flex text-amber-400 ml-1">
            {"★".repeat(Math.floor(course.rating))}
            {5 % 1 > 0 ? "½" : ""}
            {"☆".repeat(5 - Math.ceil(course.rating))}
          </div>
        </div>

        {/* Mostrar contenido dependiendo de la ubicación del curso */}
        {!isInMainPage &&
          (course.location === "cart" || course.location === "") && (
            <div className="flex flex-col flex-grow">
              {/* Precio del curso */}
              <div className="flex items-center mb-4">
                <span className="font-bold text-teal-600 flex-grow">
                  MX${course.price}
                </span>
              </div>

              {/* Botones de acción */}
              <div className="flex gap-2 mt-auto">
                <button
                  onClick={() => router.push(`/home/courses/${course.id}`)}
                  className="cursor-pointer w-[75%] bg-gradient-to-r from-yellow-500/90 to-yellow-600/80 text-white py-2 px-4 rounded-lg font-medium hover:from-yellow-600/80 hover:to-yellow-700/80 transition-all duration-200 flex items-center justify-center shadow-md hover:shadow-lg transform hover:-translate-y-0.5"
                >
                  <BookOpen className="size-6 mr-4" />
                  Ver curso
                </button>
                <button
                  onClick={handleCartAction}
                  disabled={isLoading}
                  className={`cursor-pointer w-[25%] bg-gradient-to-r text-white py-2 px-4 rounded-lg font-medium transition-all duration-200 flex items-center justify-center shadow-md hover:shadow-lg transform hover:-translate-y-0.5 ${
                    isAdded
                      ? "from-red-400/90 to-red-500/80 hover:from-red-500/90 hover:to-red-600/80 text-white"
                      : "from-green-400/90 to-green-500/80 hover:from-green-500/90 hover:to-green-600/80 text-black"
                  } disabled:opacity-70 disabled:cursor-not-allowed`}
                >
                  {isLoading ? (
                    <svg
                      className="size-5 animate-spin"
                      viewBox="0 0 24 24"
                    ></svg>
                  ) : (
                    <ShoppingCartIcon className="size-6" />
                  )}
                </button>
              </div>
            </div>
          )}

        {(course.location === "purchased" || isInDashboard) && (
          <div className="flex flex-col flex-grow">
            <div className="flex items-center mb-4">
              <span className="text-xs text-gray-600 flex-grow"></span>
            </div>
            <div className="flex gap-2 mt-auto">
              <button
                onClick={() =>
                  router.push(`/dashboard/courses?courseId=${course.id}`)
                }
                className="cursor-pointer w-[75%] bg-gradient-to-r from-teal-500/90 to-teal-600/80 text-white py-2 px-4 rounded-lg font-medium hover:from-teal-600/90 hover:to-teal-700/80 transition duration-200 flex items-center justify-center transform hover:-translate-y-0.5"
              >
                <ArrowRightIcon className="size-6 mr-4" />
                Continuar curso
              </button>

              <div
                className="relative w-[25%] popOverStarsButton"
                ref={dropdownRef}
              >
                <button
                  onClick={() => setShowRatingDropdown(!showRatingDropdown)}
                  className="cursor-pointer w-full h-full bg-gradient-to-r from-yellow-500/90 to-yellow-600/80 text-white py-2 px-4 rounded-lg font-medium hover:from-yellow-600/90 hover:to-yellow-700/80 transition duration-200 flex items-center justify-center transform hover:-translate-y-0.5"
                  disabled={isRatingLoading}
                >
                  <StarIcon className="size-4" />
                  {isRatingLoading && (
                    <svg
                      className="size-3 animate-spin ml-1"
                      viewBox="0 0 24 24"
                    >
                      <circle
                        className="opacity-25"
                        cx="12"
                        cy="12"
                        r="10"
                        stroke="currentColor"
                        strokeWidth="4"
                        fill="none"
                      />
                      <path
                        className="opacity-75"
                        fill="currentColor"
                        d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                      />
                    </svg>
                  )}
                </button>

                {/* Dropdown con estrellas */}
                <div className="popOverStars absolute bottom-full left-0 mb-2 bg-white border border-gray-200 rounded-lg shadow-lg p-3 z-10 min-w-[200px]">
                  <div className="text-xs text-gray-500 mb-2 text-center">
                    Selecciona tu calificación
                  </div>
                  <div className="flex justify-center gap-1">
                    {renderStars(0, true)}
                  </div>
                  <div className="text-xs text-gray-400 mt-2 text-center">
                    {userRating > 0 && `Actual: ${userRating}/5`}
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
