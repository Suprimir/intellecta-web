"use client";

import { useState, useEffect } from "react";
import { FolderPlusIcon } from "@heroicons/react/24/outline";
import { Course } from "@/types/api";
import { useAuth } from "@/libs/context/AuthContext";
import React from "react";
import CourseModal from "@/components/modals/CourseModal";
import ConfirmationModal from "@/components/modals/ConfirmationModal";
import Table from "@/components/Table";
import { useRouter } from "next/navigation";

export default function PanelCoursesPage() {
  const [loading, setLoading] = useState(true);
  const [courses, setCourses] = useState<Course[]>([]);
  const [courseModal, setCourseModal] = useState(false);
  const [confirmationModal, setConfirmationModal] = useState(false);
  const [selectedCourse, setSelectedCourse] = useState<Course | null>(null);
  const { user, loadingUser } = useAuth();
  const router = useRouter();

  const loadInitialData = async () => {
    try {
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

      const resMyCourses = await fetch(
        `/api/courses/getByUUID/${user?.uuid}/creator`
      );
      const myCoursesData: Course[] = await resMyCourses.json();
      setCourses(myCoursesData);
    } catch (err) {
      console.error("Error al inciar los datos:", err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadInitialData();
  }, [loadingUser]);

  const handleDeleteCourse = async () => {
    if (!selectedCourse) return;

    try {
      const res = await fetch(
        `/api/courses/getByID/${selectedCourse.id}/delete`,
        {
          method: "DELETE",
        }
      );

      if (res.ok) {
        setCourses((prevCourses) =>
          prevCourses.filter((course) => course.id !== selectedCourse.id)
        );
        setConfirmationModal(false);
        setSelectedCourse(null);
      } else {
        console.error("Error al eliminar el curso");
      }
    } catch (err) {
      console.error("Error al eliminar el curso:", err);
    }
  };

  return (
    <div className="w-full">
      <div className="mb-8 pt-16 lg:pt-0">
        <h1 className="text-3xl font-bold mb-2 text-gray-800">
          Gestión de Cursos
        </h1>
        <p className="text-gray-600">
          Administra y edita todos tus cursos desde aquí
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
        <div className="col-span-1">
          <button
            onClick={() => setCourseModal(true)}
            className="cursor-pointer text-white flex gap-2 bg-gradient-to-r from-teal-500/90 to-cyan-600/90 transition transform hover:scale-105 px-4 py-2 rounded-xl"
          >
            <FolderPlusIcon className="size-6" />
            Agregar curso
          </button>
        </div>

        <div className="col-span-full">
          <Table
            items={courses}
            editable
            itemsPerPage={8}
            excludedKeys={[
              "image",
              "instructor_ID",
              "duration",
              "category_ID",
              "date",
            ]}
            onEdit={(course: Course) =>
              router.push(`/panel/courses/edit?courseId=${course.id}`)
            }
            onDelete={(course: Course) => {
              setSelectedCourse(course);
              setConfirmationModal(true);
            }}
          />
        </div>
      </div>
      <CourseModal
        closeModal={() => setCourseModal(false)}
        uuid={user ? user.uuid : ""}
        visible={courseModal}
        refreshTable={() => loadInitialData()}
      />
      {confirmationModal && selectedCourse && (
        <ConfirmationModal
          visible={confirmationModal}
          onClose={() => setConfirmationModal(false)}
          onConfirm={handleDeleteCourse}
          name={selectedCourse.name}
        />
      )}
    </div>
  );
}
