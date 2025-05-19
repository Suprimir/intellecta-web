"use client";

export default function DashboardPageSkeleton() {
  return (
    <main className="min-h-screen px-6 py-10 bg-gray-100">
      <div className="max-w-7xl mx-auto">
        <div className="mb-8">
          <div className="h-8 w-48 bg-gray-300 rounded animate-pulse mb-4"></div>
          <div className="flex gap-4">
            <div className="h-16 w-32 bg-gray-300 rounded-lg animate-pulse"></div>
            <div className="h-16 flex-1 bg-gray-300 rounded-lg animate-pulse"></div>
          </div>
        </div>

        <div className="flex flex-wrap gap-6">
          {Array.from({ length: 6 }).map((_, i) => (
            <div
              key={i}
              className="w-full sm:w-[calc(50%-12px)] md:w-[calc(33.333%-16px)] bg-white rounded-xl shadow animate-pulse"
            >
              <div className="h-40 bg-gray-300 rounded-t-xl"></div>
              <div className="p-4 space-y-3">
                <div className="h-4 w-1/2 bg-gray-300 rounded"></div>
                <div className="h-3 w-3/4 bg-gray-200 rounded"></div>
                <div className="h-3 w-1/2 bg-gray-200 rounded"></div>
                <div className="h-4 w-24 bg-gray-300 rounded mt-2"></div>
                <div className="h-10 w-full bg-gray-300 rounded-lg"></div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </main>
  );
}
