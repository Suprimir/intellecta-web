"use client";

import { useEffect, useState } from "react";
import { courseInput } from "@/utils/validateCourses";
import CourseCard from "./CourseCard";

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
    <div className="grid grid-cols-4 grid-rows-2 gap-4">
      {courses.map((course) => (
        <div className="col-span-4">
          <CourseCard
            title={course.course_Name}
            description={course.course_Description}
          />
        </div>
      ))}
      <div className="col-span-4 row-start-2">2</div>
    </div>
  );
}
