"use client";

import { Course } from "@/types/api";
import CourseCard from "./CourseCard";
import Button from "./common/Button";
import { ArrowLongRightIcon } from "@heroicons/react/24/outline";
import { useRouter } from "next/navigation";

interface CoursesMainPageProps {
  courses: Course[];
  coursesInCart?: Course[];
}

export default function CoursesMainPage({ courses }: CoursesMainPageProps) {
  const router = useRouter();

  return (
    <div className="w-full col-span-3 bg-[#ededed] px-4 py-8 md:py-10 lg:py-12">
      <p className="text-[#31B2A5] text-lg sm:text-xl font-extrabold max-w-[95%] sm:max-w-[90%] md:max-w-[85%] lg:max-w-[80%] mx-auto mb-6">
        Comienza tu aprendizaje con cursos gratis
      </p>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 md:gap-6 max-w-[95%] sm:max-w-[90%] md:max-w-[85%] lg:max-w-[82%] mx-auto">
        {courses.length > 0 &&
          courses.map((course) => (
            <div
              key={course.id}
              className="hover:scale-105 transition transform duration-300"
            >
              <CourseCard course={course} isInMainPage={true} />
            </div>
          ))}
      </div>

      <div className="mx-auto pt-6 sm:pt-7 lg:pt-8 pb-6 sm:pb-7 lg:pb-8 max-w-[95%] sm:max-w-[90%] md:max-w-[85%] lg:max-w-[80%] text-center sm:text-left">
        <button
          onClick={() => router.push("/home/courses")}
          className="cursor-pointer border-teal-600 text-teal-600 border-2 inline-flex items-center p-3 hover:bg-teal-600/5 transition duration-300 transform hover:translate-x-1 hover:scale-105 rounded-lg"
        >
          Todos los cursos gratis
          <ArrowLongRightIcon
            aria-hidden="true"
            className="size-6 sm:size-5 ml-1 flex-none group-data-open:rotate-180"
          />
        </button>
      </div>
    </div>
  );
}
