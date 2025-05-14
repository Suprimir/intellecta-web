"use client";

import { useEffect, useState } from "react";
import { Course, ShoppingCartDetails } from "@/types/api";
import CourseCard from "@/components/CourseCard";
import {
  ChevronDownIcon,
  MagnifyingGlassIcon,
  FunnelIcon,
} from "@heroicons/react/24/outline";
import { useAuth } from "@/libs/context/AuthContext";

export default function CoursePlatform() {
  const { user, loadingUser } = useAuth();
  const [searchTerm, setSearchTerm] = useState("");
  const [loading, setLoading] = useState(true);
  const [courses, setCourses] = useState<Course[]>([]);

  useEffect(() => {
    try {
      const getCourses = async () => {
        const responseCourses = await fetch("/api/courses");
        const courses: Course[] = await responseCourses.json();

        const responseCartCourses = await fetch(`/api/cart?uuid=${user?.uuid}`);
        const cartItemsObject: ShoppingCartDetails[] =
          await responseCartCourses.json();
        const cartItems: number[] = cartItemsObject.map(
          (item) => item.course_ID
        );

        courses.map((course) => {
          if (cartItems.includes(course.id)) {
            course.isInCart = true;
          }
        });
        console.log(courses);

        setCourses(courses);
      };

      getCourses();
      setLoading(false);
    } catch (error: unknown) {
      console.error((error as Error).message);
    }
  }, [loadingUser]);

  const FilterButton = ({
    label,
    icon = null,
    hasDropdown = false,
  }: {
    label: string;
    icon?: React.ReactNode;
    hasDropdown?: boolean;
  }) => (
    <button
      className={`flex items-center px-4 py-2 text-sm rounded-full border ${
        hasDropdown ? "border-gray-300" : "border-gray-400"
      } bg-white`}
    >
      {icon && <span className="mr-2">{icon}</span>}
      {label}
      {hasDropdown && <ChevronDownIcon className="ml-1 size-4" />}
    </button>
  );

  if (loading) {
    return <div>Cargando...</div>;
  }

  return (
    <div className="bg-gray-50 min-h-screen p-6">
      <div className="max-w-7xl mx-auto">
        {/* Search Bar */}
        <div className="mb-6 relative">
          <div className="relative">
            <input
              type="text"
              placeholder="Search for courses..."
              className="w-full p-3 pl-10 border border-gray-300 rounded-lg"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
            <MagnifyingGlassIcon className="absolute left-3 top-3.5 text-gray-400 size-6" />
          </div>
        </div>

        {/* Filter Bar */}
        <div className="flex flex-wrap items-center justify-between gap-2 mb-6">
          <div className="flex flex-wrap gap-2">
            <FilterButton
              label="All filters"
              icon={<FunnelIcon className="size-4" />}
            />
            <FilterButton label="Quizzes" icon="📝" />
            <FilterButton label="Coding Exercises" icon="💻" />
            <FilterButton label="Practice Tests" icon="📊" />
            <FilterButton label="Language" hasDropdown={true} />
            <FilterButton label="Ratings" hasDropdown={true} />
            <FilterButton label="Level" hasDropdown={true} />
          </div>
        </div>

        {/* Course Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {courses.map((course) => (
            <CourseCard
              key={course.id}
              course={course}
              isInCart={course.isInCart}
            />
          ))}
        </div>
      </div>
    </div>
  );
}
