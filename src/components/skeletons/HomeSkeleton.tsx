import React from "react";

export default function HomeSkeleton() {
  return (
    <div className="grid grid-cols-3 grid-rows-1">
      {/* Hero Section */}
      <div className="col-span-3 row-start-1 bg-yellow-100 h-128">
        <div className="max-w-[90%] mx-auto h-full">
          <div className="flex flex-col h-full justify-center items-center">
            <div className="h-8 w-3/4 bg-gray-300 rounded-md animate-pulse mb-6"></div>
            <div className="h-10 w-40 bg-gray-400 rounded-lg animate-pulse"></div>
          </div>
        </div>
      </div>

      {/* Stats Section */}
      <div className="col-span-3 row-start-2 bg-white py-4">
        <div className="flex justify-between max-w-[80%] mx-auto">
          <div className="flex items-center">
            <div className="bg-gray-200 p-3 rounded-full flex items-center justify-center">
              <svg
                xmlns="http://www.w3.org/2000/svg"
                width="24"
                height="24"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
                className="text-gray-400 w-10 h-10"
              >
                <path d="M22 10v6M2 10l10-5 10 5-10 5z"></path>
                <path d="M6 12v5c0 2 2 3 5 3s5-1 5-3v-5"></path>
              </svg>
            </div>
            <div className="ml-3">
              <div className="h-6 w-20 bg-gray-300 rounded-md animate-pulse"></div>
              <div className="h-4 w-24 bg-gray-200 rounded-md animate-pulse mt-2"></div>
            </div>
          </div>

          <div className="flex items-center">
            <div className="bg-gray-200 p-3 rounded-full flex items-center justify-center">
              <svg
                xmlns="http://www.w3.org/2000/svg"
                width="24"
                height="24"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
                className="text-gray-400 w-10 h-10"
              >
                <polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2"></polygon>
              </svg>
            </div>
            <div className="ml-3">
              <div className="h-6 w-24 bg-gray-300 rounded-md animate-pulse"></div>
              <div className="h-4 w-28 bg-gray-200 rounded-md animate-pulse mt-2"></div>
            </div>
          </div>
        </div>
      </div>

      {/* Course Cards Skeleton */}
      <div className="col-span-4 row-start-3 bg-white py-8">
        <div className="max-w-[90%] mx-auto">
          <div className="h-8 w-60 bg-gray-300 rounded-md animate-pulse mb-6"></div>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
            {Array.from({ length: 8 }).map((_, index) => (
              <div
                key={index}
                className="bg-gray-100 rounded-lg shadow-md overflow-hidden"
              >
                <div className="h-48 bg-gray-300 animate-pulse"></div>
                <div className="p-4 space-y-3">
                  <div className="h-6 w-3/4 bg-gray-300 rounded-md animate-pulse"></div>
                  <div className="h-4 w-full bg-gray-200 rounded-md animate-pulse"></div>
                  <div className="h-4 w-2/3 bg-gray-200 rounded-md animate-pulse"></div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
