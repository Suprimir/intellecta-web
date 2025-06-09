"use client";

import { useEffect, useState } from "react";
import {
  ArrowLeft,
  Plus,
  Edit,
  Trash2,
  Play,
  FileText,
  DollarSign,
  Image,
  ChevronDown,
  ChevronRight,
  PlusIcon,
  PencilIcon,
  TrashIcon,
  PlayIcon,
} from "lucide-react";
import { Content, CourseWithUnitContent, UnitCourse } from "@/types/api";
import { useAuth } from "@/libs/context/AuthContext";
import { useSearchParams } from "next/navigation";
import { useAlert } from "@/libs/context/AlertContext";
import UnitCourseModal from "@/components/modals/UnitCourseModal";
import ContentCourseModal from "@/components/modals/ContentCourseModal";
import ConfirmationModal from "@/components/modals/ConfirmationModal";

export default function CourseEditor() {
  const [loading, setLoading] = useState(true);
  const [image, setImage] = useState("");
  const [imageFile, setImageFile] = useState<File>();
  const [price, setPrice] = useState<string>("0.00");
  const [unitCourseModal, setUnitCourseModal] = useState(false);
  const [contentCourseModal, setContentCourseModal] = useState(false);
  const [confirmationModal, setConfirmationModal] = useState(false);
  const [itemToDelete, setItemToDelete] = useState<
    (UnitCourse & { type: "unit" }) | (Content & { type: "content" })
  >();
  const [data, setData] = useState<CourseWithUnitContent>();
  const [selectedUnitIndex, setSelectedUnitIndex] = useState<number>();
  const [editMode, setEditMode] = useState<"create" | "edit" | null>(null);
  const [selectedUnit, setSelectedUnit] = useState<UnitCourse | null>(null);
  const [selectedContent, setSelectedContent] = useState<Content | null>(null);
  const [unitId, setUnitId] = useState<number>();
  const { user, loadingUser } = useAuth();
  const { showAlert } = useAlert();
  const searchParams = useSearchParams();
  const courseId = searchParams.get("courseId");

  const loadInitialData = async () => {
    try {
      const res = await fetch(`/api/courses/getByID/${courseId}/contents`);
      const data: CourseWithUnitContent[] = await res.json();

      setData(data[0]);

      if (data) {
        setPrice(String(data[0].price));
        setImage(data[0].image ? data[0].image : "");
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

  useEffect(() => {
    loadInitialData();
  }, [loadingUser]);

  const handleSaveCourse = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    const formData = new FormData(e.currentTarget);

    formData.append("uuid", user ? user?.uuid : "");

    if (courseId && data) {
      formData.append("id", courseId);
      formData.append("price", price !== String(data.price) ? price : "");
    }

    if (imageFile) {
      formData.append("file", imageFile);
    }

    const res: Response = await fetch("/api/courses", {
      method: "PUT",
      body: formData,
    });

    const resData = await res.json();

    if (res.status === 200) {
      showAlert(resData.message, "success", "Actualizado", 5000);
    } else {
      showAlert(resData.message, "error", "Error", 5000);
    }
  };

  const handleDeleteItem = async () => {
    if (itemToDelete?.type === "unit") {
      const res: Response = await fetch(
        `/api/units_courses/byID/${itemToDelete.id}/`,
        {
          method: "DELETE",
        }
      );

      const resData = await res.json();

      if (res.status === 200) {
        showAlert(resData.message, "success", "Actualizado", 5000);
        setConfirmationModal(false);
        setItemToDelete(undefined);
        loadInitialData();
      } else {
        showAlert(resData.message, "error", "Error", 5000);
      }
    } else if (itemToDelete?.type === "content") {
      const res: Response = await fetch(
        `/api/contents/byID/${itemToDelete.id}/`,
        {
          method: "DELETE",
        }
      );

      const resData = await res.json();

      if (res.status === 200) {
        showAlert(resData.message, "success", "Actualizado", 5000);
        setConfirmationModal(false);
        setItemToDelete(undefined);
        loadInitialData();
      } else {
        showAlert(resData.message, "error", "Error", 5000);
      }
    }
  };

  const handleUnitToggle = (index: any) => {
    setSelectedUnitIndex(selectedUnitIndex === index ? null : index);
  };

  if (!data || loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="text-gray-500">Cargando curso...</div>
      </div>
    );
  }

  return (
    <div className="min-h-screen">
      <div className="max-w-7xl mx-auto px-6 py-8">
        <form
          onSubmit={handleSaveCourse}
          className="bg-white rounded-2xl shadow-sm border border-gray-200 overflow-hidden mb-8"
        >
          <div className="p-6 border-b flex justify-between items-center border-gray-100">
            <h2 className="text-lg font-semibold text-gray-900 flex items-center gap-2">
              <FileText className="w-5 h-5 text-blue-600" />
              Información del Curso
            </h2>
            <button className="cursor-pointer flex items-center gap-2 px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg transition-colors">
              <ArrowLeft className="w-4 h-4" />
              Guardar Cambios
            </button>
          </div>

          <div className="p-6">
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
              <div className="lg:col-span-1">
                <label className="block text-sm font-medium text-gray-700 mb-3">
                  Imagen del curso
                </label>
                <div className="relative group">
                  <div className="aspect-video bg-gray-100 rounded-xl overflow-hidden">
                    <img
                      src={image}
                      alt="Course preview"
                      className="w-full h-full object-cover"
                    />
                  </div>
                  <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity rounded-xl flex items-center justify-center">
                    <label className="cursor-pointer bg-white/90 backdrop-blur-sm px-4 py-2 rounded-lg flex items-center gap-2 hover:bg-white transition-colors">
                      <Image className="w-5 h-5 text-gray-700" />
                      <span className="text-sm font-medium text-gray-700">
                        Cambiar imagen
                      </span>
                      <input
                        type="file"
                        accept="image/*"
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
              </div>

              <div className="lg:col-span-2 space-y-6">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Título del curso
                  </label>
                  <input
                    type="text"
                    defaultValue={data.name}
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-colors"
                    placeholder="Ingrese el título del curso"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Descripción
                  </label>
                  <textarea
                    rows={4}
                    defaultValue={data.description}
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-colors resize-none"
                    placeholder="Describe tu curso..."
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Precio (MXN)
                  </label>
                  <div className="relative">
                    <DollarSign className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" />
                    <input
                      type="number"
                      step="0.01"
                      value={price}
                      onChange={(e) => setPrice(e.target.value)}
                      className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-colors"
                      placeholder="0.00"
                    />
                  </div>
                </div>
              </div>
            </div>
          </div>
        </form>

        <div className="bg-white rounded-2xl shadow-sm border border-gray-200 overflow-hidden">
          <div className="p-6 border-b border-gray-100">
            <div className="flex items-center justify-between">
              <h2 className="text-lg font-semibold text-gray-900 flex items-center gap-2">
                <Play className="w-5 h-5 text-blue-600" />
                Contenido del Curso
              </h2>
              <button
                onClick={() => {
                  setEditMode("create");
                  setUnitCourseModal(true);
                }}
                className="flex items-center gap-2 px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg transition-colors"
              >
                <Plus className="w-4 h-4" />
                <span className="font-medium">Nueva Unidad</span>
              </button>
            </div>
          </div>

          <div className="divide-y divide-gray-100">
            {data.units.map((unit, index) => (
              <div key={unit.id} className="bg-white">
                <div
                  className="px-6 py-4 flex items-center justify-between cursor-pointer hover:bg-gray-50 transition-colors"
                  onClick={() => handleUnitToggle(index)}
                >
                  <div className="flex items-center gap-4">
                    <div className="flex items-center gap-2">
                      {selectedUnitIndex === index ? (
                        <ChevronDown className="w-5 h-5 text-gray-400" />
                      ) : (
                        <ChevronRight className="w-5 h-5 text-gray-400" />
                      )}
                    </div>
                    <div>
                      <h3 className="font-semibold text-gray-900">
                        Unidad {unit.unit_number}: {unit.title}
                      </h3>
                      <p className="text-sm text-gray-500">
                        {unit.contents.length} video
                        {unit.contents.length !== 1 ? "s" : ""}
                      </p>
                    </div>
                  </div>

                  <div className="flex items-center gap-2">
                    <button
                      className="p-2 text-gray-400 hover:text-blue-600 hover:bg-blue-50 rounded-lg transition-colors"
                      onClick={() => {
                        setEditMode("create");
                        setUnitId(unit.id);
                        setContentCourseModal(true);
                      }}
                    >
                      <Plus className="w-4 h-4" />
                    </button>
                    <button
                      className="p-2 text-gray-400 hover:text-amber-600 hover:bg-amber-50 rounded-lg transition-colors"
                      onClick={() => {
                        setEditMode("edit");
                        setSelectedUnit(unit);
                        setUnitCourseModal(true);
                      }}
                    >
                      <Edit className="w-4 h-4" />
                    </button>
                    <button
                      className="p-2 text-gray-400 hover:text-red-600 hover:bg-red-50 rounded-lg transition-colors"
                      onClick={() => {
                        setItemToDelete({ ...unit, type: "unit" });
                        setConfirmationModal(true);
                      }}
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>
                </div>

                <div
                  className={`overflow-hidden transition-all duration-300 ${
                    selectedUnitIndex === index
                      ? "max-h-96 opacity-100"
                      : "max-h-0 opacity-0"
                  }`}
                >
                  <div className="px-6 pb-4">
                    <div className="ml-9 space-y-2">
                      {unit.contents.map((content, contentIndex) => (
                        <div
                          key={content.id}
                          className="flex items-center justify-between p-3 bg-gray-50 rounded-lg hover:bg-gray-100 transition-colors"
                        >
                          <div className="flex items-center gap-3">
                            <PlayIcon className="w-4 h-4 text-gray-400" />
                            <div>
                              <p className="font-medium text-gray-900">
                                {content.title}
                              </p>
                            </div>
                          </div>

                          <div className="flex items-center gap-1">
                            <button
                              onClick={() => {
                                setEditMode("edit");
                                setSelectedContent(content);
                                setContentCourseModal(true);
                              }}
                              className="p-1.5 text-gray-400 hover:text-amber-600 hover:bg-amber-50 rounded transition-colors"
                            >
                              <PencilIcon className="w-3.5 h-3.5" />
                            </button>
                            <button
                              onClick={() => {
                                setItemToDelete({
                                  ...content,
                                  type: "content",
                                });
                                setConfirmationModal(true);
                              }}
                              className="p-1.5 text-gray-400 hover:text-red-600 hover:bg-red-50 rounded transition-colors"
                            >
                              <TrashIcon className="w-3.5 h-3.5" />
                            </button>
                          </div>
                        </div>
                      ))}

                      <button
                        onClick={() => {
                          setEditMode("create");
                          setContentCourseModal(true);
                        }}
                        className="w-full p-3 border-2 border-dashed border-gray-300 rounded-lg text-gray-500 hover:border-blue-300 hover:text-blue-600 transition-colors flex items-center justify-center gap-2"
                      >
                        <PlusIcon className="w-4 h-4" />
                        <span className="text-sm font-medium">
                          Agregar contenido
                        </span>
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
      <UnitCourseModal
        closeModal={() => setUnitCourseModal(false)}
        mode={editMode}
        refreshData={loadInitialData}
        unit={selectedUnit}
        uuid={user ? user.uuid : ""}
        courseId={Number(courseId)}
        visible={unitCourseModal}
      />
      <ContentCourseModal
        closeModal={() => setContentCourseModal(false)}
        mode={editMode}
        refreshData={loadInitialData}
        content={selectedContent}
        uuid={user ? user.uuid : ""}
        unitId={unitId}
        visible={contentCourseModal}
      />
      <ConfirmationModal
        name={itemToDelete ? itemToDelete.title : ""}
        onClose={() => setConfirmationModal(false)}
        onConfirm={handleDeleteItem}
        visible={confirmationModal}
      />
    </div>
  );
}
