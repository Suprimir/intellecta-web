import Hyperlink from "@/components/common/Hyperlink";
import Image from "next/image";

export default function HomePage() {
  return (
    <div className="w-full bg-[#F0F5FF] relative overflow-hidden">
      <div className="container mx-auto flex items-center justify-between py-12 px-4 md:px-8 relative">
        <div className="flex flex-col max-w-md z-10">
          <h1 className="text-[#031B4E] font-extrabold text-4xl leading-tight">
            Estudia gratis y gane certificado
            <br />
            en +6.000 cursos online
          </h1>

          <button className="mt-6 py-3 px-6 bg-[#2979FF] text-white font-medium rounded-md text-lg w-fit">
            Crear cuenta gratis
          </button>

          <p className="text-xs text-gray-600 mt-3">
            *Sin datos de tarjetas y sin llamadas de ventas.
          </p>
        </div>
        <div className="relative h-96 md:w-1/2 flex items-center justify-end">
          <div className="absolute right-0 top-0 h-full">
            <Image
              src="/mainPageImage.webp"
              alt="Estudiante sosteniendo un certificado"
              width={550}
              height={400}
              priority
              style={{ objectFit: "contain" }}
            />
          </div>
        </div>
      </div>
    </div>
  );
}
