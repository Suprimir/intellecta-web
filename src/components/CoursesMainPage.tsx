"use client";

import { Course } from "@/types/api";
import CourseCard from "./CourseCard";
import Hyperlink from "./common/Hyperlink";
import { ArrowLongRightIcon } from "@heroicons/react/24/outline";

interface CoursesMainPageProps {
  courses: Course[];
  coursesInCart?: Course[];
}

export default function CoursesMainPage({ courses }: CoursesMainPageProps) {
  return (
    <div className="w-full col-span-3 bg-[#ededed] px-4 py-8 md:py-10 lg:py-12">
      <p className="text-[#31B2A5] text-lg sm:text-xl font-extrabold max-w-[95%] sm:max-w-[90%] md:max-w-[85%] lg:max-w-[80%] mx-auto mb-6">
        Comienza tu aprendizaje con cursos gratis
      </p>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 md:gap-6 max-w-[95%] sm:max-w-[90%] md:max-w-[85%] lg:max-w-[82%] mx-auto">
        {courses.map((course) => (
          <div key={course.id}>
            <CourseCard course={course} isInMainPage={true} />
          </div>
        ))}
      </div>

      <div className="mx-auto pt-6 sm:pt-7 lg:pt-8 pb-6 sm:pb-7 lg:pb-8 max-w-[95%] sm:max-w-[90%] md:max-w-[85%] lg:max-w-[80%] text-center sm:text-left">
        <div className="border-[#0D7682] border-2 inline-flex items-center p-2 hover:bg-[#0D7682]/5 transition-colors">
          <Hyperlink
            text="Todos los cursos gratis"
            href="/dashboard"
            className="text-[#0D7682] font-medium"
          />
          <ArrowLongRightIcon
            aria-hidden="true"
            className="size-4 sm:size-5 ml-1 flex-none group-data-open:rotate-180"
          />
        </div>
      </div>
    </div>
  );
}
