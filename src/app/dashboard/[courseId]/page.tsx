"use client";

import { useAuth } from "@/libs/context/AuthContext";
import { Content } from "@/types/api";
import { useEffect, useState } from "react";

export default function ContentCoursePage({
  params,
}: {
  params: Promise<{ courseId: number }>;
}) {
  const [contents, setContents] = useState<Content[]>();
  const [loading, setLoading] = useState(true);
  const { user, loadingUser } = useAuth();

  useEffect(() => {
    const loadInitialData = async () => {
      try {
        const { courseId } = await params;

        const res = await fetch(`/api/contents/courses/${courseId}`);
        const contentsData: Content[] = await res.json();

        setContents(contentsData);
      } catch (err) {
        console.error(err);
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

  return (
    <div className="grid grid-cols-3">
      <div className="col-span-3 text-center py-4 font-extrabold bg-gray-300">
        {contents && contents[0].unit_Title}
      </div>
      <div className="col-span-2 p-8 bg-white">
        <video
          src={contents && contents[0].media_Path}
          controls={true}
          className="w-[968px] h-[480px] rounded-2xl bg-black"
        />
      </div>
      <div className="col-span-1 bg-white p-8">
        <div className="row row-start-1 text-center, bg-gray-200 p-4 rounded-xl">
          Unidad {contents && contents[0].unit_Number}:{" "}
          {contents && contents[0].unit_Title}
        </div>
      </div>
    </div>
  );
}
