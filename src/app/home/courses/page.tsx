"use client";

import { useEffect, useState } from "react";
import { useSearchParams, useRouter } from "next/navigation";
import { Category, Course } from "@/types/api";
import CourseCard from "@/components/CourseCard";
import FilterButton from "@/components/common/FilterButton";
import {
  MagnifyingGlassIcon,
  FunnelIcon,
  ArrowRightIcon,
} from "@heroicons/react/24/outline";
import { useAuth } from "@/libs/context/AuthContext";
import Button from "@/components/common/Button";
import CoursesPageSkeleton from "@/components/skeletons/CoursesPageSkeleton";

export default function CoursePlatform() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const search = searchParams.get("search");
  const category = searchParams.get("category");

  const { user, loadingUser } = useAuth();
  const [searchTerm, setSearchTerm] = useState(search ? `${search}` : "");
  const [selectedCategory, setSelectedCategory] = useState(
    category ? `${category}` : ""
  );
  const [filters, setFilters] = useState({
    bestRatings: false,
    createdAt: false,
  });
  const [loading, setLoading] = useState(true);
  const [courses, setCourses] = useState<Course[]>([]);
  const [categories, setCategories] = useState<Category[]>([]);

  useEffect(() => {
    const loadInitialData = async () => {
      try {
        const resCourses = await fetch(
          `/api/courses${user?.uuid ? `?uuid=${user.uuid}` : ""}`
        );
        const coursesData: Course[] = await resCourses.json();
        setCourses(coursesData);

        const resCategories = await fetch("/api/categories");
        const categoriesData: Category[] = await resCategories.json();
        setCategories(categoriesData);
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
    return (
      <div className="bg-gradient-to-br from-yellow-50 to-orange-50">
        <CoursesPageSkeleton />
      </div>
    );
  }

  return (
    <div className="bg-gradient-to-br from-yellow-50 to-orange-50 min-h-screen p-6">
      <div className="max-w-7xl mx-auto">
        {/* Search Bar */}
        <div className="mb-6 relative bg-white">
          <div className="relative">
            <input
              type="text"
              placeholder="Search for courses..."
              className="w-full p-3 pl-10 shadow rounded-xl focus:ring-0 focus:outline-none focus:shadow-lg transition-all duration-200"
              onChange={(e) => setSearchTerm(e.target.value)}
            />
            <MagnifyingGlassIcon className="absolute left-3 top-3.5 text-gray-400 size-6" />
          </div>
        </div>

        {/* Filter Bar */}
        <div className="flex flex-wrap items-center justify-between gap-2 mb-6">
          <div className="flex flex-wrap gap-2">
            <FilterButton
              label="Categorias"
              icon={<FunnelIcon className="size-4" />}
              hasDropdown={true}
              categories={categories}
              onSelect={(category) => setSelectedCategory(category)}
            />
            <FilterButton
              label="Mejor Valorados"
              icon="⭐"
              onSelect={(value) =>
                setFilters((prev) => ({ ...prev, bestRatings: value }))
              }
            />
          </div>
          {user && (
            <div>
              <button
                onClick={() => router.push("/dashboard")}
                className="cursor-pointer bg-gradient-to-r from-blue-500 to-blue-600 text-white py-2 px-4 rounded-lg font-medium hover:from-blue-600 hover:to-blue-700 transition-all duration-200 flex items-center justify-center shadow-md hover:shadow-lg transform hover:-translate-y-0.5"
              >
                Ir a mis cursos
                <ArrowRightIcon className="size-6 ms-4" />
              </button>
            </div>
          )}
        </div>

        {/* Course Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {courses.length > 0 &&
            courses
              .filter((course) =>
                course.name.toLowerCase().includes(searchTerm.toLowerCase())
              )
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
              .map((course) => <CourseCard key={course.id} course={course} />)}
        </div>
      </div>
    </div>
  );
}
