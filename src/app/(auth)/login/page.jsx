"use client";
import Link from "next/link";
import { useState } from "react";
import { useAuth } from "@/contexts/AuthContext";
import { useRouter } from "next/navigation";
import { FcGoogle } from "react-icons/fc";
import { FiMail, FiLock, FiEye, FiEyeOff } from "react-icons/fi";
import Button from "@/components/common/Button";

export default function LoginPage() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [rememberMe, setRememberMe] = useState(false);
  const { login, googleLogin } = useAuth();
  const [error, setError] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const router = useRouter();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    setIsLoading(true);
    const res = await login(email, password);
    if (res.success) {
      router.push("/dashboard");
    } else {
      setError(res.error);
    }
    setIsLoading(false);
  };

  const handleGoogleLogin = async () => {
    setError("");
    setIsLoading(true);
    await googleLogin();
    setIsLoading(false);
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
      <div style={{
        display: "flex",
        width: "100%",
        maxWidth: "900px",
        background: "#ffffff",
        borderRadius: "20px",
        overflow: "hidden",
        boxShadow: "0 8px 60px rgba(0,0,0,0.12)",
        border: "1px solid #e8e8e8",
        minHeight: "580px",
      }}>

        {/* Left Side - Form */}
        <div style={{
          flex: "0 0 50%",
          padding: "52px 48px",
          display: "flex",
          flexDirection: "column",
          justifyContent: "center",
          background: "#fafafa",
        }}>

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
              Login
            </h2>
            <p style={{
              fontSize: "13px",
              color: "#888",
              margin: 0,
              fontFamily: "system-ui, sans-serif",
              fontWeight: "400",
            }}>
              Choose from 10,000+ products across 400+ categories
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

          {/* Google Button */}
          <button
            onClick={handleGoogleLogin}
            disabled={isLoading}
            style={{
              width: "100%",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              gap: "10px",
              background: "#fff",
              border: "1.5px solid #e0e0e0",
              borderRadius: "10px",
              padding: "11px 16px",
              fontSize: "14px",
              color: "#333",
              fontFamily: "system-ui, sans-serif",
              fontWeight: "500",
              cursor: "pointer",
              marginBottom: "20px",
              transition: "border-color 0.2s, background 0.2s",
              boxShadow: "0 1px 4px rgba(0,0,0,0.04)",
            }}
            onMouseEnter={e => { e.currentTarget.style.borderColor = "#999"; e.currentTarget.style.background = "#f9f9f9"; }}
            onMouseLeave={e => { e.currentTarget.style.borderColor = "#e0e0e0"; e.currentTarget.style.background = "#fff"; }}
          >
            <svg width="18" height="18" viewBox="0 0 18 18">
              <path fill="#4285F4" d="M17.64 9.2c0-.637-.057-1.251-.164-1.84H9v3.481h4.844c-.209 1.125-.843 2.078-1.796 2.717v2.258h2.908c1.702-1.567 2.684-3.874 2.684-6.615z"/>
              <path fill="#34A853" d="M9 18c2.43 0 4.467-.806 5.956-2.18l-2.908-2.259c-.806.54-1.837.86-3.048.86-2.344 0-4.328-1.584-5.036-3.711H.957v2.332A8.997 8.997 0 0 0 9 18z"/>
              <path fill="#FBBC05" d="M3.964 10.71A5.41 5.41 0 0 1 3.682 9c0-.593.102-1.17.282-1.71V4.958H.957A8.996 8.996 0 0 0 0 9c0 1.452.348 2.827.957 4.042l3.007-2.332z"/>
              <path fill="#EA4335" d="M9 3.58c1.321 0 2.508.454 3.44 1.345l2.582-2.58C13.463.891 11.426 0 9 0A8.997 8.997 0 0 0 .957 4.958L3.964 7.29C4.672 5.163 6.656 3.58 9 3.58z"/>
            </svg>
            Sign in with Google
          </button>

          {/* Divider */}
          <div style={{
            display: "flex",
            alignItems: "center",
            gap: "12px",
            marginBottom: "20px",
          }}>
            <div style={{ flex: 1, height: "1px", background: "#e8e8e8" }} />
            <span style={{ fontSize: "11px", color: "#aaa", fontFamily: "system-ui, sans-serif", letterSpacing: "0.06em" }}>OR</span>
            <div style={{ flex: 1, height: "1px", background: "#e8e8e8" }} />
          </div>

          {/* Form */}
          <form onSubmit={handleSubmit} style={{ display: "flex", flexDirection: "column", gap: "14px" }}>
            {/* Email */}
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
                Email
              </label>
              <div style={{ position: "relative" }}>
                <input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="johncanny@gmail.com"
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

            {/* Password */}
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
                Password
              </label>
              <div style={{ position: "relative" }}>
                <input
                  type={showPassword ? "text" : "password"}
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="* * * * * * * *"
                  required
                  style={{
                    width: "100%",
                    padding: "10px 40px 10px 14px",
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
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  style={{
                    position: "absolute",
                    right: "12px",
                    top: "50%",
                    transform: "translateY(-50%)",
                    background: "none",
                    border: "none",
                    cursor: "pointer",
                    color: "#aaa",
                    padding: "0",
                    display: "flex",
                    alignItems: "center",
                  }}
                >
                  {showPassword ? <FiEye size={15} /> : <FiEyeOff size={15} />}
                </button>
              </div>
            </div>

            {/* Remember Me + Forgot */}
            <div style={{
              display: "flex",
              alignItems: "center",
              justifyContent: "space-between",
            }}>
              <label style={{
                display: "flex",
                alignItems: "center",
                gap: "7px",
                fontSize: "12.5px",
                color: "#555",
                fontFamily: "system-ui, sans-serif",
                cursor: "pointer",
              }}>
                <input
                  type="checkbox"
                  checked={rememberMe}
                  onChange={(e) => setRememberMe(e.target.checked)}
                  style={{
                    width: "14px",
                    height: "14px",
                    accentColor: "#111",
                    cursor: "pointer",
                  }}
                />
                Remember Me
              </label>
              <Link href="/forgot-password" style={{
                fontSize: "12.5px",
                color: "#777",
                textDecoration: "none",
                fontFamily: "system-ui, sans-serif",
              }}
                onMouseEnter={e => e.target.style.color = "#111"}
                onMouseLeave={e => e.target.style.color = "#777"}
              >
                Forgot password?
              </Link>
            </div>

            {/* Login Button */}
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
              ) : "Login"}
            </Button>
          </form>

          {/* Register */}
          <p style={{
            textAlign: "center",
            fontSize: "12.5px",
            color: "#888",
            marginTop: "20px",
            fontFamily: "system-ui, sans-serif",
          }}>
            Don&apos;t have an account?{" "}
            <Link href="/register" style={{ color: "#111", fontWeight: "600", textDecoration: "none" }}>
              Create one
            </Link>
          </p>
        </div>

        {/* Right Side - Product Image */}
        <div style={{
          flex: "0 0 50%",
          background: "#e8e2d9",
          position: "relative",
          overflow: "hidden",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          minHeight: "400px",
        }}>
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

              {/* Floor line */}
              <line x1="30" y1="275" x2="230" y2="275" stroke="#bbb" strokeWidth="1.5" opacity="0.5"/>
            </svg>
          </div>

          {/* Bottom strip */}
          <div style={{
            position: "absolute",
            bottom: 0,
            left: 0,
            right: 0,
            height: "72px",
            background: "#1a1a1a",
            zIndex: 1,
          }}>
            <div style={{
              padding: "16px 28px",
              color: "#fff",
            }}>
              <p style={{
                fontSize: "11px",
                letterSpacing: "0.14em",
                color: "#888",
                margin: "0 0 3px 0",
                fontFamily: "system-ui, sans-serif",
                textTransform: "uppercase",
              }}>
                Featured
              </p>
              <p style={{
                fontSize: "14px",
                fontWeight: "600",
                color: "#fff",
                margin: 0,
                fontFamily: "'Georgia', serif",
                letterSpacing: "0.01em",
              }}>
                Nordic Shell Chair
              </p>
            </div>
          </div>
        </div>
      </div>

      <style>{`
        @keyframes spin {
          to { transform: rotate(360deg); }
        }
        * { box-sizing: border-box; }
        input::placeholder { color: #bbb; }
      `}</style>
    </div>
  );
}