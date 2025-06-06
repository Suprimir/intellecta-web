export default function TablePanelSkeleton() {
  return (
    <div className="w-full animate-pulse">
      {/* Header skeleton */}
      <div className="mb-8 pt-16 lg:pt-0">
        <div className="h-8 bg-gray-200 rounded-md w-64 mb-2"></div>
        <div className="h-4 bg-gray-200 rounded-md w-80"></div>
      </div>

      {/* Button skeleton */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
        <div className="col-span-1">
          <div className="h-12 bg-gray-200 rounded-xl w-40"></div>
        </div>

        <div className="col-span-full">
          {/* Table skeleton */}
          <div className="relative overflow-x-auto rounded-t-2xl shadow">
            <table className="w-full text-sm text-left">
              {/* Table header skeleton */}
              <thead className="bg-gray-50 border-b border-gray-200">
                <tr>
                  <th className="px-6 py-4">
                    <div className="h-4 bg-gray-300 rounded w-16"></div>
                  </th>
                  <th className="px-6 py-4 hidden xl:table-cell">
                    <div className="h-4 bg-gray-300 rounded w-24"></div>
                  </th>
                  <th className="px-6 py-4 hidden md:table-cell">
                    <div className="h-4 bg-gray-300 rounded w-16"></div>
                  </th>
                  <th className="px-6 py-4">
                    <div className="h-4 bg-gray-300 rounded w-16"></div>
                  </th>
                  <th className="px-6 py-4">
                    <div className="h-4 bg-gray-300 rounded w-20"></div>
                  </th>
                  <th className="px-6 py-4">
                    <div className="h-4 bg-gray-300 rounded w-20"></div>
                  </th>
                </tr>
              </thead>

              {/* Table body skeleton */}
              <tbody className="divide-y divide-gray-200">
                {[...Array(8)].map((_, index) => (
                  <tr key={index} className="bg-white">
                    {/* Course name */}
                    <td className="px-6 py-4">
                      <div className="h-4 bg-gray-200 rounded w-32"></div>
                    </td>

                    {/* Description - hidden on mobile */}
                    <td className="px-6 py-4 hidden xl:table-cell">
                      <div className="h-4 bg-gray-200 rounded w-48"></div>
                    </td>

                    {/* Price - hidden on mobile */}
                    <td className="px-6 py-4 hidden md:table-cell">
                      <div className="h-4 bg-gray-200 rounded w-20"></div>
                    </td>

                    {/* Date */}
                    <td className="px-6 py-4">
                      <div className="h-4 bg-gray-200 rounded w-24"></div>
                    </td>

                    {/* Category */}
                    <td className="px-6 py-4">
                      <div className="h-6 bg-gray-200 rounded-full w-20"></div>
                    </td>

                    {/* Actions */}
                    <td className="px-6 py-4">
                      <div className="flex gap-2">
                        <div className="h-8 w-8 bg-gray-200 rounded-md"></div>
                        <div className="h-8 w-8 bg-gray-200 rounded-md"></div>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          {/* Pagination skeleton */}
          <div className="flex items-center justify-between border-t shadow border-gray-200 bg-white px-4 py-3 sm:px-6 rounded-b-2xl">
            {/* Mobile pagination skeleton */}
            <div className="flex flex-1 justify-between sm:hidden">
              <div className="h-9 bg-gray-200 rounded-md w-20"></div>
              <div className="h-9 bg-gray-200 rounded-md w-16"></div>
            </div>

            {/* Desktop pagination skeleton */}
            <div className="hidden sm:flex sm:flex-1 sm:items-center sm:justify-between">
              <div>
                <div className="h-4 bg-gray-200 rounded w-48"></div>
              </div>
              <div>
                <nav className="isolate inline-flex -space-x-px rounded-md shadow-xs">
                  {/* Previous button */}
                  <div className="h-9 w-9 bg-gray-200 rounded-l-md"></div>

                  {/* Page numbers */}
                  {[...Array(5)].map((_, index) => (
                    <div
                      key={index}
                      className="h-9 w-9 bg-gray-200 border-l border-gray-300"
                    ></div>
                  ))}

                  {/* Next button */}
                  <div className="h-9 w-9 bg-gray-200 rounded-r-md border-l border-gray-300"></div>
                </nav>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
