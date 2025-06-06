"use client";

import Image from "next/image";
import { useRouter } from "next/navigation";
import CoursesMainPage from "@/components/CoursesMainPage";
import { AcademicCapIcon, StarIcon } from "@heroicons/react/24/outline";
import { useState, useEffect } from "react";
import { useAuth } from "@/libs/context/AuthContext";
import { Course } from "@/types/api";
import HomeSkeleton from "@/components/skeletons/HomeSkeleton";
import Button from "@/components/common/Button";
import { ChevronRightIcon } from "lucide-react";

export default function HomePage() {
  const router = useRouter();
  const { user, loadingUser } = useAuth();
  const [loading, setLoading] = useState(true);
  const [courses, setCourses] = useState<Course[]>([]);

  useEffect(() => {
    const loadInitialData = async () => {
      try {
        const res = await fetch("/api/courses?limit=8");
        const data = await res.json();
        setCourses(data);
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
    return <HomeSkeleton />;
  }

  return (
    <div className="grid grid-cols-3 grid-rows-1">
      <div className="col-span-3 row-start-1 bg-gradient-to-br from-yellow-500 to-yellow-600 h-[400px] lg:h-[600px]">
        <div className="lg:grid lg:grid-cols-4 h-full max-w-[90%] mx-auto gap-6">
          <div className="col-span-4 xl:col-span-2 2xl:col-span-3 flex flex-col h-full">
            <div className="flex-1 flex flex-col justify-center xl:items-start space-y-8 items-center">
              <h1
                className="text-center xl:text-start text-3xl sm:text-4xl md:text-5xl lg:text-[5rem] xl:text-6xl 2xl:text-[5rem] font-black leading-tight max-w-[100%]"
                style={{ WebkitTextStroke: "2px black" }}
              >
                Contamos con +20 cursos con certificados en diversas áreas
              </h1>
              {user && (
                <button
                  onClick={() => router.push("/dashboard")}
                  className="bg-gradient-to-t cursor-pointer from-gray-800 to-gray-900 hover:from-gray-900 hover:to-gray-950 text-white font-bold py-3 px-6 rounded-lg text-lg md:text-2xl hover:bg-gray-800 transition duration-300 transform hover:-translate-y-0.5 hover:scale-105 whitespace-nowrap"
                >
                  Ir a mis cursos
                  <ChevronRightIcon className="inline size-6 ml-2 animate-pulse" />
                </button>
              )}
              {!user && (
                <button
                  onClick={() => router.push("/auth/register")}
                  className="bg-gradient-to-t cursor-pointer from-gray-800 to-gray-900 hover:from-gray-900 hover:to-gray-950 text-white font-bold py-3 px-6 rounded-lg text-lg md:text-2xl hover:bg-gray-800 transition duration-300 transform hover:-translate-y-0.5 hover:scale-105 whitespace-nowrap"
                >
                  Regístrate gratis{" "}
                  <ChevronRightIcon className="inline size-6 ml-2 animate-pulse" />
                </button>
              )}
            </div>
          </div>

          <div className="xl:col-span-2 2xl:col-span-1 lg:hidden xl:flex flex-col h-full">
            <div className="relative xl:h-[90%] 2xl:h-full flex items-end xl:mt-auto">
              <Image
                src="/mainPageImage.webp"
                alt="Cursos disponibles"
                fill
                className="object-contain object-bottom"
                sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
                priority
              />
            </div>
          </div>
        </div>
      </div>

      <div className="col-span-3 row-start-2 bg-white">
        <div className="flex grid-cols-2 max-w-[90%] sm:max-w-[80%] md:max-w-[70%] lg:max-w-[70%] xl:max-w-[70%] 2xl:max-w-[55%] mx-auto py-8 items-center justify-between z-10">
          <div className="col-span-1 inline-flex max-w-md">
            <AcademicCapIcon className="size-20" />
            <div className="my-auto px-2">
              <h1 className="text-2xl font-extrabold">+20</h1>
              <p className="md:hidden">Cursos gratis</p>
              <p className="hidden md:flex">Cursos gratis en línea</p>
            </div>
          </div>
          <div className="col-span-1 inline-flex max-w-md">
            <StarIcon className="size-20" />
            <div className="my-auto px-2">
              <h1 className="text-2xl font-extrabold">+1 Millon</h1>
              <p className="md:hidden">de estudiantes</p>
              <p className="hidden md:flex">de estudiantes felices</p>
            </div>
          </div>
        </div>
      </div>
      <CoursesMainPage courses={courses} />
      <div className="col-span-3 row-start-4 bg-white">
        <div className="flex flex-col md:flex-row items-center justify-between max-w-6xl mx-auto px-4 py-12 gap-8">
          <div className="w-full md:w-1/2 space-y-4">
            <h2 className="text-3xl font-bold text-teal-600">
              Aprende de forma práctica
            </h2>
            <p className="text-gray-700 text-lg">
              Los cursos incluyen lecturas, videos, proyectos y actividades de
              la vida real que te ayudarán a colocar en práctica tu aprendizaje.
            </p>
          </div>

          <div className="w-full md:w-1/2 relative">
            <div className="rounded-lg overflow-hidden shadow-lg">
              <Image
                src="/mainPageImage2.webp"
                alt="Estudiante aprendiendo en computadora"
                width={600}
                height={400}
                className="object-cover"
              />
            </div>
          </div>
        </div>
      </div>
      <div className="col-span-3 row-start-5">
        <div className="bg-gray-100 w-full py-16">
          <div className="flex flex-col md:flex-row items-center justify-between max-w-6xl mx-auto px-4 gap-8">
            <div className="w-full md:w-1/2 space-y-4">
              <h2 className="text-3xl font-bold">
                <span className="text-teal-700">Obtén un </span>
                <span className="text-teal-500">Certificado Oficial </span>
                <span className="text-teal-700">de INTELLECTA</span>
              </h2>

              <p className="text-gray-700 text-lg">
                Demuestra tus habilidades con certificaciones reconocidas por la
                industria a nivel internacional.
              </p>

              <div>
                <a
                  href="/home/certificates"
                  className="text-teal-500 font-medium hover:text-teal-600 transition-colors"
                >
                  Saber más
                </a>
              </div>
            </div>

            <div className="w-full md:w-1/2 relative">
              <div className="shadow-xl rounded-lg overflow-hidden bg-white p-2">
                <Image
                  src="/mainPageImage3.webp"
                  alt="Certificado Oficial de INTELLECTA"
                  width={600}
                  height={400}
                  className="object-contain"
                />
              </div>
            </div>
          </div>
        </div>
      </div>
      {!user && (
        <div className="col-span-3 row-start-6">
          <div className="w-full bg-yellow-200 py-16 px-4 text-center">
            <div className="max-w-3xl mx-auto space-y-8">
              <h2 className="text-2xl md:text-3xl font-bold text-center">
                Únete a más de 8 millones de estudiantes
                <br className="hidden md:block" />
                que aprenden y se certifican con
                <br className="hidden md:block" />
                INTELLECTA
              </h2>

              <div>
                <Button
                  onClick={() => router.push("/auth/register")}
                  text="Crear cuenta gratis"
                  className="bg-teal-600 hover:bg-teal-700 text-white py-3 px-6 rounded-md border border-teal-700 transition-colors duration-300 font-medium"
                />
              </div>

              <p className="text-sm text-gray-700">
                Acceso gratis por siempre, sin límites de tiempo.
              </p>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
