"use client";
import { createContext, useContext, useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { signIn, signOut, useSession } from "next-auth/react";

const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const router = useRouter();
  const { data: session, status, update } = useSession();

  // Sync user state with NextAuth session (works for BOTH Google & credentials login)
  useEffect(() => {
    if (status === "authenticated" && session?.user) {
      const sessionUser = {
        _id: session.user.id,
        name: session.user.name,
        email: session.user.email,
        image: session.user.image,
        role: session.user.role || "user",
        sellerRequest: session.user.sellerRequest || null,
      };
      setUser(sessionUser);
      localStorage.setItem("user", JSON.stringify(sessionUser));
      if (session.backendToken) {
        localStorage.setItem("token", session.backendToken);
      }
    } else if (status === "unauthenticated") {
      setUser(null);
      localStorage.removeItem("user");
      localStorage.removeItem("token");
    }

    if (status !== "loading") {
      setLoading(false);
    }
  }, [session, status]);

  // Login with email/password — uses NextAuth CredentialsProvider so session is created
  const login = async (email, password) => {
    try {
      const res = await signIn("credentials", {
        email,
        password,
        redirect: false,
      });

      if (res?.error) {
        return { success: false, error: "Invalid email or password" };
      }

      // Force session update so useEffect picks up the new user
      await update();
      return { success: true };
    } catch (error) {
      console.error("Login Error:", error);
      return { success: false, error: error.message };
    }
  };

  // Login with Google — uses NextAuth GoogleProvider
  const googleLogin = async () => {
    try {
      await signIn("google", { callbackUrl: "/dashboard" });
    } catch (error) {
      console.error("Google Login Error:", error);
      return { success: false, error: error.message };
    }
  };

  // Register — calls backend directly, then user logs in separately
  const register = async (name, email, password) => {
    try {
      const res = await fetch(
        `${process.env.NEXT_PUBLIC_API_URL}/auth/register`,
        {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ name, email, password }),
        },
      );

      const data = await res.json();

      if (!res.ok) {
        throw new Error(data.message || "Registration failed");
      }

      return { success: true };
    } catch (error) {
      console.error("Registration Error:", error);
      return { success: false, error: error.message };
    }
  };

  // Request Seller — submits a request that needs admin/manager approval
  const requestSeller = async () => {
    if (!user?.email) return { success: false, error: "Not logged in" };
    try {
      const res = await fetch(
        `${process.env.NEXT_PUBLIC_API_URL}/users/request-seller/${user.email}`,
        {
          method: "PATCH",
          headers: { "Content-Type": "application/json" },
        },
      );

      const data = await res.json();

      if (!res.ok) {
        throw new Error(data.message || "Failed to submit seller request");
      }

      // Update local state with sellerRequest status (role stays "user" until approved)
      const updatedUser = { ...user, sellerRequest: "pending" };
      setUser(updatedUser);
      localStorage.setItem("user", JSON.stringify(updatedUser));

      // Update NextAuth session/JWT so it persists across refresh
      await update({ sellerRequest: "pending" });

      return { success: true, message: data.message };
    } catch (error) {
      console.error("Request Seller Error:", error);
      return { success: false, error: error.message };
    }
  };

  // Check seller request status from backend
  const checkSellerRequestStatus = async () => {
    if (!user?.email) return null;
    try {
      const res = await fetch(
        `${process.env.NEXT_PUBLIC_API_URL}/users/profile/${user.email}`,
      );
      const data = await res.json();
      if (res.ok && data.sellerRequest) {
        const updatedUser = { ...user, sellerRequest: data.sellerRequest };
        setUser(updatedUser);
        localStorage.setItem("user", JSON.stringify(updatedUser));
        // Sync NextAuth session/JWT
        await update({ sellerRequest: data.sellerRequest });
        return data.sellerRequest;
      }
      return null;
    } catch {
      return null;
    }
  };

  // Helper: get dashboard path based on role
  const getDashboardByRole = (role) => {
    const roleRoutes = {
      user: "/dashboard/user",
      seller: "/dashboard/seller",
      admin: "/dashboard/admin",
      manager: "/dashboard/manager",
    };
    return roleRoutes[role] || "/dashboard/user";
  };

  // Logout — clears everything (NextAuth session + localStorage)
  const logout = async () => {
    localStorage.removeItem("user");
    localStorage.removeItem("token");
    setUser(null);
    await signOut({ redirect: false });
    router.push("/login");
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        loading,
        login,
        googleLogin,
        register,
        logout,
        getDashboardByRole,
        requestSeller,
        checkSellerRequestStatus,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => useContext(AuthContext);
