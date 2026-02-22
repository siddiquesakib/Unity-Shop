"use client";
import { createContext, useContext, useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { signIn, signOut, useSession } from "next-auth/react";

const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const router = useRouter();
  const { data: session, status } = useSession();

  useEffect(() => {
    // If NextAuth session exists (Google login), use that
    if (status === "authenticated" && session?.user) {
      const sessionUser = {
        _id: session.user.id,
        name: session.user.name,
        email: session.user.email,
        image: session.user.image,
        role: session.user.role || "user",
        provider: "google",
      };
      setUser(sessionUser);
      localStorage.setItem("user", JSON.stringify(sessionUser));
      if (session.backendToken) {
        localStorage.setItem("token", session.backendToken);
      }
      setLoading(false);
      return;
    }

    // If no NextAuth session, check localStorage (email/password login)
    if (status === "unauthenticated" || status === "loading") {
      const storedUser = localStorage.getItem("user");
      if (storedUser) {
        setUser(JSON.parse(storedUser));
      }
    }

    if (status !== "loading") {
      setLoading(false);
    }
  }, [session, status]);

  const login = async (email, password) => {
    try {
      const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/auth/login`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, password }),
      });

      const data = await res.json();

      if (!res.ok) {
        throw new Error(data.message || "Login failed");
      }

      localStorage.setItem("user", JSON.stringify(data.user));
      localStorage.setItem("token", data.token);

      setUser(data.user);
      router.push("/dashboard");
      return { success: true };
    } catch (error) {
      console.error("Login Error:", error);
      return { success: false, error: error.message };
    }
  };

  const googleLogin = async () => {
    try {
      await signIn("google", { callbackUrl: "/dashboard" });
    } catch (error) {
      console.error("Google Login Error:", error);
      return { success: false, error: error.message };
    }
  };

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

      router.push("/login");
      return { success: true };
    } catch (error) {
      console.error("Registration Error:", error);
      return { success: false, error: error.message };
    }
  };

  const logout = async () => {
    localStorage.removeItem("user");
    localStorage.removeItem("token");
    setUser(null);
    // Sign out from NextAuth too (for Google sessions)
    await signOut({ redirect: false });
    router.push("/login");
  };

  return (
    <AuthContext.Provider
      value={{ user, loading, login, googleLogin, register, logout }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => useContext(AuthContext);
