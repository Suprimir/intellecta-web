"use client";

import { useState, useEffect } from "react";
import {
  AcademicCapIcon,
  CreditCardIcon,
  UserGroupIcon,
  CurrencyDollarIcon,
} from "@heroicons/react/24/outline";
import { useAuth } from "@/libs/context/AuthContext";
import DashboardPageSkeleton from "@/components/skeletons/DashboardPageSkeleton";
import { Stats } from "@/types/api";

export default function DashboardPanel() {
  const [loading, setLoading] = useState(true);
  const [stats, setStats] = useState<Stats>();
  const { user, loadingUser } = useAuth();

  useEffect(() => {
    const loadDashboardData = async () => {
      try {
        const res = await fetch("/api/stats");
        const data: Stats = await res.json();
        setStats(data);
      } catch (error) {
        console.error("Error cargando datos del dashboard:", error);
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

    loadDashboardData();
  }, [loadingUser]);

  if (loading) {
    return <DashboardPageSkeleton />;
  }

  return (
    <div className="w-full">
      <div className="mb-8 pt-16 lg:pt-0">
        <h1 className="text-3xl font-bold mb-2 text-gray-800">
          Panel de Control
        </h1>
        <p className="text-gray-600">Resumen general</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
        {/* Total de Cursos */}
        <div className="bg-white rounded-2xl shadow p-6 border border-gray-100">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600">Total Cursos</p>
              <p className="text-3xl font-bold text-gray-900">
                {stats?.totalCourses}
              </p>
            </div>
            <div className="bg-blue-100 p-3 rounded-full">
              <AcademicCapIcon className="h-6 w-6 text-blue-600" />
            </div>
          </div>
        </div>

        {/* Total de Pagos */}
        <div className="bg-white rounded-2xl shadow p-6 border border-gray-100">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600">Total Pagos</p>
              <p className="text-3xl font-bold text-gray-900">
                {stats?.totalPayments}
              </p>
            </div>
            <div className="bg-[#599f96] bg-opacity-10 p-3 rounded-full">
              <CreditCardIcon className="h-6 w-6 text-[#04332d]" />
            </div>
          </div>
        </div>

        <div className="bg-white rounded-2xl shadow p-6 border border-gray-100">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600">
                Ingresos Totales
              </p>
              <p className="text-3xl font-bold text-gray-900">
                {stats?.totalIncomes.toFixed(2)}
              </p>
            </div>
            <div className="bg-green-100 p-3 rounded-full">
              <CurrencyDollarIcon className="h-6 w-6 text-green-600" />
            </div>
          </div>
        </div>

        {/* Total de Usuarios */}
        <div className="bg-white rounded-2xl shadow p-6 border border-gray-100">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600">
                Total Usuarios
              </p>
              <p className="text-3xl font-bold text-gray-900">
                {stats?.totalUsers}
              </p>
            </div>
            <div className="bg-purple-100 p-3 rounded-full">
              <UserGroupIcon className="h-6 w-6 text-purple-600" />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
