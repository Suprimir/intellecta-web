import { Course } from "@/types/api";
import { ArrowRightIcon } from "@heroicons/react/24/outline";

interface CourseCardProps {
  course: Course;
  nameMaxLength?: number;
  descriptionMaxLength?: number;
}

export default function MiniCourseCard({
  course,
  nameMaxLength = 25,
  descriptionMaxLength = 80,
}: CourseCardProps) {
  const truncateText = (text: string, maxLength: number) => {
    if (text.length <= maxLength) return text;
    return text.slice(0, maxLength) + "...";
  };

  return (
    <div className="bg-white rounded-2xl shadow hover:shadow-md transition-all overflow-hidden border border-gray-200">
      <div className="relative">
        <img
          src={course.image}
          alt={course.name}
          className="w-full h-48 object-cover"
        />
      </div>
      <div className="p-5">
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

        <div>
          <button className="cursor-pointer w-full mt-2 py-2 px-4 rounded-md flex items-center justify-center gap-2 font-medium bg-[#599f96] hover:bg-[#77afa1] text-white transition duration-200">
            <ArrowRightIcon className="size-6" />
            Editar Curso
          </button>
        </div>
      </div>
    </div>
  );
}
