"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { useAuth } from "@/libs/context/AuthContext";
import Image from "next/image";
import {
  ChevronLeft,
  ChevronRight,
  CreditCard,
  GraduationCap,
  Home,
  LogOut,
  Menu,
  User,
  X,
  Settings,
  Bell,
} from "lucide-react";

interface SidebarItem {
  name: string;
  href: string;
  rol?: "admin";
  icon: React.ComponentType<React.SVGProps<SVGSVGElement>>;
}

const sidebarItems: SidebarItem[] = [
  { name: "Dashboard", href: "/panel", icon: Home },
  { name: "Cursos", href: "/panel/courses", icon: GraduationCap },
  {
    name: "Usuarios",
    href: "/panel/users",
    icon: User,
    rol: "admin",
  },
  { name: "Pagos", href: "/panel/payments", icon: CreditCard },
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
      {/* Botón para móvil con diseño mejorado */}
      <button
        onClick={toggleMobileSidebar}
        className="lg:hidden fixed top-4 left-4 z-50 p-3 rounded-2xl bg-gradient-to-br from-white to-gray-50 shadow-xl border border-gray-200/50 hover:shadow-2xl hover:scale-105 transition-all duration-300 backdrop-blur-sm"
      >
        {isMobileOpen ? (
          <X className="h-6 w-6 text-gray-700" />
        ) : (
          <Menu className="h-6 w-6 text-gray-700" />
        )}
      </button>

      {/* Overlay móvil con blur */}
      {isMobileOpen && (
        <div
          className="lg:hidden fixed inset-0 bg-black/40 backdrop-blur-sm z-30 transition-all duration-300"
          onClick={toggleMobileSidebar}
        />
      )}

      {/* Sidebar principal */}
      <aside
        className={`fixed top-0 left-0 h-screen bg-gradient-to-b from-white via-gray-50 to-white border-r border-gray-200/80 shadow-2xl transition-all duration-300 z-40 transform ${
          isMobileOpen ? "translate-x-0" : "-translate-x-full"
        } lg:translate-x-0 lg:static lg:block ${isCollapsed ? "w-20" : "w-72"}`}
      >
        <button
          onClick={onToggle}
          className="hidden lg:flex absolute top-6 -right-4 z-10 items-center justify-center w-8 h-8 rounded-full bg-gradient-to-r from-teal-500 to-cyan-500 shadow-lg hover:shadow-xl hover:scale-110 transition-all duration-300"
        >
          {isCollapsed ? (
            <ChevronRight className="h-4 w-4 text-white" />
          ) : (
            <ChevronLeft className="h-4 w-4 text-white" />
          )}
        </button>

        <div className="grid grid-rows-[auto_1fr_auto] h-full relative overflow-hidden">
          <div className="relative">
            {!isCollapsed ? (
              <div className="relative flex items-center justify-center h-20 px-6">
                <div className="flex items-center space-x-3">
                  <div>
                    <h1 className="text-xl font-bold bg-gradient-to-r from-teal-600 to-cyan-600 bg-clip-text text-transparent">
                      Panel
                    </h1>
                  </div>
                </div>
              </div>
            ) : (
              <div className="relative flex items-center justify-center h-20"></div>
            )}
          </div>

          {/* Navegación */}
          <nav className="px-4 py-6 space-y-2">
            {sidebarItems.map((item, index) => {
              const isActive = pathname === item.href;
              return (
                <Link
                  key={index}
                  href={item.href}
                  onClick={() => setIsMobileOpen(false)}
                  className={`group relative flex items-center px-4 py-3.5 text-sm font-medium rounded-2xl transition-all duration-300 ${
                    item.rol && item.rol !== user?.rol ? "hidden" : ""
                  } ${
                    isActive
                      ? "bg-gradient-to-r from-teal-500/90 to-cyan-600/90 text-white scale-105"
                      : "text-gray-700 hover:bg-gray-100/80 hover:text-gray-900 hover:scale-102"
                  } ${isCollapsed ? "justify-center" : ""}`}
                  title={isCollapsed ? item.name : ""}
                >
                  {/* Icono */}
                  <div className={`relative z-10 ${isCollapsed ? "" : "mr-4"}`}>
                    <item.icon
                      className={`h-5 w-5 transition-all duration-300 ${
                        isActive
                          ? "text-white drop-shadow-sm"
                          : "text-gray-500 group-hover:text-teal-600"
                      }`}
                    />
                  </div>

                  {/* Texto */}
                  {!isCollapsed && (
                    <span className="relative z-10 truncate font-medium">
                      {item.name}
                    </span>
                  )}

                  {/* Indicador de punto activo */}
                  {isActive && !isCollapsed && (
                    <div className="ml-auto relative z-10">
                      <div className="w-2 h-2 bg-white rounded-full shadow-sm animate-pulse" />
                    </div>
                  )}

                  {/* Efecto hover */}
                  <div className="absolute inset-0 rounded-2xl bg-gradient-to-r from-teal-500/0 to-cyan-500/0 group-hover:from-teal-500/5 group-hover:to-cyan-500/5 transition-all duration-300"></div>
                </Link>
              );
            })}

            {/* Separador */}
            <div className="my-6 mx-4 h-px bg-gradient-to-r from-transparent via-gray-300 to-transparent"></div>

            {/* Botón de salir */}
            <Link
              href={"/"}
              onClick={() => setIsMobileOpen(false)}
              className={`group relative flex items-center px-4 py-3.5 text-sm font-medium rounded-2xl transition-all duration-300 bg-gradient-to-r from-red-500/90 to-pink-600/90 hover:from-red-600 hover:to-pink-700 hover:scale-105 text-white ${
                isCollapsed ? "justify-center" : ""
              }`}
              title="Salir del panel"
            >
              <div className={`relative z-10 ${isCollapsed ? "" : "mr-4"}`}>
                <LogOut className="h-5 w-5 text-white" />
              </div>

              {!isCollapsed && (
                <span className="relative z-10 truncate font-medium">
                  Salir del panel
                </span>
              )}
            </Link>
          </nav>

          {/* Sección de usuario mejorada */}
          {!loading && (
            <div className="relative border-t border-gray-200/80 p-5">
              {/* Decoración de fondo */}
              <div className="absolute inset-0 bg-gradient-to-t from-gray-50/80 to-transparent"></div>

              <div
                className={`relative z-10 ${
                  isCollapsed
                    ? "flex justify-center"
                    : "flex items-center space-x-4"
                }`}
              >
                {/* Avatar con indicador online */}
                <div className="relative">
                  <div className="h-12 w-12 relative overflow-hidden rounded-full shadow-lg">
                    <Image
                      alt={user ? user.username : "Profile picture"}
                      fill
                      className="object-cover"
                      src={`/userImages/${user?.uuid}.jpeg`}
                    />
                  </div>
                </div>

                {/* Información del usuario */}
                {!isCollapsed && (
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center justify-between">
                      <div>
                        <p className="text-sm font-semibold text-gray-800 truncate">
                          {user && user.username}
                        </p>
                        <p className="text-xs text-gray-500 truncate">
                          {user && user.email}
                        </p>
                      </div>
                    </div>
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
