interface CourseCardProps {
  title: string;
  img?: string;
  description: string;
}

export default function CourseCard({
  title,
  img,
  description,
}: CourseCardProps) {
  return (
    <div className="bg-[#cccccc] max-w-[95%] rounded-2xl m-2 p-2">
      <img
        src={img === null ? "" : img}
        className="w-78 h-40 place-self-center p-2 rounded-2xl"
      ></img>
      <h1 className="text-xl text-[#31B2A5] font-bold">{title}</h1>
      <p className="text-sm text-[#687695]">Titulo a Certificar</p>
      <p className="text-sm text-[#0D7682]">Certificado</p>
    </div>
  );
}
