"use client";

import CourseCard from "@/components/CourseCard";
import { useState, useEffect } from "react";
import FilterButton from "@/components/common/FilterButton";
import {
  FunnelIcon,
  InformationCircleIcon,
  AcademicCapIcon,
} from "@heroicons/react/24/outline";
import { Category, Course } from "@/types/api";
import { useAuth } from "@/libs/context/AuthContext";
import DashboardPageSkeleton from "@/components/skeletons/DashboardPageSkeleton";

export default function DashboardCursos() {
  const [loading, setLoading] = useState(true);
  const [courses, setCourses] = useState<Course[]>([]);
  const [categories, setCategories] = useState<Category[]>([]);
  const [selectedCategory, setSelectedCategory] = useState();
  const [filters, setFilters] = useState({
    bestRatings: false,
    createdAt: false,
  });
  const { user, loadingUser } = useAuth();

  useEffect(() => {
    const loadInitialData = async () => {
      try {
        const resMyCourses = await fetch(
          `/api/courses/purchased?uuid=${user?.uuid}`
        );
        const myCoursesData: Course[] = await resMyCourses.json();
        setCourses(myCoursesData);

        const resCategories = await fetch("/api/categories");
        const categories: Category[] = await resCategories.json();
        setCategories(categories);
      } catch (err) {
        console.error("Error al inciar los datos:", err);
      } finally {
        const waitForAuth = () =>
          new Promise<void>((resolve) => {
            const interval = setInterval(() => {
              if (!loadingUser) {
                clearInterval(interval);
                resolve();
              }
            }, 100);
          });

        await waitForAuth();
        setLoading(false);
      }
    };

    loadInitialData();
  }, [loadingUser]);

  if (loading) {
    return <DashboardPageSkeleton />;
  }

  return (
    <div className="min-h-screen bg-gray-100 px-6 py-10">
      <div className="max-w-6xl mx-auto">
        <h1 className="text-3xl font-bold mb-6 flex items-center gap-2 text-gray-800">
          <AcademicCapIcon className="h-8 w-8 text-indigo-600" />
          Mis Cursos
        </h1>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
          <div className="bg-white shadow rounded-2xl p-4 flex items-center gap-4">
            <InformationCircleIcon className="h-8 w-8 text-blue-500" />
            <div>
              <p className="text-sm text-gray-500">Total de cursos</p>
              <p className="text-xl font-bold">{courses.length}</p>
            </div>
          </div>
          <div className="bg-white shadow rounded-2xl p-4 col-span-2">
            <p className="text-sm text-gray-600 mb-1 font-medium">Mensaje:</p>
            <p className="text-gray-700">
              ¡Sigue aprendiendo! Recuerda que completar un curso te otorga un
              certificado.
            </p>
          </div>
        </div>

        <div className="flex flex-wrap items-center justify-between gap-2 mb-6">
          <div className="flex flex-wrap gap-2">
            <FilterButton
              label="Categorias"
              icon={<FunnelIcon className="size-4" />}
              hasDropdown={true}
              categories={categories}
              onSelect={(category) => setSelectedCategory(category)}
            />
          </div>
        </div>

        {/* Lista de cursos */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {courses.length > 0 &&
            courses
              .filter((course) =>
                selectedCategory
                  ? course.category_name === selectedCategory
                  : true
              )
              .sort((a, b) => {
                if (filters.bestRatings) {
                  return (b.rating ?? 0) - (a.rating ?? 0);
                }
                return 0;
              })
              .map((course) => (
                <CourseCard
                  key={course.id}
                  course={course}
                  isInDashboard={true}
                />
              ))}
        </div>
      </div>
    </div>
  );
}
