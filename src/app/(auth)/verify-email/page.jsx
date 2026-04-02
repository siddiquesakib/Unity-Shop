"use client";

import { useEffect, useState, Suspense } from "react";
import { useSearchParams } from "next/navigation";
import { signIn } from "next-auth/react";
import Link from "next/link";
import { FiCheck, FiX, FiArrowRight } from "react-icons/fi";

function VerifyEmailContent() {
  const searchParams = useSearchParams();
  const [status, setStatus] = useState("verifying"); // verifying, success, error
  const [message, setMessage] = useState("");

  useEffect(() => {
    const token = searchParams.get("token");
    const email = searchParams.get("email");

    if (!token || !email) {
      setStatus("error");
      setMessage("Invalid verification link. Missing token or email.");
      return;
    }

    const verifyAndLogin = async () => {
      try {
        // Use NextAuth signIn with the loginToken — it calls our verify-email backend
        const res = await signIn("credentials", {
          email,
          loginToken: token,
          redirect: false,
        });

        if (res?.error) {
          setStatus("error");
          setMessage(
            res.error || "Verification failed. The link may have expired.",
          );
          return;
        }

        setStatus("success");
        setMessage("Email verified! Redirecting to your dashboard...");

        // Redirect to dashboard after a short delay
        setTimeout(() => {
          window.location.href = "/dashboard";
        }, 2000);
      } catch (error) {
        setStatus("error");
        setMessage("Something went wrong. Please try logging in manually.");
      }
    };

    verifyAndLogin();
  }, [searchParams]);

  return (
    <div style={{
      minHeight: "100vh",
      display: "flex",
      alignItems: "center",
      justifyContent: "center",
      background: "#f5f5f0",
      fontFamily: "'Georgia', 'Times New Roman', serif",
      padding: "24px",
    }}>
      <div className="flex flex-col md:flex-row w-full max-w-[900px] bg-white rounded-[20px] overflow-hidden shadow-[0_8px_60px_rgba(0,0,0,0.12)] border border-[#e8e8e8] min-h-[580px]">

        {/* Left Side - Content */}
        <div className="flex-1 md:flex-none md:w-1/2 p-8 md:p-[52px_48px] flex flex-col justify-center bg-[#fafafa]">
          {/* Logo */}
          <div style={{ marginBottom: "36px" }}>
            <span style={{
              fontFamily: "'Georgia', serif",
              fontSize: "15px",
              fontWeight: "700",
              letterSpacing: "0.22em",
              color: "#111",
              textTransform: "uppercase",
            }}>
              Unity Shop
            </span>
          </div>

          <div style={{ textAlign: "center", padding: "24px 0" }}>
            {status === "verifying" && (
              <>
                <div style={{
                  width: "64px",
                  height: "64px",
                  border: "3px solid #e8e8e8",
                  borderTopColor: "#111",
                  borderRadius: "50%",
                  animation: "spin 0.8s linear infinite",
                  margin: "0 auto 20px"
                }} />
                <h2 style={{
                  fontSize: "24px",
                  fontWeight: "700",
                  color: "#111",
                  margin: "0 0 8px 0",
                  fontFamily: "'Georgia', serif",
                }}>
                  Verifying Email...
                </h2>
                <p style={{ fontSize: "13px", color: "#888", fontFamily: "system-ui, sans-serif" }}>
                  Please wait while we verify your account.
                </p>
              </>
            )}

            {status === "success" && (
              <>
                <div style={{
                  width: "64px",
                  height: "64px",
                  borderRadius: "50%",
                  background: "#111",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  margin: "0 auto 20px",
                }}>
                  <FiCheck color="#fff" size={26} />
                </div>
                <h2 style={{
                  fontSize: "24px",
                  fontWeight: "700",
                  color: "#111",
                  margin: "0 0 8px 0",
                  fontFamily: "'Georgia', serif",
                }}>
                  Welcome to Unity Shop!
                </h2>
                <p style={{ fontSize: "13px", color: "#6b7280", margin: "0 0 20px 0", fontFamily: "system-ui, sans-serif" }}>
                  {message}
                </p>
                <div style={{ display: "flex", alignItems: "center", justifyContent: "center", gap: "8px", color: "#111" }}>
                  <div style={{
                    width: "16px",
                    height: "16px",
                    border: "2px solid #e5e7eb",
                    borderTopColor: "#111",
                    borderRadius: "50%",
                    animation: "spin 1s linear infinite",
                  }} />
                  <span style={{ fontSize: "13px", fontWeight: "500", fontFamily: "system-ui, sans-serif" }}>Redirecting...</span>
                </div>
              </>
            )}

            {status === "error" && (
              <>
                <div style={{
                  width: "64px",
                  height: "64px",
                  borderRadius: "50%",
                  background: "#fff5f5",
                  border: "1px solid #ffc0c0",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  margin: "0 auto 20px",
                }}>
                  <FiX color="#ef4444" size={26} />
                </div>
                <h2 style={{
                  fontSize: "24px",
                  fontWeight: "700",
                  color: "#111",
                  margin: "0 0 8px 0",
                  fontFamily: "'Georgia', serif",
                }}>
                  Verification Failed
                </h2>
                <p style={{ fontSize: "13px", color: "#ef4444", margin: "0 0 24px 0", fontFamily: "system-ui, sans-serif" }}>
                  {message}
                </p>
                <Link
                  href="/login"
                  style={{
                    display: "inline-flex",
                    alignItems: "center",
                    justifyContent: "center",
                    gap: "8px",
                    background: "#1a1a1a",
                    color: "#fff",
                    padding: "12px 24px",
                    borderRadius: "10px",
                    fontSize: "14px",
                    fontWeight: "600",
                    fontFamily: "system-ui, sans-serif",
                    textDecoration: "none",
                    transition: "background 0.2s",
                  }}
                  onMouseEnter={e => e.currentTarget.style.background = "#333"}
                  onMouseLeave={e => e.currentTarget.style.background = "#1a1a1a"}
                >
                  Go to Login
                  <FiArrowRight size={15} />
                </Link>
              </>
            )}
          </div>
        </div>

        {/* Right Side - Product Image */}
        <div className="hidden md:flex flex-1 bg-[#e8e2d9] relative overflow-hidden items-center justify-center min-h-[400px]">
          <div style={{ position: "absolute", inset: 0, background: "linear-gradient(135deg, #ede8e0 0%, #d4cfc7 50%, #c9c2b8 100%)" }} />
          <div style={{ position: "absolute", bottom: "18%", left: "50%", transform: "translateX(-50%)", width: "200px", height: "30px", background: "rgba(0,0,0,0.12)", borderRadius: "50%", filter: "blur(14px)", zIndex: 1 }} />
          <div style={{ position: "relative", zIndex: 2 }}>
            <svg width="260" height="320" viewBox="0 0 260 320" fill="none" xmlns="http://www.w3.org/2000/svg">
              <ellipse cx="130" cy="118" rx="82" ry="52" fill="#1a1a1a" opacity="0.92"/>
              <ellipse cx="108" cy="103" rx="38" ry="22" fill="white" opacity="0.12" transform="rotate(-12 108 103)"/>
              <path d="M70 118 C60 90 65 55 130 50 C195 55 200 90 190 118" fill="#111" opacity="0.9"/>
              <path d="M80 115 C72 90 76 62 130 57 C184 62 188 90 180 115" fill="#2a2a2a" opacity="0.6"/>
              <ellipse cx="110" cy="80" rx="26" ry="16" fill="white" opacity="0.1" transform="rotate(-8 110 80)"/>
              <line x1="100" y1="155" x2="75" y2="268" stroke="#444" strokeWidth="5" strokeLinecap="round"/>
              <line x1="160" y1="155" x2="185" y2="268" stroke="#444" strokeWidth="5" strokeLinecap="round"/>
              <line x1="88" y1="148" x2="55" y2="260" stroke="#333" strokeWidth="5" strokeLinecap="round"/>
              <line x1="172" y1="148" x2="205" y2="260" stroke="#333" strokeWidth="5" strokeLinecap="round"/>
              <line x1="75" y1="215" x2="185" y2="225" stroke="#555" strokeWidth="3" strokeLinecap="round"/>
              <line x1="55" y1="210" x2="205" y2="220" stroke="#555" strokeWidth="2.5" strokeLinecap="round" opacity="0.5"/>
              <circle cx="75" cy="268" r="5" fill="#222"/>
              <circle cx="185" cy="268" r="5" fill="#222"/>
              <circle cx="55" cy="260" r="5" fill="#333" opacity="0.7"/>
              <circle cx="205" cy="260" r="5" fill="#333" opacity="0.7"/>
            </svg>
          </div>
        </div>

      </div>
    </div>
  );
}

export default function VerifyEmailPage() {
  return (
    <Suspense
      fallback={
        <div className="min-h-screen flex items-center justify-center bg-slate-950">
          <div className="w-12 h-12 border-4 border-indigo-500/30 border-t-indigo-500 rounded-full animate-spin"></div>
        </div>
      }
    >
      <VerifyEmailContent />
    </Suspense>
  );
}
