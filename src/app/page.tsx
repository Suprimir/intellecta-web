"use client";

import Image from "next/image";
import Hyperlink from "@/components/common/Hyperlink";
import CoursesMainPage from "@/components/CoursesMainPage";
import {
  AcademicCapIcon,
  StarIcon,
  GlobeAmericasIcon,
} from "@heroicons/react/24/outline";

export default function HomePage() {
  return (
    <div className="grid grid-cols-3 grid-rows-1">
      <div className="col-span-3 row-start-1 bg-[#FFBD008A] h-[400px] lg:h-[600px]">
        <div className="lg:grid lg:grid-cols-4 h-full max-w-[90%] mx-auto gap-6">
          <div className="col-span-4 xl:col-span-2 2xl:col-span-3 flex flex-col h-full">
            <div className="flex-1 flex flex-col justify-center xl:items-start space-y-8 items-center">
              <h1 className="text-center xl:text-start text-3xl sm:text-4xl md:text-5xl lg:text-[5rem] xl:text-6xl 2xl:text-[5rem] font-extrabold leading-tight max-w-[100%]">
                Contamos con +20 cursos con certificados en diversas áreas
              </h1>
              <Hyperlink
                text="Regístrate gratis"
                href="/auth/register"
                className="bg-black text-white font-bold py-3 px-6 rounded-lg text-lg md:text-2xl hover:bg-gray-800 transition-colors whitespace-nowrap"
              />
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

      <div className="col-span-3 row-start-3">
        <CoursesMainPage />
      </div>
      <div className="col-span-3 row-start-4">4</div>
      <div className="col-span-3 row-start-5">5</div>
    </div>
  );
}
