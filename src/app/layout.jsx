import { Lexend } from "next/font/google";
import "./globals.css";
import Footer from "@/components/common/Footer";
import Navbar from "@/components/common/Navbar";
import AnnouncementBar from "@/components/common/AnnouncementBar";
import { AuthProvider } from "@/contexts/AuthContext";
import NextAuthProvider from "@/components/providers/NextAuthProvider";
import { CartProvider } from "@/contexts/CartContext";
import { LanguageProvider } from "@/contexts/LanguageContext";
import { CurrencyProvider } from "@/contexts/CurrencyContext";
import { SocketProvider } from "@/contexts/SocketContext";
import { NotificationProvider } from "@/contexts/NotificationContext";
import { Toaster } from "react-hot-toast";
import NotificationListener from "@/components/common/NotificationListener";

const lexend = Lexend({
  variable: "--font-lexend",
  subsets: ["latin"],
});

export const metadata = {
  title: "Unity Shop",
  description: "Your one-stop shop for everything unity!",
};

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body className={`${lexend.className} antialiased bg-[#f7f6f3]`}>
        <LanguageProvider>
          <CurrencyProvider>
            <NextAuthProvider>
              <AuthProvider>
                <SocketProvider>
                  <NotificationProvider>
                    <CartProvider>
                      <AnnouncementBar />
                      <Navbar />
                      <NotificationListener />
                      <Toaster position="top-right" />
                      {children}
                      <Footer />
                    </CartProvider>
                  </NotificationProvider>
                </SocketProvider>
              </AuthProvider>
            </NextAuthProvider>
          </CurrencyProvider>
        </LanguageProvider>
      </body>
    </html>
  );
}
