"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";
import { useAuth } from "@/hooks/useAuth";

export default function DashboardPage() {
  const { user, loading, getDashboardByRole } = useAuth();
  const router = useRouter();

  useEffect(() => {
    if (!loading && user) {
      // Auto-redirect to the role-specific dashboard
      const dashboardPath = getDashboardByRole(user.role);
      router.replace(dashboardPath);
    }
  }, [user, loading, getDashboardByRole, router]);

  return (
    <div className="flex items-center justify-center h-[60vh]">
      <div className="flex flex-col items-center gap-4">
        <div className="w-12 h-12 border-4 border-gray-200 border-t-gray-900 rounded-full animate-spin"></div>
        <p className="text-gray-400">Redirecting to your dashboard...</p>
      </div>
    </div>
  );
}
