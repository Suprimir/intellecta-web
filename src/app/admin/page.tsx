"use client";

import CourseCard from "@/components/CourseCard";
import { courseInput } from "@/utils/validateCourses";
import { useState } from "react";

export default function Admin() {
  const [courses, setCourses] = useState<courseInput[]>([]);

  async function getCourses() {
    const response = await fetch("/api/courses");
    const coursesJson = await response.json();
    courses.map((course) => console.log(course.course_Name));
    setCourses(coursesJson);
  }

  return (
    <div>
      <h1>ADMIN PANEL FOR DEBUGGING</h1>
      <button className="bg-amber-400" onClick={() => getCourses()}>
        VER CURSOS
      </button>
      {courses.length === 0 ? (
        <p>No hay elementos</p>
      ) : (
        courses.map((course) => (
          <CourseCard
            title={course.course_Name}
            description={course.course_Description}
            key={course.course_ID}
          ></CourseCard>
        ))
      )}
    </div>
  );
}
