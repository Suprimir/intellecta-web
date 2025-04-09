interface CourseCardProps {
  title: string;
  img: string;
  description: string;
}

export default function CourseCard({
  title,
  img,
  description,
}: CourseCardProps) {
  return (
    <div className="bg-slate-200 w-80 rounded-2xl m-2 p-2">
      <img
        src={img}
        className="w-78 h-40 place-self-center p-2 rounded-2xl"
      ></img>
      <h1 className="text-2xl font-bold">{title}</h1>
      <p>{description}</p>
    </div>
  );
}
