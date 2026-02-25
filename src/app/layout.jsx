import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import Footer from "@/components/common/Footer";
import Navbar from "@/components/common/Navbar";
import { AuthProvider } from "@/contexts/AuthContext";
import NextAuthProvider from "@/components/providers/NextAuthProvider";
import { CartProvider } from "@/contexts/CartContext";
import { LanguageProvider } from "@/contexts/LanguageContext";
import { CurrencyProvider } from "@/contexts/CurrencyContext";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata = {
  title: "Unity Shop - Global Marketplace",
  description: "Shop from anywhere, pay in any currency",
};

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased`}
      >
        <LanguageProvider>
          <CurrencyProvider>
            <NextAuthProvider>
              <AuthProvider>
                <CartProvider>
                  <Navbar />
                  {children}
                  <Footer />
                </CartProvider>
              </AuthProvider>
            </NextAuthProvider>
          </CurrencyProvider>
        </LanguageProvider>
      </body>
    </html>
  );
}
