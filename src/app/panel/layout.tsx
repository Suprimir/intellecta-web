"use client";

import { Inter } from "next/font/google";
import Sidebar from "@/components/Sidebar";
import Footer from "@/components/Footer";
import { useState } from "react";
import "../globals.css";

const inter = Inter({ subsets: ["latin"], weight: "300" });

interface PanelLayoutProps {
  children: React.ReactNode;
}

export default function PanelLayout({ children }: PanelLayoutProps) {
  const [isSidebarCollapsed, setIsSidebarCollapsed] = useState(false);

  const toggleSidebar = () => {
    setIsSidebarCollapsed(!isSidebarCollapsed);
  };

  return (
    <div
      className={`min-h-screen ${inter.className} bg-gradient-to-br from-gray-50 to-gray-50 hydrated grid transition-all duration-300`}
      style={{
        gridTemplateColumns: isSidebarCollapsed ? "100px 1fr" : "305px 1fr",
        gridTemplateRows: "1fr auto",
      }}
    >
      <div className="relative lg:col-span-1">
        <Sidebar isCollapsed={isSidebarCollapsed} onToggle={toggleSidebar} />
      </div>

      <div className="relative col-span-2 lg:col-span-1 py-8">
        <main className="h-full flex justify-center p-6">
          <div className="w-full max-w-7xl mx-auto">{children}</div>
        </main>
      </div>

      <div className="col-span-2">
        <Footer />
      </div>
    </div>
  );
}
