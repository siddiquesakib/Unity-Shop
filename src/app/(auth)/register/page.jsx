"use client";
import Link from "next/link";
import { useState } from "react";
import { useAuth } from "@/contexts/AuthContext";
import { useRouter } from "next/navigation";
import { FiMail, FiLock, FiUser, FiArrowRight, FiCheck, FiEye, FiEyeOff } from "react-icons/fi";
import { COUNTRY_OPTIONS, getCityOptions } from "@/lib/locationData";
import Button from "@/components/common/Button";

const RegisterPage = () => {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [country, setCountry] = useState("");
  const [city, setCity] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirm, setShowConfirm] = useState(false);
  const { register, googleLogin } = useAuth();
  const [error, setError] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [emailSent, setEmailSent] = useState(false);
  const router = useRouter();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    if (password !== confirmPassword) {
      setError("Passwords do not match!");
      return;
    }
    setIsLoading(true);
    const hasLocation = country.trim() || city.trim();
    if (hasLocation && (!country.trim() || !city.trim())) {
      setError("Please select both country and city, or leave both blank.");
      setIsLoading(false);
      return;
    }

    const res = await register(name, email, password, {
      country,
      city,
    });
    if (res.success) {
      setEmailSent(true);
    } else {
      setError(res.error);
    }
    setIsLoading(false);
  };

  const handleGoogleSignUp = async () => {
    setError("");
    setIsLoading(true);
    await googleLogin();
    setIsLoading(false);
  };

  const features = [
    "Free shipping on orders over $50",
    "Exclusive member-only deals",
    "Easy 30-day returns",
    "24/7 customer support",
  ];

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
        minHeight: "620px",
      }}>

        {/* Left Side - Form */}
        <div style={{
          flex: "0 0 50%",
          padding: "48px 44px",
          display: "flex",
          flexDirection: "column",
          justifyContent: "center",
          background: "#fafafa",
        }}>

          {/* Logo */}
          <div style={{ marginBottom: "28px" }}>
            <span style={{
              fontFamily: "'Georgia', serif",
              fontSize: "13px",
              fontWeight: "700",
              letterSpacing: "0.22em",
              color: "#111",
              textTransform: "uppercase",
            }}>
              Unity Shop
            </span>
          </div>

          {emailSent ? (
            /* Email Sent State */
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
                <FiMail color="#fff" size={26} />
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
                We&apos;ve sent a verification link to:
              </p>
              <p style={{ fontSize: "14px", fontWeight: "600", color: "#111", margin: "0 0 14px 0", fontFamily: "system-ui, sans-serif" }}>
                {email}
              </p>
              <p style={{ fontSize: "12px", color: "#aaa", margin: "0 0 16px 0", fontFamily: "system-ui, sans-serif", lineHeight: "1.6" }}>
                Click the link in your email to verify your account.<br />
                The link expires in <strong style={{ color: "#555" }}>24 hours</strong>.
              </p>
              <div style={{
                background: "#fff",
                border: "1px solid #e8e8e8",
                borderRadius: "10px",
                padding: "12px 16px",
                marginBottom: "20px",
              }}>
                <p style={{ fontSize: "11.5px", color: "#aaa", margin: 0, fontFamily: "system-ui, sans-serif" }}>
                  Can&apos;t find the email? Check your spam/junk folder.
                </p>
              </div>
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
                Already verified? Go to Login
                <FiArrowRight size={13} />
              </Link>
            </div>
          ) : (
            <>
              <div style={{ marginBottom: "22px" }}>
                <h2 style={{
                  fontSize: "24px",
                  fontWeight: "700",
                  color: "#111",
                  margin: "0 0 5px 0",
                  fontFamily: "'Georgia', serif",
                  letterSpacing: "-0.01em",
                }}>
                  Create Account
                </h2>
                <p style={{
                  fontSize: "12px",
                  color: "#888",
                  margin: 0,
                  fontFamily: "system-ui, sans-serif",
                }}>
                  Join thousands of happy shoppers
                </p>
              </div>

              {error && (
                <div style={{
                  marginBottom: "14px",
                  padding: "10px 14px",
                  background: "#fff5f5",
                  border: "1px solid #ffc0c0",
                  borderRadius: "10px",
                  color: "#c00",
                  fontSize: "12.5px",
                  fontFamily: "system-ui, sans-serif",
                }}>
                  {error}
                </div>
              )}

              {/* Google Button */}
              <button
                onClick={handleGoogleSignUp}
                disabled={isLoading}
                style={{
                  width: "100%",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  gap: "9px",
                  background: "#fff",
                  border: "1.5px solid #e0e0e0",
                  borderRadius: "10px",
                  padding: "10px 16px",
                  fontSize: "13px",
                  color: "#333",
                  fontFamily: "system-ui, sans-serif",
                  fontWeight: "500",
                  cursor: "pointer",
                  marginBottom: "16px",
                  boxShadow: "0 1px 4px rgba(0,0,0,0.04)",
                  transition: "border-color 0.2s",
                }}
                onMouseEnter={e => { e.currentTarget.style.borderColor = "#999"; e.currentTarget.style.background = "#f9f9f9"; }}
                onMouseLeave={e => { e.currentTarget.style.borderColor = "#e0e0e0"; e.currentTarget.style.background = "#fff"; }}
              >
                <svg width="16" height="16" viewBox="0 0 18 18">
                  <path fill="#4285F4" d="M17.64 9.2c0-.637-.057-1.251-.164-1.84H9v3.481h4.844c-.209 1.125-.843 2.078-1.796 2.717v2.258h2.908c1.702-1.567 2.684-3.874 2.684-6.615z"/>
                  <path fill="#34A853" d="M9 18c2.43 0 4.467-.806 5.956-2.18l-2.908-2.259c-.806.54-1.837.86-3.048.86-2.344 0-4.328-1.584-5.036-3.711H.957v2.332A8.997 8.997 0 0 0 9 18z"/>
                  <path fill="#FBBC05" d="M3.964 10.71A5.41 5.41 0 0 1 3.682 9c0-.593.102-1.17.282-1.71V4.958H.957A8.996 8.996 0 0 0 0 9c0 1.452.348 2.827.957 4.042l3.007-2.332z"/>
                  <path fill="#EA4335" d="M9 3.58c1.321 0 2.508.454 3.44 1.345l2.582-2.58C13.463.891 11.426 0 9 0A8.997 8.997 0 0 0 .957 4.958L3.964 7.29C4.672 5.163 6.656 3.58 9 3.58z"/>
                </svg>
                Sign up with Google
              </button>

              {/* Divider */}
              <div style={{ display: "flex", alignItems: "center", gap: "10px", marginBottom: "16px" }}>
                <div style={{ flex: 1, height: "1px", background: "#e8e8e8" }} />
                <span style={{ fontSize: "10px", color: "#aaa", fontFamily: "system-ui, sans-serif", letterSpacing: "0.06em" }}>OR</span>
                <div style={{ flex: 1, height: "1px", background: "#e8e8e8" }} />
              </div>

              <form onSubmit={handleSubmit} style={{ display: "flex", flexDirection: "column", gap: "11px" }}>
                {/* Name */}
                <div>
                  <label style={{ display: "block", fontSize: "11px", fontWeight: "500", color: "#555", marginBottom: "5px", fontFamily: "system-ui, sans-serif", letterSpacing: "0.02em" }}>
                    Full Name
                  </label>
                  <input
                    type="text"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    placeholder="John Doe"
                    required
                    style={{
                      width: "100%",
                      padding: "9px 14px",
                      background: "#fff",
                      border: "1.5px solid #e0e0e0",
                      borderRadius: "10px",
                      fontSize: "13px",
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

                {/* Email */}
                <div>
                  <label style={{ display: "block", fontSize: "11px", fontWeight: "500", color: "#555", marginBottom: "5px", fontFamily: "system-ui, sans-serif", letterSpacing: "0.02em" }}>
                    Email
                  </label>
                  <input
                    type="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder="you@example.com"
                    required
                    style={{
                      width: "100%",
                      padding: "9px 14px",
                      background: "#fff",
                      border: "1.5px solid #e0e0e0",
                      borderRadius: "10px",
                      fontSize: "13px",
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

                {/* Password */}
                <div>
                  <label style={{ display: "block", fontSize: "11px", fontWeight: "500", color: "#555", marginBottom: "5px", fontFamily: "system-ui, sans-serif", letterSpacing: "0.02em" }}>
                    Country (Optional)
                  </label>
                  <select
                    value={country}
                    onChange={(e) => {
                      const nextCountry = e.target.value;
                      setCountry(nextCountry);
                      const cityOptions = getCityOptions(nextCountry);
                      if (!cityOptions.includes(city)) {
                        setCity("");
                      }
                    }}
                    style={{
                      width: "100%",
                      padding: "9px 14px",
                      background: "#fff",
                      border: "1.5px solid #e0e0e0",
                      borderRadius: "10px",
                      fontSize: "13px",
                      color: "#111",
                      fontFamily: "system-ui, sans-serif",
                      outline: "none",
                      boxSizing: "border-box",
                      transition: "border-color 0.2s",
                    }}
                    onFocus={e => e.target.style.borderColor = "#111"}
                    onBlur={e => e.target.style.borderColor = "#e0e0e0"}
                  >
                    <option value="">Select country</option>
                    {COUNTRY_OPTIONS.map((option) => (
                      <option key={option} value={option}>{option}</option>
                    ))}
                  </select>
                </div>

                <div>
                  <label style={{ display: "block", fontSize: "11px", fontWeight: "500", color: "#555", marginBottom: "5px", fontFamily: "system-ui, sans-serif", letterSpacing: "0.02em" }}>
                    City (Optional)
                  </label>
                  <select
                    value={city}
                    onChange={(e) => setCity(e.target.value)}
                    disabled={!country}
                    style={{
                      width: "100%",
                      padding: "9px 14px",
                      background: "#fff",
                      border: "1.5px solid #e0e0e0",
                      borderRadius: "10px",
                      fontSize: "13px",
                      color: "#111",
                      fontFamily: "system-ui, sans-serif",
                      outline: "none",
                      boxSizing: "border-box",
                      transition: "border-color 0.2s",
                      opacity: country ? 1 : 0.7,
                    }}
                    onFocus={e => e.target.style.borderColor = "#111"}
                    onBlur={e => e.target.style.borderColor = "#e0e0e0"}
                  >
                    <option value="">Select city</option>
                    {getCityOptions(country).map((option) => (
                      <option key={option} value={option}>{option}</option>
                    ))}
                  </select>
                </div>

                {/* Password */}
                <div>
                  <label style={{ display: "block", fontSize: "11px", fontWeight: "500", color: "#555", marginBottom: "5px", fontFamily: "system-ui, sans-serif", letterSpacing: "0.02em" }}>
                    Password
                  </label>
                  <div style={{ position: "relative" }}>
                    <input
                      type={showPassword ? "text" : "password"}
                      value={password}
                      onChange={(e) => setPassword(e.target.value)}
                      placeholder="Create a strong password"
                      required
                      style={{
                        width: "100%",
                        padding: "9px 38px 9px 14px",
                        background: "#fff",
                        border: "1.5px solid #e0e0e0",
                        borderRadius: "10px",
                        fontSize: "13px",
                        color: "#111",
                        fontFamily: "system-ui, sans-serif",
                        outline: "none",
                        boxSizing: "border-box",
                        transition: "border-color 0.2s",
                      }}
                      onFocus={e => e.target.style.borderColor = "#111"}
                      onBlur={e => e.target.style.borderColor = "#e0e0e0"}
                    />
                    <button type="button" onClick={() => setShowPassword(!showPassword)} style={{ position: "absolute", right: "12px", top: "50%", transform: "translateY(-50%)", background: "none", border: "none", cursor: "pointer", color: "#aaa", padding: 0, display: "flex", alignItems: "center" }}>
                      {showPassword ? <FiEye size={14} /> : <FiEyeOff size={14} />}
                    </button>
                  </div>
                </div>

                {/* Confirm Password */}
                <div>
                  <label style={{ display: "block", fontSize: "11px", fontWeight: "500", color: "#555", marginBottom: "5px", fontFamily: "system-ui, sans-serif", letterSpacing: "0.02em" }}>
                    Confirm Password
                  </label>
                  <div style={{ position: "relative" }}>
                    <input
                      type={showConfirm ? "text" : "password"}
                      value={confirmPassword}
                      onChange={(e) => setConfirmPassword(e.target.value)}
                      placeholder="Confirm your password"
                      required
                      style={{
                        width: "100%",
                        padding: "9px 38px 9px 14px",
                        background: "#fff",
                        border: "1.5px solid #e0e0e0",
                        borderRadius: "10px",
                        fontSize: "13px",
                        color: "#111",
                        fontFamily: "system-ui, sans-serif",
                        outline: "none",
                        boxSizing: "border-box",
                        transition: "border-color 0.2s",
                      }}
                      onFocus={e => e.target.style.borderColor = "#111"}
                      onBlur={e => e.target.style.borderColor = "#e0e0e0"}
                    />
                    <button type="button" onClick={() => setShowConfirm(!showConfirm)} style={{ position: "absolute", right: "12px", top: "50%", transform: "translateY(-50%)", background: "none", border: "none", cursor: "pointer", color: "#aaa", padding: 0, display: "flex", alignItems: "center" }}>
                      {showConfirm ? <FiEye size={14} /> : <FiEyeOff size={14} />}
                    </button>
                  </div>
                </div>

                {/* Submit */}
                <Button
                  type="submit"
                  disabled={isLoading}
                  style={{
                    width: "100%",
                    padding: "11px",
                    background: "#1a1a1a",
                    color: "#fff",
                    border: "none",
                    borderRadius: "10px",
                    fontSize: "13.5px",
                    fontWeight: "600",
                    fontFamily: "system-ui, sans-serif",
                    cursor: "pointer",
                    marginTop: "4px",
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    gap: "7px",
                    transition: "background 0.2s",
                  }}
                  onMouseEnter={e => { if (!isLoading) e.currentTarget.style.background = "#333"; }}
                  onMouseLeave={e => { e.currentTarget.style.background = "#1a1a1a"; }}
                >
                  {isLoading ? (
                    <div style={{ width: "17px", height: "17px", border: "2px solid rgba(255,255,255,0.3)", borderTopColor: "#fff", borderRadius: "50%", animation: "spin 0.7s linear infinite" }} />
                  ) : (
                    <>Create Account</>
                  )}
                </Button>
              </form>

              <p style={{ textAlign: "center", fontSize: "12px", color: "#888", marginTop: "16px", fontFamily: "system-ui, sans-serif" }}>
                Already have an account?{" "}
                <Link href="/login" style={{ color: "#111", fontWeight: "600", textDecoration: "none" }}>
                  Sign In
                </Link>
              </p>
            </>
          )}
        </div>

        {/* Right Side - Branding */}
        <div style={{
          flex: "0 0 50%",
          background: "#1a1a1a",
          position: "relative",
          overflow: "hidden",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
        }}>
          {/* Subtle decorative circles */}
          <div style={{ position: "absolute", top: "-80px", left: "-80px", width: "280px", height: "280px", borderRadius: "50%", background: "rgba(255,255,255,0.03)" }} />
          <div style={{ position: "absolute", bottom: "-60px", right: "-60px", width: "220px", height: "220px", borderRadius: "50%", background: "rgba(255,255,255,0.03)" }} />
          <div style={{ position: "absolute", top: "30%", left: "20%", width: "6px", height: "6px", borderRadius: "50%", background: "rgba(255,255,255,0.15)" }} />
          <div style={{ position: "absolute", top: "60%", right: "25%", width: "4px", height: "4px", borderRadius: "50%", background: "rgba(255,255,255,0.1)" }} />
          <div style={{ position: "absolute", bottom: "28%", left: "30%", width: "3px", height: "3px", borderRadius: "50%", background: "rgba(255,255,255,0.12)" }} />

          <div style={{ position: "relative", zIndex: 10, textAlign: "center", padding: "0 40px", width: "100%" }}>
            {/* Logo mark */}
            <div style={{
              width: "52px",
              height: "52px",
              borderRadius: "14px",
              background: "#fff",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              margin: "0 auto 24px",
            }}>
              <span style={{ fontSize: "22px", fontWeight: "900", color: "#111", fontFamily: "'Georgia', serif" }}>L</span>
            </div>

            <h1 style={{
              fontSize: "28px",
              fontWeight: "700",
              color: "#fff",
              margin: "0 0 10px 0",
              fontFamily: "'Georgia', serif",
              letterSpacing: "-0.01em",
            }}>
              Start Shopping
            </h1>
            <p style={{
              fontSize: "13px",
              color: "#666",
              lineHeight: "1.7",
              margin: "0 auto 32px",
              maxWidth: "240px",
              fontFamily: "system-ui, sans-serif",
            }}>
              Create your free account and get access to exclusive deals and personalized recommendations.
            </p>

            {/* Feature list */}
            <div style={{ display: "flex", flexDirection: "column", gap: "12px", textAlign: "left", maxWidth: "240px", margin: "0 auto" }}>
              {features.map((feature, i) => (
                <div key={i} style={{ display: "flex", alignItems: "center", gap: "12px" }}>
                  <div style={{
                    width: "22px",
                    height: "22px",
                    borderRadius: "50%",
                    background: "rgba(255,255,255,0.08)",
                    border: "1px solid rgba(255,255,255,0.12)",
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    flexShrink: 0,
                  }}>
                    <FiCheck size={11} color="rgba(255,255,255,0.7)" />
                  </div>
                  <span style={{ fontSize: "12.5px", color: "#666", fontFamily: "system-ui, sans-serif", lineHeight: "1.4" }}>
                    {feature}
                  </span>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>

      <style>{`
        @keyframes spin { to { transform: rotate(360deg); } }
        * { box-sizing: border-box; }
        input::placeholder { color: #bbb; }
      `}</style>
    </div>
  );
};

export default RegisterPage;