import CourseCard from "@/components/CourseCard";

export default function Admin() {
  return (
    <div>
      <h1>ADMIN PANEL FOR DEBUGGING</h1>
      <button className="bg-amber-400">VER CURSOS</button>
      <CourseCard
        img="https://imgs.search.brave.com/TG6Wf6OW5KG0D6xdmhYOU-yzyejyVu7ItVv0o91YaJg/rs:fit:860:0:0:0/g:ce/aHR0cHM6Ly93d3cu/Z29kYWRkeS5jb20v/cmVzb3VyY2VzL2xh/dGFtL3dwLWNvbnRl/bnQvdXBsb2Fkcy9z/aXRlcy80LzIwMjQv/MDMvcG9ydGFkYV9x/dWUtZXMtamF2YXNj/cmlwdC5qcGc_c2l6/ZT0zODQweDA"
        title="XDDD"
        description="EL PEPE TILIN"
      ></CourseCard>
    </div>
  );
}
