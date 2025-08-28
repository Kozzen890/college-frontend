"use client";
import { useEffect } from 'react';

// Set document.title secara manual untuk halaman login admin
function useAdminLoginTitle() {
  const pathname = usePathname();
  useEffect(() => {
    if (pathname === "/admin") {
      document.title = `Login Admin - ${APP_TITLE}`;
    }
  }, [pathname]);
}
import { useSidebar } from "@/context/SidebarContext";
import AdminSidebar from "@/components/admin/AdminSidebar";
import Backdrop from "@/layout/Backdrop";
import AdminHeader from "@/components/admin/AdminHeader";
import React from "react";
import APP_TITLE from '../appTitle';
import { usePathname } from "next/navigation";

export default function AdminLayout({ children }: { children: React.ReactNode }) {
  useSidebar();
  useAdminLoginTitle();
  const pathname = usePathname();

  // Jika di halaman login admin (/admin), render children saja tanpa sidebar/header
  if (pathname === "/admin") {
    return <>{children}</>;
  }

  // Halaman lain tetap pakai sidebar dan header
  return (
    <div className="min-h-screen flex flex-col xl:flex-row">
      {/* Header as navbar on mobile */}
      <div className="block xl:hidden sticky top-0 z-50 bg-white/80 backdrop-blur-md w-full">
        <AdminHeader />
      </div>
      {/* Sidebar floating on mobile, static on desktop */}
      <div className="hidden xl:block">
        <AdminSidebar />
      </div>
      <div className="xl:hidden">
        <Backdrop />
        <AdminSidebar />
      </div>
      <div className="flex-1 flex flex-col transition-all duration-300 ease-in-out">
        {/* Tambahkan margin top pada mobile/tablet agar ada jarak dengan navbar */}
        <div className="flex-1 p-4 md:p-6 mt-[56px] sm:mt-[56px] xl:mt-0">{children}</div>
      </div>
    </div>
  );
}
