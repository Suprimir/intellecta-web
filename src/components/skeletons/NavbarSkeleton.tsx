import React from "react";

export default function NavBarSkeleton() {
  return (
    <div className="hidden lg:flex lg:flex-1 gap-2 lg:justify-end items-center">
      {/* Search box skeleton */}
      <div className="hidden 2xl:flex items-center gap-2 rounded-md border-2 border-gray-200 px-3 py-1.5 w-64">
        <div className="h-5 w-40 bg-gray-200 rounded-md animate-pulse"></div>
        <div className="w-5 h-5 bg-gray-300 rounded-md animate-pulse"></div>
      </div>

      {/* User action buttons/profile skeleton */}
      <div className="flex items-center gap-2">
        {/* This can be either login/register buttons or cart/profile when logged in */}
        <div className="h-8 w-24 bg-gray-300 rounded-md animate-pulse"></div>
        <div className="h-8 w-24 bg-gray-400 rounded-md animate-pulse"></div>
      </div>
    </div>
  );
}
