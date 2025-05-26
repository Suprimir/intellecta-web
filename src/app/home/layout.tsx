import type { Metadata } from "next";
import "../globals.css";
import NavBar from "@/components/NavBar";
import Footer from "@/components/Footer";
import { Inter } from "next/font/google";
const inter = Inter({ subsets: ["latin"], weight: "300" });

export const metadata: Metadata = {
  title: "Home",
  description: "Pagina principal de Intellecta",
};

export default function HomeLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <div className={`h-full ${inter.className} hydrated min-h-screen`}>
      <NavBar />
      {children}
      <Footer />
    </div>
  );
}
