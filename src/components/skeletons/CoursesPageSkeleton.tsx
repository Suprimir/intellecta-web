import React from "react";

export default function CoursesPageSkeleton() {
  return (
    <div className="w-full max-w-screen-xl mx-auto px-4 py-6">
      <div className="mb-6">
        <div className="h-10 bg-gray-100 rounded-lg w-full max-w-md animate-pulse"></div>
      </div>

      <div className="flex justify-between items-center mb-8">
        <div className="flex items-center gap-4">
          <div className="h-8 w-24 bg-gray-200 rounded-md animate-pulse"></div>
          <div className="h-8 w-32 bg-gray-200 rounded-md animate-pulse"></div>
        </div>
        <div className="h-8 w-32 bg-gray-200 rounded-md animate-pulse"></div>
      </div>

      {/* Course grid skeleton */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {[1, 2, 3, 4, 5, 6].map((item) => (
          <div
            key={item}
            className="bg-white rounded-lg shadow overflow-hidden"
          >
            {/* Course image skeleton */}
            <div className="h-48 bg-gray-300 animate-pulse"></div>

            {/* Course content skeleton */}
            <div className="p-4">
              {/* Title */}
              <div className="h-6 bg-gray-200 rounded-md w-3/4 mb-3 animate-pulse"></div>

              {/* Description */}
              <div className="h-4 bg-gray-100 rounded-md w-full mb-2 animate-pulse"></div>
              <div className="h-4 bg-gray-100 rounded-md w-5/6 mb-4 animate-pulse"></div>

              {/* Author */}
              <div className="h-4 bg-gray-200 rounded-md w-40 mb-3 animate-pulse"></div>

              {/* Rating */}
              <div className="flex items-center gap-1 mb-2">
                {[1, 2, 3, 4, 5].map((star) => (
                  <div
                    key={star}
                    className="h-4 w-4 bg-gray-200 rounded-full animate-pulse"
                  ></div>
                ))}
                <div className="h-4 w-8 bg-gray-100 rounded-md ml-2 animate-pulse"></div>
              </div>

              {/* Duration */}
              <div className="h-4 bg-gray-100 rounded-md w-32 mb-4 animate-pulse"></div>

              {/* Price or button */}
              <div className="flex justify-between items-center mt-4">
                <div className="h-6 bg-gray-300 rounded-md w-24 animate-pulse"></div>
                <div className="h-10 bg-gray-300 rounded-md w-40 animate-pulse"></div>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
