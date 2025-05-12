"use client";

import { useEffect, useState } from "react";
import { courseInput } from "@/utils/validateCourses";
import CourseCard from "./CourseCard";
import Hyperlink from "./common/Hyperlink";
import { ArrowLongRightIcon } from "@heroicons/react/24/outline";

export default function CoursesMainPage() {
  const [courses, setCourses] = useState<courseInput[]>([]);

  async function getCourses() {
    const response = await fetch("/api/courses");
    const coursesJson = await response.json();
    console.log("jalo w");
    return coursesJson;
  }

  useEffect(() => {
    const loadMainCourses = async () => {
      try {
        const mainCourses: courseInput[] = await getCourses();
        setCourses(mainCourses);
        console.log(courses);
      } catch (error: unknown) {
        console.error((error as Error).message);
      }
    };

    loadMainCourses();
  }, []);

  return (
    <div className="col-span-3 row-start-3 bg-[#ededed]">
      <p className="text-[#31B2A5] text-xl font-extrabold max-w-[80%] mx-auto pt-8">
        Comienza tu aprendizaje con cursos gratis
      </p>
      <div className="grid grid-cols-4 grid-rows-2 max-w-[82%] pb-4 mx-auto gap-6">
        {courses.slice(0, 8).map((course) => (
          <div className="col-span-1">
            <CourseCard
              title={course.course_Name}
              description={course.course_Description}
            />
          </div>
        ))}
      </div>
      <div className="mx-auto pb-8 max-w-[80%]">
        <div className="border-[#0D7682] border-2 inline-flex items-center p-2">
          <Hyperlink
            text="Todos los cursos gratis"
            href="/dashboard"
            className="text-[#0D7682]"
          />
          <ArrowLongRightIcon
            aria-hidden="true"
            className="size-5 flex-none group-data-open:rotate-180"
          />
        </div>
      </div>
    </div>
  );
}
