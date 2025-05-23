"use client";

import { useState, useEffect } from "react";
import { useSearchParams } from "next/navigation";
import Image from "next/image";
import {
  PlusCircleIcon,
  MinusCircleIcon,
  PencilIcon,
  PencilSquareIcon,
  FolderPlusIcon,
} from "@heroicons/react/24/outline";
import { useAuth } from "@/libs/context/AuthContext";
import DashboardPageSkeleton from "@/components/skeletons/DashboardPageSkeleton";
import UnitCourseModal from "@/components/modals/UnitCourseModal";
import ContentCourseModal from "@/components/modals/ContentCourseModal";
import {
  Content,
  CourseWithUnitContent,
  UnitCourse,
  UnitWithContent,
} from "@/types/api";

export default function PanelCoursesPage() {
  const [loading, setLoading] = useState(true);
  const [image, setImage] = useState("");
  const [imageFile, setImageFile] = useState<File>();
  const [price, setPrice] = useState<number>(0);
  const [unitListOpen, setUnitListOpen] = useState(false);
  const [unitCourseModal, setUnitCourseModal] = useState(false);
  const [contentCourseModal, setContentCourseModal] = useState(false);
  const [data, setData] = useState<CourseWithUnitContent[]>();

  const [editMode, setEditMode] = useState<"create" | "edit" | null>(null);
  const [selectedUnit, setSelectedUnit] = useState<UnitCourse | null>(null);
  const [selectedContent, setSelectedContent] = useState<Content | null>(null);

  const { user, loadingUser } = useAuth();
  const searchParams = useSearchParams();
  const courseId = searchParams.get("courseId");

  useEffect(() => {
    const loadInitialData = async () => {
      try {
        const res = await fetch(`/api/courses/getByID/${courseId}/contents`);
        const data: CourseWithUnitContent[] = await res.json();

        setData(data);

        if (data) {
          setPrice(data[0].price);
          setImage(data[0].image);
        }
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
      } catch (err) {
        console.error("Error al inciar los datos:", err);
      } finally {
        setLoading(false);
      }
    };

    loadInitialData();
  }, [loadingUser]);

  const handleSaveCourse = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    const formData = new FormData(e.currentTarget);

    if (courseId && imageFile) {
      formData.append("id", courseId);
      formData.append("file", imageFile);
    }

    await fetch("/api/courses", {
      method: "PUT",
      body: formData,
    });
  };

  const handleUnitList = () => {
    setUnitListOpen((prev) => !prev);
  };

  if (loading) {
    return <DashboardPageSkeleton />;
  }

  return (
    <div className="min-h-screen bg-gray-100 px-6 py-10">
      {data && (
        <div className="max-w-6xl mx-auto">
          <form
            onSubmit={handleSaveCourse}
            className="grid grid-cols-1 md:grid-cols-3 grid-rows-3 gap-4 mb-6"
          >
            <div className="bg-white shadow rounded-2xl p-4 col-span-1 row-span-2 relative overflow-hidden group">
              <Image
                alt="Imagen del curso"
                src={image}
                fill
                className="object-cover p-3 rounded-3xl"
              />
              <div className="absolute inset-0 bg-white/30 opacity-0 group-hover:opacity-100 transition duration-300 rounded-3xl flex items-center justify-center">
                <label className="cursor-pointer bg-white p-2 rounded-full border-4">
                  <PencilIcon className="size-8 text-gray-700" />
                  <input
                    type="file"
                    accept=".jpg,.jpeg,.png"
                    className="hidden"
                    onChange={(e) => {
                      const file = e.target.files?.[0];
                      if (file) {
                        const imageURL = URL.createObjectURL(file);
                        setImage(imageURL);
                        setImageFile(file || null);
                      }
                    }}
                  />
                </label>
              </div>
            </div>
            <div className="bg-white shadow rounded-2xl p-4 col-span-2 row-span-1">
              <p className="text-sm text-gray-600 mb-1 font-extrabold">
                Titulo:
              </p>
              <input
                type="text"
                id="title"
                name="title"
                placeholder={data[0].name}
                className="text-gray-700 bg-gray-100 p-2 rounded-xl w-full"
              />
            </div>
            <div className="bg-white shadow rounded-2xl p-4 col-span-2 row-span-2">
              <p className="text-sm text-gray-600 mb-1 font-extrabold">
                Descripcion:
              </p>
              <textarea
                name="description"
                maxLength={684}
                placeholder={data[0].description}
                className="text-gray-700 bg-gray-100 p-2 rounded-xl w-full h-[85%] resize-none"
              />
            </div>
            <div className="bg-white shadow rounded-2xl p-4 col-span-1">
              <div className="grid grid-cols-4 justify-items-center">
                <p className="text-sm text-gray-600 mb-1 font-extrabold col-span-4">
                  Precio:
                </p>
                <div className="col-span-1 row-span-2">
                  <button
                    onClick={() => {
                      const newPrice = price - 1;
                      setPrice(newPrice);
                    }}
                    className="cursor-pointer"
                  >
                    <MinusCircleIcon className="size-6" />
                  </button>
                </div>
                <div className="col-span-2 row-span-2 text-xl text-center">
                  MXN$
                  <input
                    inputMode="numeric"
                    name="price"
                    pattern="[0-9]*"
                    value={price}
                    onChange={(e) => setPrice(Number(e.target.value))}
                    className="w-[40%]"
                  />
                </div>
                <div className="col-span-1 row-span-2">
                  <button
                    onClick={() => {
                      const newPrice = price + 1;
                      setPrice(newPrice);
                    }}
                    className="cursor-pointer"
                  >
                    <PlusCircleIcon className="size-6" />
                  </button>
                </div>
              </div>
            </div>
            <div className="col-span-3 flex justify-center">
              <button
                type="submit"
                className="cursor-pointer font-extrabold inline-flex gap-2 bg-green-400 hover:bg-green-500 hover:transition hover:duration-300 p-2 rounded-md shadow"
              >
                <FolderPlusIcon className="size-6" />
                Guardar
              </button>
            </div>
          </form>

          {/* Contenidos */}
          <div className="grid grid-cols-1 md:grid-cols-3 grid-rows-3 gap-4 mb-6">
            <div className="col-span-3 bg-white shadow rounded-2xl p-2">
              <div className="inline-flex w-full justify-between p-4">
                <h1 className="font-extrabold text-xl">Contenido</h1>
                <button
                  onClick={() => {
                    setEditMode("create");
                    setSelectedUnit(null);
                    setUnitCourseModal(true);
                  }}
                  className="cursor-pointer bg-green-400 p-2 rounded-md inline-flex gap-2"
                >
                  <FolderPlusIcon className="size-5" />
                  <p className="text-sm font-extrabold">Agregar Unidad</p>
                </button>
              </div>

              {/* Unidades */}
              {data[0].units.map((unit: UnitWithContent, index) => (
                <div key={index}>
                  <div className="bg-gray-100 p-4 inline-flex w-full rounded-xl justify-between">
                    <button
                      onClick={() => handleUnitList()}
                      className="hover:text-blue-500 cursor-pointer"
                    >
                      <p className="font-extrabold">
                        Unidad {unit.unit_number}: {unit.title}
                      </p>
                    </button>
                    <div className="inline-flex gap-2">
                      <button
                        onClick={() => {
                          setEditMode("create");
                          setSelectedContent(null);
                          setContentCourseModal(true);
                        }}
                        className="cursor-pointer bg-green-400 p-1 rounded-md inline-flex gap-2"
                      >
                        <FolderPlusIcon className="size-5" />
                      </button>
                      <button
                        onClick={() => {
                          setEditMode("edit");
                          setSelectedUnit(unit);
                          setUnitCourseModal(true);
                        }}
                        className="cursor-pointer bg-green-400 p-1 rounded-md inline-flex gap-2"
                      >
                        <PencilSquareIcon className="size-5" />
                      </button>
                    </div>
                  </div>
                  {unit.contents.map((content: Content, index) => (
                    <div
                      key={index}
                      className={`overflow-hidden transition-all duration-300 ${
                        unitListOpen
                          ? "max-h-40 opacity-100 translate-y-0"
                          : "max-h-0 opacity-0 -translate-y-4"
                      }
                                `}
                    >
                      <div className="bg-white p-4 inline-flex w-full justify-between">
                        <p>
                          Video {index + 1}: {content.title}
                        </p>
                        <button
                          onClick={() => {
                            setEditMode("edit");
                            setSelectedContent(content);
                            setContentCourseModal(true);
                          }}
                          className="cursor-pointer bg-green-400 p-1 rounded-md inline-flex gap-2"
                        >
                          <PencilSquareIcon className="size-5" />
                        </button>
                      </div>
                    </div>
                  ))}
                </div>
              ))}
            </div>
          </div>
        </div>
      )}
      {unitCourseModal && (
        <UnitCourseModal
          mode={editMode}
          unit={selectedUnit}
          closeModal={() => {
            setUnitCourseModal(false);
            setEditMode(null);
            setSelectedUnit(null);
          }}
        />
      )}
      {contentCourseModal && (
        <ContentCourseModal
          mode={editMode}
          content={selectedContent}
          closeModal={() => {
            setContentCourseModal(false);
            setEditMode(null);
            setSelectedContent(null);
          }}
        />
      )}
    </div>
  );
}
