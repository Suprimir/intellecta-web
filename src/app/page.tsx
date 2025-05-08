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
      <div className="col-span-3 row-start-1 bg-[#FFBD008A]">
        <div className="grid grid-cols-1 lg:grid-cols-3 max-w-7xl mx-auto py-8 px-4 gap-6 items-center">
          <div className="lg:col-span-2">
            <h1 className="text-3xl sm:text-4xl md:text-6xl font-extrabold leading-tight max-w-[80%]">
              Contamos con +20 cursos con certificados en diversas áreas
            </h1>
          </div>

          <div className="grid grid-cols-2 gap-4 items-center">
            <div className="flex justify-start">
              <Hyperlink
                text="Regístrate gratis"
                href="/auth/register"
                className="bg-black text-white font-bold py-3 px-6 rounded-lg text-lg hover:bg-gray-800 transition-colors whitespace-nowrap"
              />
            </div>

            <div className="relative h-32 w-full">
              <Image
                src="/mainpageImage.png"
                alt="Cursos disponibles"
                fill
                className="object-contain object-right"
                sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
              />
            </div>
          </div>
        </div>
      </div>

      <div className="col-span-3 row-start-2 bg-white">
        <div className="flex max-w-[100%] lg:max-w-[80%] mx-auto py-8 items-center justify-between z-10">
          <div className="col-span-1 inline-flex max-w-md">
            <AcademicCapIcon className="size-20" />
            <div className="my-auto px-2">
              <h1 className="text-2xl font-extrabold">+6.000</h1>
              <p>Cursos gratis en línea</p>
            </div>
          </div>
          <div className="col-span-1 inline-flex max-w-md">
            <StarIcon className="size-20" />
            <div className="my-auto px-2">
              <h1 className="text-2xl font-extrabold">+8 Millones</h1>
              <p>de estudiantes felices</p>
            </div>
          </div>
          <div className="col-span-1 inline-flex max-w-md">
            <GlobeAmericasIcon className="size-20" />
            <div className="my-auto px-2">
              <h1 className="text-2xl font-extrabold">+162</h1>
              <p>Países alcanzados</p>
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
