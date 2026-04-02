"use client";
import Button from "@/components/common/Button";
import Link from "next/link";
import { useState } from "react";
import { FiMail, FiArrowLeft, FiCheck, FiArrowRight } from "react-icons/fi";

export default function ForgotPasswordPage() {
  const [email, setEmail] = useState("");
  const [error, setError] = useState("");
  const [success, setSuccess] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    setIsLoading(true);

    try {
      const res = await fetch(
        `${process.env.NEXT_PUBLIC_API_URL}/auth/forgot-password`,
        {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ email }),
        },
      );

      const data = await res.json();

      if (!res.ok) {
        throw new Error(data.message || "Something went wrong");
      }

      setSuccess(true);
    } catch (err) {
      setError(err.message);
    } finally {
      setIsLoading(false);
    }
  };

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

        {/* Left Side - Form */}
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

          {!success ? (
            <>
              {/* Title */}
              <div style={{ marginBottom: "28px" }}>
                <h2 style={{
                  fontSize: "26px",
                  fontWeight: "700",
                  color: "#111",
                  margin: "0 0 6px 0",
                  fontFamily: "'Georgia', serif",
                  letterSpacing: "-0.01em",
                }}>
                  Forgot Password?
                </h2>
                <p style={{
                  fontSize: "13px",
                  color: "#888",
                  margin: 0,
                  fontFamily: "system-ui, sans-serif",
                  fontWeight: "400",
                }}>
                  No worries! Enter your email and we&apos;ll send you a reset link.
                </p>
              </div>

              {error && (
                <div style={{
                  marginBottom: "16px",
                  padding: "10px 14px",
                  background: "#fff5f5",
                  border: "1px solid #ffc0c0",
                  borderRadius: "10px",
                  color: "#c00",
                  fontSize: "13px",
                  fontFamily: "system-ui, sans-serif",
                }}>
                  {error}
                </div>
              )}

              <form onSubmit={handleSubmit} style={{ display: "flex", flexDirection: "column", gap: "14px" }}>
                <div>
                  <label style={{
                    display: "block",
                    fontSize: "12px",
                    fontWeight: "500",
                    color: "#555",
                    marginBottom: "6px",
                    fontFamily: "system-ui, sans-serif",
                    letterSpacing: "0.02em",
                  }}>
                    Email Address
                  </label>
                  <div style={{ position: "relative" }}>
                    <input
                      type="email"
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      placeholder="you@example.com"
                      required
                      style={{
                        width: "100%",
                        padding: "10px 14px",
                        background: "#fff",
                        border: "1.5px solid #e0e0e0",
                        borderRadius: "10px",
                        fontSize: "13.5px",
                        color: "#111",
                        fontFamily: "system-ui, sans-serif",
                        outline: "none",
                        boxSizing: "border-box",
                        transition: "border-color 0.2s",
                      }}
                      onFocus={e => e.target.style.borderColor = "#111"}
                      onBlur={e => e.target.style.borderColor = "#e0e0e0"}
                    />
                  </div>
                </div>

                <Button
                  type="submit"
                  disabled={isLoading}
                  style={{
                    width: "100%",
                    padding: "12px",
                    background: "#1a1a1a",
                    color: "#fff",
                    border: "none",
                    borderRadius: "10px",
                    fontSize: "14px",
                    fontWeight: "600",
                    fontFamily: "system-ui, sans-serif",
                    letterSpacing: "0.02em",
                    cursor: "pointer",
                    marginTop: "4px",
                    transition: "background 0.2s",
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    gap: "8px",
                  }}
                  onMouseEnter={e => { if (!isLoading) e.currentTarget.style.background = "#333"; }}
                  onMouseLeave={e => { e.currentTarget.style.background = "#1a1a1a"; }}
                >
                  {isLoading ? (
                    <div style={{
                      width: "18px",
                      height: "18px",
                      border: "2px solid rgba(255,255,255,0.3)",
                      borderTopColor: "#fff",
                      borderRadius: "50%",
                      animation: "spin 0.7s linear infinite",
                    }} />
                  ) : (
                    <>
                      Send Reset Link
                      <FiArrowRight size={15} />
                    </>
                  )}
                </Button>
              </form>

              <p style={{
                textAlign: "center",
                fontSize: "12.5px",
                color: "#888",
                marginTop: "20px",
                fontFamily: "system-ui, sans-serif",
              }}>
                Remember your password?{" "}
                <Link href="/login" style={{ color: "#111", fontWeight: "600", textDecoration: "none" }}>
                  Sign In
                </Link>
              </p>
            </>
          ) : (
            /* Success State */
            <div style={{ textAlign: "center", padding: "24px 0" }}>
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
                fontSize: "22px",
                fontWeight: "700",
                color: "#111",
                margin: "0 0 8px 0",
                fontFamily: "'Georgia', serif",
              }}>
                Check Your Email
              </h2>
              <p style={{ fontSize: "12.5px", color: "#888", margin: "0 0 4px 0", fontFamily: "system-ui, sans-serif" }}>
                We&apos;ve sent a password reset link to:
              </p>
              <p style={{ fontSize: "14px", fontWeight: "600", color: "#111", margin: "0 0 14px 0", fontFamily: "system-ui, sans-serif" }}>
                {email}
              </p>
              
              <div style={{
                background: "#fff",
                border: "1px solid #e8e8e8",
                borderRadius: "10px",
                padding: "12px 16px",
                marginBottom: "20px",
                textAlign: "left"
              }}>
                <p style={{ fontSize: "11.5px", color: "#aaa", margin: "0 0 6px 0", fontFamily: "system-ui, sans-serif", fontWeight: "600" }}>
                  💡 Tips:
                </p>
                <ul style={{ fontSize: "11px", color: "#888", margin: 0, paddingLeft: "16px", fontFamily: "system-ui, sans-serif", lineHeight: "1.6" }}>
                  <li>Check your spam folder if you don&apos;t see the email</li>
                  <li>The link expires in 1 hour</li>
                  <li>Only the latest link will work</li>
                </ul>
              </div>

              <button
                onClick={() => {
                  setSuccess(false);
                  setEmail("");
                }}
                style={{
                  background: "none",
                  border: "none",
                  color: "#777",
                  fontSize: "12.5px",
                  cursor: "pointer",
                  textDecoration: "underline",
                  fontFamily: "system-ui, sans-serif",
                  marginBottom: "20px"
                }}
              >
                Didn&apos;t receive it? Try again
              </button>

              <div>
                <Link href="/login" style={{
                  display: "inline-flex",
                  alignItems: "center",
                  gap: "6px",
                  fontSize: "12.5px",
                  fontWeight: "600",
                  color: "#111",
                  textDecoration: "none",
                  fontFamily: "system-ui, sans-serif",
                }}>
                  <FiArrowLeft size={13} />
                  Back to Login
                </Link>
              </div>
            </div>
          )}
        </div>

        {/* Right Side - Product Image */}
        <div className="hidden md:flex flex-1 bg-[#e8e2d9] relative overflow-hidden items-center justify-center min-h-[400px]">
          {/* Subtle gradient overlay */}
          <div style={{
            position: "absolute",
            inset: 0,
            background: "linear-gradient(135deg, #ede8e0 0%, #d4cfc7 50%, #c9c2b8 100%)",
          }} />

          {/* Decorative circle shadow on floor */}
          <div style={{
            position: "absolute",
            bottom: "18%",
            left: "50%",
            transform: "translateX(-50%)",
            width: "200px",
            height: "30px",
            background: "rgba(0,0,0,0.12)",
            borderRadius: "50%",
            filter: "blur(14px)",
            zIndex: 1,
          }} />

          {/* Chair SVG illustration — black & white monochrome version */}
          <div style={{ position: "relative", zIndex: 2 }}>
            <svg width="260" height="320" viewBox="0 0 260 320" fill="none" xmlns="http://www.w3.org/2000/svg">
              {/* Seat shell */}
              <ellipse cx="130" cy="118" rx="82" ry="52" fill="#1a1a1a" opacity="0.92"/>
              {/* Seat highlight */}
              <ellipse cx="108" cy="103" rx="38" ry="22" fill="white" opacity="0.12" transform="rotate(-12 108 103)"/>
              {/* Backrest */}
              <path d="M70 118 C60 90 65 55 130 50 C195 55 200 90 190 118" fill="#111" opacity="0.9"/>
              <path d="M80 115 C72 90 76 62 130 57 C184 62 188 90 180 115" fill="#2a2a2a" opacity="0.6"/>
              {/* Backrest highlight */}
              <ellipse cx="110" cy="80" rx="26" ry="16" fill="white" opacity="0.1" transform="rotate(-8 110 80)"/>

              {/* Front left leg */}
              <line x1="100" y1="155" x2="75" y2="268" stroke="#444" strokeWidth="5" strokeLinecap="round"/>
              {/* Front right leg */}
              <line x1="160" y1="155" x2="185" y2="268" stroke="#444" strokeWidth="5" strokeLinecap="round"/>
              {/* Back left leg */}
              <line x1="88" y1="148" x2="55" y2="260" stroke="#333" strokeWidth="5" strokeLinecap="round"/>
              {/* Back right leg */}
              <line x1="172" y1="148" x2="205" y2="260" stroke="#333" strokeWidth="5" strokeLinecap="round"/>

              {/* Cross braces */}
              <line x1="75" y1="215" x2="185" y2="225" stroke="#555" strokeWidth="3" strokeLinecap="round"/>
              <line x1="55" y1="210" x2="205" y2="220" stroke="#555" strokeWidth="2.5" strokeLinecap="round" opacity="0.5"/>

              {/* Leg feet dots */}
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
