'use client';

import { createContext, useContext, useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { signIn, signOut, useSession } from 'next-auth/react';

const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [token, setToken] = useState(null);
  const [loading, setLoading] = useState(true);

  const router = useRouter();
  const { data: session, status, update } = useSession();

  // ✅ Sync user state with NextAuth session
  useEffect(() => {
    if (status === 'authenticated' && session?.user) {
      const sessionUser = {
        _id: session.user.id,
        name: session.user.name,
        email: session.user.email,
        image: session.user.image,
        role: session.user.role || 'user',
        sellerRequest: session.user.sellerRequest || null,
      };

      setUser(sessionUser);
      localStorage.setItem('user', JSON.stringify(sessionUser));

      if (session.backendToken) {
        localStorage.setItem('token', session.backendToken);
        setToken(session.backendToken);
      }
    } else if (status === 'unauthenticated') {
      setUser(null);
      setToken(null);
      localStorage.removeItem('user');
      localStorage.removeItem('token');
    }

    if (status !== 'loading') {
      setLoading(false);
    }
  }, [session, status]);

  // ✅ Login (Credentials)
  const login = async (email, password) => {
    try {
      const res = await signIn('credentials', {
        email,
        password,
        redirect: false,
      });

      if (res?.error) {
        return { success: false, error: 'Invalid email or password' };
      }

      await update();
      return { success: true };
    } catch (error) {
      console.error('Login Error:', error);
      return { success: false, error: error.message };
    }
  };

  // ✅ Google Login
  const googleLogin = async () => {
    try {
      await signIn('google', { callbackUrl: '/dashboard' });
    } catch (error) {
      console.error('Google Login Error:', error);
      return { success: false, error: error.message };
    }
  };

  // ✅ Register (Backend Call)
  const register = async (name, email, password) => {
    try {
      const res = await fetch(
        `${process.env.NEXT_PUBLIC_API_URL}/auth/register`,
        {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ name, email, password }),
        },
      );

      const data = await res.json();

      if (!res.ok) {
        throw new Error(data.message || 'Registration failed');
      }

      return { success: true };
    } catch (error) {
      console.error('Registration Error:', error);
      return { success: false, error: error.message };
    }
  };

  // ✅ Submit Seller Request
  const submitSellerRequest = async formData => {
    if (!user?.email) {
      return { success: false, error: 'Not logged in' };
    }

    try {
      const res = await fetch(
        `${process.env.NEXT_PUBLIC_API_URL}/seller-requests`,
        {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            Authorization: `Bearer ${token}`,
          },
          body: JSON.stringify({ ...formData, email: user.email }),
        },
      );

      const data = await res.json();

      if (!res.ok) {
        throw new Error(data.message || 'Failed to submit seller request');
      }

      // Update local state with sellerRequest status (role stays "user" until approved)
      const updatedUser = {
        ...user,
        token: typeof window !== "undefined" ? localStorage.getItem("token") : null,
        sellerRequest: "pending",
      };
      setUser(updatedUser);
      localStorage.setItem("user", JSON.stringify(updatedUser));
      await update({ sellerRequest: "pending" });

      return { success: true, message: data.message };
    } catch (error) {
      console.error("Submit Seller Request Error:", error);
      return { success: false, error: error.message };
    }
  };

  // ✅ Check Seller Request Status
  const checkSellerRequestStatus = async () => {
    if (!user?.email) return null;

    try {
      const res = await fetch(
        `${process.env.NEXT_PUBLIC_API_URL}/users/profile/${user.email}`,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        },
      );

      const data = await res.json();

      if (res.ok && data.sellerRequest) {
        const updatedUser = {
          ...user,
          token: typeof window !== "undefined" ? localStorage.getItem("token") : null, sellerRequest: data.sellerRequest
        };
        setUser(updatedUser);
        localStorage.setItem('user', JSON.stringify(updatedUser));

        await update({ sellerRequest: data.sellerRequest });

        return data.sellerRequest;
      }

      return null;
    } catch (error) {
      console.error('Check Seller Status Error:', error);
      return null;
    }
  };

  // ✅ Role Based Dashboard Route
  const getDashboardByRole = role => {
    const roleRoutes = {
      user: '/dashboard/user',
      seller: '/dashboard/seller',
      admin: '/dashboard/admin',
      manager: '/dashboard/manager',
    };

    return roleRoutes[role] || '/dashboard/user';
  };

  // ✅ Logout
  const logout = async () => {
    localStorage.removeItem('user');
    localStorage.removeItem('token');
    setUser(null);
    setToken(null);
    await signOut({ redirect: false });
    router.push('/login');
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        token,
        loading,
        login,
        googleLogin,
        register,
        logout,
        getDashboardByRole,
        submitSellerRequest,
        checkSellerRequestStatus,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => useContext(AuthContext);
