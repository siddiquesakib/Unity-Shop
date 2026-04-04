"use client";
import Sidebar from "@/components/dashboard/Sidebar";
import Topbar from "@/components/dashboard/Topbar";
import { useAuth } from "@/hooks/useAuth";
import { useRouter, usePathname } from "next/navigation";
import { useState, useEffect } from "react";

export default function DashboardLayout({ children }) {
  const { user, loading, getDashboardByRole } = useAuth();
  const router = useRouter();
  const pathname = usePathname();
  const [mobileOpen, setMobileOpen] = useState(false);

  useEffect(() => {
    const handleResize = () => {
      if (window.innerWidth >= 1024) setMobileOpen(false);
    };
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  useEffect(() => {
    if (!loading && !user) {
      router.push("/login");
      return;
    }

    if (!loading && user) {
      // Role-based route protection
      const role = user.role || "user";
      const allowedPaths = {
        user: "/dashboard/user",
        seller: "/dashboard/seller",
        admin: "/dashboard/admin",
        manager: "/dashboard/manager",
        delivery: "/dashboard/delivery",
      };

      const myPath = allowedPaths[role];
      // If user tries to access another role's dashboard, redirect to their own
      const otherRolePaths = Object.entries(allowedPaths)
        .filter(([r]) => r !== role)
        .map(([, p]) => p);

      const isAccessingOtherRole = otherRolePaths.some((p) =>
        pathname.startsWith(p),
      );
      if (isAccessingOtherRole) {
        router.replace(myPath);
      }
    }
  }, [user, loading, router, pathname, getDashboardByRole]);

  if (loading) {
    return (
      <div className="flex h-screen items-center justify-center bg-[#f7f6f3] text-gray-700">
        <div className="flex flex-col items-center gap-4">
          <div className="w-12 h-12 border-4 border-gray-200 border-t-gray-900 rounded-full animate-spin"></div>
          <p className="text-gray-400">Loading...</p>
        </div>
      </div>
    );
  }

  if (!user) {
    return null;
  }

  return (
    <div className="flex min-h-screen bg-[#f7f6f3] text-gray-800 font-sans selection:bg-gray-200">
      <Sidebar mobileOpen={mobileOpen} setMobileOpen={setMobileOpen} />
      <div className="flex-1 flex flex-col min-w-0">
        <Topbar onMenuClick={() => setMobileOpen(true)} />
        <main className="flex-1 p-4 sm:p-6 lg:p-8">
          <div className="max-w-7xl mx-auto space-y-6">{children}</div>
        </main>
      </div>
    </div>
  );
}
