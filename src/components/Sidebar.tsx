"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import {
  HomeIcon,
  AcademicCapIcon,
  UsersIcon,
  CreditCardIcon,
  Bars3Icon,
  XMarkIcon,
  UserGroupIcon,
  BellIcon,
  ChevronLeftIcon,
  ChevronRightIcon,
} from "@heroicons/react/24/outline";
import { useAuth } from "@/libs/context/AuthContext";
import Image from "next/image";

interface SidebarItem {
  name: string;
  href: string;
  rol?: "admin";
  icon: React.ComponentType<React.SVGProps<SVGSVGElement>>;
}

const sidebarItems: SidebarItem[] = [
  { name: "Dashboard", href: "/panel", icon: HomeIcon },
  { name: "Cursos", href: "/panel/courses", icon: AcademicCapIcon },
  {
    name: "Usuarios",
    href: "/panel/users",
    icon: UsersIcon,
    rol: "admin",
  },
  { name: "Pagos", href: "/panel/payments", icon: CreditCardIcon },
];

interface AdminSidebarProps {
  isCollapsed: boolean;
  onToggle: () => void;
}

export default function Sidebar({ isCollapsed, onToggle }: AdminSidebarProps) {
  const [isMobileOpen, setIsMobileOpen] = useState(false);
  const [loading, setLoading] = useState(true);
  const pathname = usePathname();
  const { user, loadingUser } = useAuth();

  useEffect(() => {
    const loadInitialData = async () => {
      try {
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
      } catch (err) {
        console.error("Error al inciar los datos:", err);
      } finally {
        setLoading(false);
      }
    };

    loadInitialData();
  }, [loadingUser]);
  const toggleMobileSidebar = () => {
    setIsMobileOpen(!isMobileOpen);
  };

  return (
    <div>
      {/* Boton para el layout de un celular */}
      <button
        onClick={toggleMobileSidebar}
        className="lg:hidden fixed top-4 left-4 z-50 p-2 rounded-xl bg-white shadow-lg border border-gray-200 hover:bg-gray-50 transition-all duration-200"
      >
        {isMobileOpen ? (
          <XMarkIcon className="h-6 w-6 text-gray-600" />
        ) : (
          <Bars3Icon className="h-6 w-6 text-gray-600" />
        )}
      </button>

      {/* Overlay móvil */}
      {isMobileOpen && (
        <div
          className="lg:hidden fixed inset-0 bg-black bg-opacity-50 z-30"
          onClick={toggleMobileSidebar}
        />
      )}

      {/* Sidebar */}
      <aside
        className={`fixed top-0 left-0 h-screen bg-white shadow-2xl border-r border-gray-100 transition-all duration-300 z-40 transform ${
          isMobileOpen ? "translate-x-0" : "-translate-x-full"
        } lg:translate-x-0 lg:static lg:block ${isCollapsed ? "w-20" : "w-64"}`}
      >
        {/* Boton para hacer mas chico o mas grande */}
        <button
          onClick={onToggle}
          className="hidden lg:block absolute top-4 right-4 z-10 p-2 rounded-xl bg-white shadow border border-gray-200 hover:bg-gray-50 transition-all duration-200"
        >
          {isCollapsed ? (
            <ChevronRightIcon className="h-5 w-5 text-gray-600" />
          ) : (
            <ChevronLeftIcon className="h-5 w-5 text-gray-600" />
          )}
        </button>
        <div className="grid grid-rows-[auto_1fr_auto] h-full">
          {!isCollapsed ? (
            <div className="flex items-center justify-center h-20">
              <h1 className="text-lg font-semibold text-gray-800">Panel</h1>
            </div>
          ) : (
            ""
          )}
          {/* Navegación con grid y scroll */}
          <nav className="px-3 py-6">
            {sidebarItems.map((item, index) => {
              const isActive = pathname === item.href;
              return (
                <Link
                  key={index}
                  href={item.href}
                  onClick={() => setIsMobileOpen(false)}
                  className={`grid grid-cols-[auto_1fr_auto] items-center my-2 px-3 py-3 text-sm font-medium rounded-2xl transition-all duration-200 relative ${
                    item.rol && item.rol !== user?.rol ? "hidden" : ""
                  } ${
                    isActive
                      ? "bg-[#599f96] text-white shadow-md transform scale-105"
                      : "text-gray-700 hover:bg-gray-50 hover:text-[#599f96] hover:shadow-md"
                  } ${isCollapsed ? "justify-center grid-cols-1 mt-10" : ""}`}
                  title={isCollapsed ? item.name : ""}
                >
                  <item.icon
                    className={`h-5 w-5 transition-all duration-200 relative z-10 mx-auto ${
                      isActive
                        ? "text-white"
                        : "text-gray-500 group-hover:text-[#599f96]"
                    } ${isCollapsed ? "" : "mr-3"}`}
                  />
                  {!isCollapsed && (
                    <span className="relative z-10 truncate">{item.name}</span>
                  )}
                  {isActive && !isCollapsed && (
                    <div className="ml-auto">
                      <div className="w-2 h-2 bg-white rounded-full opacity-60" />
                    </div>
                  )}
                </Link>
              );
            })}
          </nav>

          {/* Usuario */}
          {!loading && (
            <div className="border-t border-gray-100 p-4">
              <div
                className={`grid ${
                  isCollapsed ? "justify-center" : "grid-cols-[auto_1fr] gap-3"
                }`}
              >
                <div className="h-10 w-10 relative">
                  <Image
                    alt={user ? user.username : "Profile picture"}
                    fill
                    className="object-contain rounded-full"
                    src={`/userImages/${user?.uuid}.jpeg`}
                  />
                </div>
                {!isCollapsed && (
                  <div className="min-w-0">
                    <p className="text-sm font-semibold text-gray-800 truncate">
                      {user && user.username}
                    </p>
                    <p className="text-xs text-gray-500 truncate">
                      {user && user.email}
                    </p>
                  </div>
                )}
              </div>
            </div>
          )}
        </div>
      </aside>
    </div>
  );
}
