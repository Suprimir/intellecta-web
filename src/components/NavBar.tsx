"use client";

import { useEffect, useState, useRef, FormEvent } from "react";
import { useRouter, usePathname } from "next/navigation";
import Image from "next/image";
import "../styles/NavBar.css";
import {
  CommandLineIcon,
  PaintBrushIcon,
  BriefcaseIcon,
  BookOpenIcon,
  LanguageIcon,
  Bars3Icon,
  XMarkIcon,
  ShoppingCartIcon,
} from "@heroicons/react/24/outline";
import { ChevronDownIcon, EyeIcon } from "@heroicons/react/20/solid";
import Button from "./common/Button";
import { useAuth } from "@/libs/context/AuthContext";
import NavBarSkeleton from "./skeletons/NavbarSkeleton";
import { Search } from "lucide-react";

const products = [
  {
    name: "Tecnología y Programación",
    description: "Crea software y domina herramientas digitales.",
    href: "/home/courses?category=Programación",
    icon: CommandLineIcon,
  },
  {
    name: "Arte y Diseño",
    description: "Desarrolla tu lado creativo.",
    href: "/home/courses?category=Arte",
    icon: PaintBrushIcon,
  },
  {
    name: "Negocios y Emprendimiento",
    description: "Aprende a emprender y liderar.",
    href: "/home/courses?category=Negocios",
    icon: BriefcaseIcon,
  },
  {
    name: "Educación y Desarrollo Personal",
    description: "Mejora tus habilidades y crecimiento personal.",
    href: "/home/courses?category=Educación",
    icon: BookOpenIcon,
  },
  {
    name: "Idiomas",
    description: "Aprende o mejora un idioma.",
    href: "/home/courses?category=Idiomas",
    icon: LanguageIcon,
  },
];
const callsToAction = [
  { name: "Ver todos los cursos", href: "/home/courses", icon: EyeIcon },
  { name: "Ver mis cursos", href: "/dashboard", icon: BookOpenIcon },
];

export default function NavBar() {
  const pathname = usePathname();
  const [activeRoute, setActiveRoute] = useState(pathname);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [profileMenuOpen, setProfileMenuOpen] = useState(false);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");
  const [navState, setNavState] = useState({
    showLoginButton: false,
    showRegisterButton: false,
    showSearchBar: false,
  });

  const router = useRouter();
  const dropdownRef = useRef<HTMLDivElement | null>(null);
  const profileButtonRef = useRef<HTMLButtonElement | null>(null);
  const { user, loadingUser } = useAuth();

  useEffect(() => {
    setActiveRoute(pathname);
  }, [pathname]);

  useEffect(() => {
    const updateNavState = () => {
      if (activeRoute === "/auth/register") {
        setNavState({
          showRegisterButton: false,
          showLoginButton: true,
          showSearchBar: true,
        });
      } else if (activeRoute === "/auth/login") {
        setNavState({
          showRegisterButton: true,
          showLoginButton: false,
          showSearchBar: true,
        });
      } else if (activeRoute === "/home/courses") {
        setNavState({
          showRegisterButton: !user,
          showLoginButton: !user,
          showSearchBar: false,
        });
      } else {
        setNavState({
          showRegisterButton: !user,
          showLoginButton: !user,
          showSearchBar: true,
        });
      }
    };

    if (!loadingUser) {
      updateNavState();
      setLoading(false);
    }
  }, [activeRoute, loadingUser, user]);

  useEffect(() => {
    const loadInitialData = async () => {
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
    };

    loadInitialData();
  }, [loadingUser]);

  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (
        profileMenuOpen &&
        dropdownRef.current &&
        !dropdownRef.current.contains(event.target as Node) &&
        profileButtonRef.current &&
        !profileButtonRef.current.contains(event.target as Node)
      ) {
        setProfileMenuOpen(false);
      }
    }

    if (typeof window !== "undefined") {
      document.addEventListener("mousedown", handleClickOutside);
    }

    return () => {
      if (typeof window !== "undefined") {
        document.removeEventListener("mousedown", handleClickOutside);
      }
    };
  }, [profileMenuOpen]);

  const toggleProfileMenu = () => {
    setProfileMenuOpen(!profileMenuOpen);
  };

  const handleSearchSubmit = (e: FormEvent) => {
    e.preventDefault();
    if (searchTerm.trim()) {
      router.push(`/courses?search=${searchTerm}`);
    }
  };
  return (
    <div>
      <header className="bg-white fixed w-full z-10">
        <nav
          aria-label="Global"
          className="mx-auto flex max-w-[90%] items-center justify-between p-4 lg:px-8"
        >
          <div className="flex lg:flex-1">
            <a href="/" className="-m-1.5">
              <span className="sr-only">Intellecta</span>
              <Image
                src={"/intellecta-logo.svg"}
                alt=""
                width="128"
                height="64"
              />
            </a>
          </div>
          <div className="flex lg:hidden">
            <button
              type="button"
              onClick={() => setMobileMenuOpen(true)}
              className="-m-2.5 inline-flex items-center justify-center rounded-md p-2.5 text-gray-700"
            >
              <span className="sr-only">Abrir menu</span>
              <Bars3Icon aria-hidden="true" className="size-6" />
            </button>
          </div>
          <div className="hidden lg:flex lg:gap-x-12">
            <div className="popOverButton relative hover:translate-y-0.5 transition-transform duration-200">
              <a
                href="/home/courses"
                className="flex items-center gap-x-1 text-sm/6 font-semibold text-gray-900"
              >
                Cursos
                <ChevronDownIcon
                  aria-hidden="true"
                  className="size-5 flex-none text-gray-400"
                />
              </a>

              <div className="popOverPanel absolute top-full -left-8 z-10 mt-3 w-screen max-w-md overflow-hidden rounded-3xl bg-white shadow-lg ring-1 ring-gray-900/5 transition data-closed:translate-y-1 data-closed:opacity-0 data-enter:duration-200 data-enter:ease-out data-leave:duration-150 data-leave:ease-in">
                <div className="p-4">
                  {products.map((item) => (
                    <div
                      key={item.name}
                      className="group relative flex items-center gap-x-6 rounded-lg p-4 text-sm/6 hover:bg-gray-50"
                    >
                      <div className="flex size-11 flex-none items-center justify-center rounded-lg bg-gray-50 group-hover:bg-white">
                        <item.icon
                          aria-hidden="true"
                          className="size-6 text-gray-600 group-hover:text-teal-600 group-hover:scale-110 transition-transform duration-200"
                        />
                      </div>
                      <div className="flex-auto">
                        <a
                          href={item.href}
                          className="block font-semibold text-gray-900"
                        >
                          {item.name}
                          <span className="absolute inset-0" />
                        </a>
                        <p className="mt-1 text-gray-600">{item.description}</p>
                      </div>
                    </div>
                  ))}
                </div>
                <div className="grid grid-cols-2 divide-x divide-gray-900/5 bg-gray-50">
                  {callsToAction.map((item) => (
                    <a
                      key={item.name}
                      href={item.href}
                      className="flex items-center justify-center gap-x-2.5 p-3 text-sm/6 font-semibold text-gray-900 hover:bg-gray-100"
                    >
                      <item.icon
                        aria-hidden="true"
                        className="size-5 flex-none text-gray-400"
                      />
                      {item.name}
                    </a>
                  ))}
                </div>
              </div>
            </div>

            <a
              href="/home/certificates"
              className="text-sm/6 font-semibold text-gray-900"
            >
              Certificados
            </a>
            <a
              href="/dashboard/apply"
              className="text-sm/6 font-semibold text-gray-900"
            >
              Aplica a instructor
            </a>
            <a
              href="/home/certificates"
              className="text-sm/6 font-semibold text-gray-900"
            >
              Sobre nosotros
            </a>
          </div>
          {loading ? (
            <NavBarSkeleton />
          ) : (
            <div className="hidden lg:flex lg:flex-1 gap-2 lg:justify-end">
              {navState.showSearchBar && (
                <label htmlFor="search" className="group">
                  <div className="hidden 2xl:flex items-center gap-2 rounded-md transition focus-within:shadow-md border-2 border-gray-200 text-sm/6 placeholder:text-gray-800 font-semibold px-3 py-1.5">
                    <form onSubmit={handleSearchSubmit}>
                      <input
                        id="search"
                        placeholder="¿Qué quieres aprender?"
                        className="focus:outline-0"
                        onChange={(e) => setSearchTerm(e.target.value)}
                      />
                    </form>
                    <a href={`/home/courses?search=${searchTerm}`}>
                      <Search className="size-5 text-gray-800" />
                    </a>
                  </div>
                </label>
              )}
              {navState.showLoginButton && (
                <Button
                  text="Acceder"
                  onClick={() => router.push("/auth/login")}
                  className="border-2 border-[#0000004D] text-[#000000] text-sm/6"
                />
              )}
              {navState.showRegisterButton && (
                <Button
                  text="Crear cuenta"
                  onClick={() => router.push("/auth/register")}
                  className="border-2 border-[#000000B0] bg-[#0000004D] text-white text-sm/6"
                />
              )}
              {user && (
                <div className="relative flex items-center justify-center ml-3">
                  <a
                    href="/dashboard/cart"
                    className="p-2 rounded-full transition-all duration-300 hover:bg-gray-100 hover:shadow-lg hover:shadow-gray-200/50 flex items-center justify-center"
                  >
                    <ShoppingCartIcon
                      aria-hidden="true"
                      className="size-6 text-gray-700 flex-none group-data-open:rotate-180"
                    />
                  </a>
                </div>
              )}
              {user && (
                <div className="relative ml-3">
                  <div className="">
                    {/*  Boton del profile  */}
                    <button
                      type="button"
                      className="relative flex rounded-full bg-gray-800 text-sm focus:ring-2 focus:ring-white focus:ring-offset-2 focus:ring-offset-gray-800 focus:outline-hidden transition duration-300"
                      id="user-menu-button"
                      aria-expanded={profileMenuOpen}
                      aria-haspopup="true"
                      onClick={toggleProfileMenu}
                      ref={profileButtonRef}
                    >
                      <span className="absolute -inset-1.5"></span>
                      <span className="sr-only">Open user menu</span>
                      <div className="relative">
                        <div className="flex h-10 w-10 items-center justify-center overflow-hidden rounded-full bg-gray-100">
                          <Image
                            src={
                              user.profilePicture || "/userImages/default.webp"
                            }
                            alt="Profile picture"
                            fill
                            className="object-cover rounded-full"
                          />
                        </div>
                      </div>
                    </button>
                  </div>
                  {/*   Dropdown   */}
                  <div
                    className={`absolute right-0 z-10 mt-2 w-48 origin-top-right rounded-md bg-white py-1 shadow-lg ring-1 ring-black/5 transition-all duration-200 ease-in-out ${
                      profileMenuOpen
                        ? "opacity-100 translate-y-0"
                        : "opacity-0 -translate-y-2 pointer-events-none"
                    }`}
                    ref={dropdownRef}
                    role="menu"
                    aria-orientation="vertical"
                    aria-labelledby="user-menu-button"
                  >
                    <a
                      href={`/dashboard/profile?uuid=${user.uuid}`}
                      className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 transition duration-200"
                      onClick={(e) => e.stopPropagation()}
                    >
                      Mi perfil
                    </a>
                    <a
                      href={`/dashboard`}
                      className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 transition duration-200"
                      onClick={(e) => e.stopPropagation()}
                    >
                      Mis cursos
                    </a>
                    {user.rol === "admin" && (
                      <a
                        href="/panel/"
                        className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 transition duration-200"
                        onClick={(e) => e.stopPropagation()}
                      >
                        Panel de administración
                      </a>
                    )}
                    <a
                      href="/auth/login"
                      className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 transition duration-200"
                      onClick={async () => {
                        await fetch("/api/auth/logout/", {
                          method: "POST",
                          headers: {
                            "Content-Type": "application/json",
                          },
                        });
                      }}
                    >
                      Cerrar sesión
                    </a>
                  </div>
                </div>
              )}
            </div>
          )}
        </nav>
        <div
          id="dialog"
          className={`fixed inset-0 z-10 transition-opacity duration-200 ease-in-out lg:hidden ${
            mobileMenuOpen
              ? "opacity-100 pointer-events-auto"
              : "opacity-0 pointer-events-none"
          }`}
        >
          <div
            id="dialogPanel"
            className={`fixed inset-y-0 right-0 z-10 w-full overflow-y-auto bg-white px-6 py-6 sm:max-w-sm sm:ring-1 sm:ring-gray-900/10 transition-transform duration-200 ease-in-out ${
              mobileMenuOpen ? "translate-x-0" : "translate-x-full"
            }`}
          >
            <div className="flex items-center justify-between">
              <a href="#" className="-m-1.5 p-1.5">
                <span className="sr-only">Intellecta</span>
                <Image
                  src={"/intellecta-logo.svg"}
                  alt="Intellecta logo"
                  width={100}
                  height={100}
                />
              </a>
              <button
                type="button"
                onClick={() => setMobileMenuOpen(false)}
                className="-m-2.5 rounded-md p-2.5 text-gray-700"
              >
                <span className="sr-only">Cerrar menú</span>
                <XMarkIcon aria-hidden="true" className="size-6" />
              </button>
            </div>
            <div className="mt-6 flow-root">
              <div className="-my-6 divide-y divide-gray-500/10">
                <div className="space-y-2 py-6">
                  <div className="-mx-3">
                    <button className="group flex w-full items-center justify-between rounded-lg py-2 pr-3.5 pl-3 text-base/7 font-semibold text-gray-900 hover:bg-gray-50">
                      Cursos
                      <ChevronDownIcon
                        aria-hidden="true"
                        className="size-5 flex-none group-data-open:rotate-180"
                      />
                    </button>
                    <div className="mt-2 space-y-2">
                      {[...products].map((item) => (
                        <a
                          key={item.name}
                          href={item.href}
                          className="block rounded-lg py-2 pr-3 pl-6 text-sm/7 font-semibold text-gray-900 hover:bg-gray-50"
                        >
                          {item.name}
                        </a>
                      ))}
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </header>
      <div className="h-16"></div>
    </div>
  );
}
