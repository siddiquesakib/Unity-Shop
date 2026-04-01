"use client";
import Link from "next/link";
import { useState, useEffect, Suspense } from "react";
import { useSearchParams } from "next/navigation";
import {
  FiLock,
  FiEye,
  FiEyeOff,
  FiCheck,
  FiAlertCircle,
  FiArrowRight,
  FiArrowLeft,
} from "react-icons/fi";

import Button from "@/components/common/Button";

function ResetPasswordForm() {
  const searchParams = useSearchParams();
  const token = searchParams.get("token");
  const email = searchParams.get("email");

  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirm, setShowConfirm] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [invalidLink, setInvalidLink] = useState(false);

  useEffect(() => {
    if (!token || !email) {
      setInvalidLink(true);
    }
  }, [token, email]);

  // Password strength checker
  const getPasswordStrength = (pass) => {
    if (!pass) return { level: 0, text: "", color: "" };
    let score = 0;
    if (pass.length >= 6) score++;
    if (pass.length >= 8) score++;
    if (/[A-Z]/.test(pass)) score++;
    if (/[0-9]/.test(pass)) score++;
    if (/[^A-Za-z0-9]/.test(pass)) score++;

    if (score <= 1) return { level: 1, text: "Weak", color: "bg-red-500" };
    if (score <= 2) return { level: 2, text: "Fair", color: "bg-yellow-500" };
    if (score <= 3) return { level: 3, text: "Good", color: "bg-blue-500" };
    return { level: 4, text: "Strong", color: "bg-green-500" };
  };

  const strength = getPasswordStrength(newPassword);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");

    if (newPassword.length < 6) {
      setError("Password must be at least 6 characters");
      return;
    }

    if (newPassword !== confirmPassword) {
      setError("Passwords do not match!");
      return;
    }

    setIsLoading(true);

    try {
      const res = await fetch(
        `${process.env.NEXT_PUBLIC_API_URL}/auth/reset-password`,
        {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ email, token, newPassword }),
        },
      );

      const data = await res.json();

      if (!res.ok) {
        throw new Error(data.message || "Reset failed");
      }

      setSuccess(true);
    } catch (err) {
      setError(err.message);
    } finally {
      setIsLoading(false);
    }
  };

  // Invalid link state
  if (invalidLink) {
    return (
      <div style={{ textAlign: "center", padding: "24px 0" }}>
        <div style={{
          width: "64px",
          height: "64px",
          borderRadius: "50%",
          background: "#fff5f5",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          margin: "0 auto 20px",
          border: "1px solid #ffc0c0"
        }}>
          <FiAlertCircle color="#c00" size={26} />
        </div>
        <h2 style={{
          fontSize: "22px",
          fontWeight: "700",
          color: "#111",
          margin: "0 0 8px 0",
          fontFamily: "'Georgia', serif",
        }}>
          Invalid Reset Link
        </h2>
        <p style={{ fontSize: "12.5px", color: "#888", margin: "0 0 20px 0", fontFamily: "system-ui, sans-serif", lineHeight: "1.6" }}>
          This password reset link is invalid or has expired.
          <br />
          Please request a new one.
        </p>
        <Link href="/forgot-password" style={{
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          gap: "8px",
          width: "100%",
          padding: "12px",
          background: "#1a1a1a",
          color: "#fff",
          border: "none",
          borderRadius: "10px",
          fontSize: "14px",
          fontWeight: "600",
          fontFamily: "system-ui, sans-serif",
          textDecoration: "none",
          transition: "background 0.2s",
        }}>
          Request New Link
          <FiArrowRight size={15} />
        </Link>
      </div>
    );
  }

  // Success state
  if (success) {
    return (
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
          Password Reset Successful!
        </h2>
        <p style={{ fontSize: "12.5px", color: "#888", margin: "0 0 20px 0", fontFamily: "system-ui, sans-serif", lineHeight: "1.6" }}>
          Your password has been updated successfully.
          <br />
          You can now login with your new password.
        </p>
        <Link href="/login" style={{
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          gap: "8px",
          width: "100%",
          padding: "12px",
          background: "#1a1a1a",
          color: "#fff",
          border: "none",
          borderRadius: "10px",
          fontSize: "14px",
          fontWeight: "600",
          fontFamily: "system-ui, sans-serif",
          textDecoration: "none",
          transition: "background 0.2s",
        }}>
          Go to Login
          <FiArrowRight size={15} />
        </Link>
      </div>
    );
  }

  // Reset form
  return (
    <>
      <div style={{ marginBottom: "28px" }}>
        <h2 style={{
          fontSize: "26px",
          fontWeight: "700",
          color: "#111",
          margin: "0 0 6px 0",
          fontFamily: "'Georgia', serif",
          letterSpacing: "-0.01em",
        }}>
          Create New Password
        </h2>
        <p style={{
          fontSize: "13px",
          color: "#888",
          margin: 0,
          fontFamily: "system-ui, sans-serif",
          fontWeight: "400",
        }}>
          Your new password must be at least 6 characters long.
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
        {/* New Password */}
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
            New Password
          </label>
          <div style={{ position: "relative" }}>
            <input
              type={showPassword ? "text" : "password"}
              value={newPassword}
              onChange={(e) => setNewPassword(e.target.value)}
              placeholder="* * * * * * * *"
              required
              minLength={6}
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
              {showPassword ? <FiEyeOff size={15} /> : <FiEye size={15} />}
            </button>
          </div>

          {/* Password strength indicator */}
          {newPassword && (
            <div style={{ marginTop: "8px" }}>
              <div style={{ display: "flex", gap: "4px", marginBottom: "4px" }}>
                {[1, 2, 3, 4].map((i) => (
                  <div
                    key={i}
                    style={{
                      height: "4px",
                      flex: 1,
                      borderRadius: "2px",
                      background: i <= strength.level 
                        ? (strength.color.includes("red") ? "#ef4444" : strength.color.includes("yellow") ? "#f59e0b" : strength.color.includes("blue") ? "#3b82f6" : "#22c55e")
                        : "#e5e7eb",
                      transition: "all 0.2s"
                    }}
                  />
                ))}
              </div>
              <p style={{
                  fontSize: "11px",
                  margin: 0,
                  fontFamily: "system-ui, sans-serif",
                  color: strength.level <= 1 ? "#ef4444" : strength.level <= 2 ? "#f59e0b" : strength.level <= 3 ? "#3b82f6" : "#22c55e"
              }}>
                {strength.text}
              </p>
            </div>
          )}
        </div>

        {/* Confirm Password */}
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
            Confirm Password
          </label>
          <div style={{ position: "relative" }}>
            <input
              type={showConfirm ? "text" : "password"}
              value={confirmPassword}
              onChange={(e) => setConfirmPassword(e.target.value)}
              placeholder="* * * * * * * *"
              required
              minLength={6}
              style={{
                width: "100%",
                padding: "10px 40px 10px 14px",
                background: "#fff",
                border: `1.5px solid ${confirmPassword && confirmPassword !== newPassword ? '#fca5a5' : confirmPassword && confirmPassword === newPassword ? '#86efac' : '#e0e0e0'}`,
                borderRadius: "10px",
                fontSize: "13.5px",
                color: "#111",
                fontFamily: "system-ui, sans-serif",
                outline: "none",
                boxSizing: "border-box",
                transition: "border-color 0.2s",
              }}
              onFocus={e => { if(!confirmPassword || confirmPassword === newPassword) e.target.style.borderColor = "#111"}}
              onBlur={e => { if(!confirmPassword) e.target.style.borderColor = "#e0e0e0"}}
            />
            <button
              type="button"
              onClick={() => setShowConfirm(!showConfirm)}
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
              {showConfirm ? <FiEyeOff size={15} /> : <FiEye size={15} />}
            </button>
          </div>
          {confirmPassword && confirmPassword !== newPassword && (
            <p style={{ color: "#ef4444", fontSize: "11px", marginTop: "4px", margin: "4px 0 0 0", fontFamily: "system-ui, sans-serif" }}>Passwords do not match</p>
          )}
          {confirmPassword && confirmPassword === newPassword && (
            <p style={{ color: "#22c55e", fontSize: "11px", marginTop: "4px", margin: "4px 0 0 0", fontFamily: "system-ui, sans-serif", display: "flex", alignItems: "center", gap: "4px" }}>
              <FiCheck size={12} /> Passwords match
            </p>
          )}
        </div>

        {/* Submit Button */}
        <Button
          type="submit"
          disabled={isLoading || !newPassword || !confirmPassword}
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
            opacity: (isLoading || !newPassword || !confirmPassword) ? 0.6 : 1,
            pointerEvents: (isLoading || !newPassword || !confirmPassword) ? "none" : "auto",
          }}
          onMouseEnter={e => { if (!isLoading && newPassword && confirmPassword) e.currentTarget.style.background = "#333"; }}
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
              Reset Password
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
        <Link href="/login" style={{ 
          color: "#111", 
          fontWeight: "600", 
          textDecoration: "none",
          display: "inline-flex",
          alignItems: "center",
          gap: "6px"
        }}>
          <FiArrowLeft size={13} />
          Back to Login
        </Link>
      </p>
    </>
  );
}

export default function ResetPasswordPage() {
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

          <Suspense fallback={
            <div style={{ textAlign: "center", padding: "20px" }}>
              <div style={{
                width: "24px",
                height: "24px",
                border: "2px solid #e0e0e0",
                borderTopColor: "#111",
                borderRadius: "50%",
                animation: "spin 0.7s linear infinite",
                margin: "0 auto 10px"
              }} />
              <p style={{ fontSize: "13px", color: "#888", fontFamily: "system-ui, sans-serif" }}>Loading...</p>
            </div>
          }>
            <ResetPasswordForm />
          </Suspense>
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
