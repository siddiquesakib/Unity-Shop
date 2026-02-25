import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import Footer from "@/components/common/Footer";
import Navbar from "@/components/common/Navbar";
import { AuthProvider } from "@/contexts/AuthContext";
import NextAuthProvider from "@/components/providers/NextAuthProvider";
import { CartProvider } from "@/contexts/CartContext";
import { LanguageProvider } from "@/contexts/LanguageContext";
import { SocketProvider } from "@/contexts/SocketContext";
import { NotificationProvider } from "@/contexts/NotificationContext";
import { Toaster } from "react-hot-toast";
import NotificationListener from "@/components/common/NotificationListener";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata = {
  title: "Unity Shop",
  description: "Your one-stop shop for everything unity!",
};

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased`}
      >
        <NextAuthProvider>
          <AuthProvider>
            <SocketProvider>
              <NotificationProvider>
                <CartProvider>
                  <LanguageProvider>
                    <Navbar />
                    <NotificationListener />
                    <Toaster position="top-right" />
                    {children}
                    <Footer />
                  </LanguageProvider>
                </CartProvider>
              </NotificationProvider>
            </SocketProvider>
          </AuthProvider>
        </NextAuthProvider>
      </body>
    </html>
  );
}
