import { useState, useRef, useEffect } from "react";
import { auth, googleProvider } from "../firebase";
import { signInWithPopup } from "firebase/auth";

const LOGO_URL = "https://www.image2url.com/r2/default/images/1779000185015-e3a959ed-db44-4e32-8f67-af6ec4dcc4f5.png";

// ── MSG91 Config ──
const MSG91_WIDGET_ID = "366572656870333831323532";
const MSG91_AUTH_KEY = "517582A1ibOiqw0826a0aa03cP1"; // <-- paste your MSG91 auth key here

const COUNTRY_CODES = [
  { code: "+91", flag: "\u{1F1EE}\u{1F1F3}", name: "India" },
  { code: "+1", flag: "\u{1F1FA}\u{1F1F8}", name: "USA" },
  { code: "+44", flag: "\u{1F1EC}\u{1F1E7}", name: "UK" },
  { code: "+61", flag: "\u{1F1E6}\u{1F1FA}", name: "Australia" },
  { code: "+971", flag: "\u{1F1E6}\u{1F1EA}", name: "UAE" },
];

export default function LoginScreen({ onLogin, onAdminMode }) {
  const [phone, setPhone] = useState("");
  const [countryCode, setCountryCode] = useState("+91");
  const [otp, setOtp] = useState(["", "", "", "", "", ""]);
  const [step, setStep] = useState("phone"); // "phone" | "otp"
  const [authMode, setAuthMode] = useState("login"); // "login" | "register"
  const [regName, setRegName] = useState("");
  const [regEmail, setRegEmail] = useState("");
  const [timer, setTimer] = useState(0);
  const [showDropdown, setShowDropdown] = useState(false);
  const [loading, setLoading] = useState(false);
  const [msg91Token, setMsg91Token] = useState(null);
  const otpRefs = useRef([]);
  const containerRef = useRef(null);

  // ── Load MSG91 OTP Widget ──
  useEffect(() => {
    setTimeout(() => {
      if (containerRef.current) containerRef.current.classList.add("visible");
    }, 100);

    // Already initialized — just re-hook callbacks
    if (window.__msg91Loaded) {
      if (typeof window.initSendOTP === "function") {
        window.initSendOTP({
          widgetId: MSG91_WIDGET_ID,
          tokenAuth: MSG91_AUTH_KEY,
          exposeMethods: true,
          success: (data) => {
            setMsg91Token(data?.token || data?.jwt || data);
            setStep("otp");
            setTimer(30);
            setTimeout(() => otpRefs.current[0]?.focus(), 300);
          },
          failure: (error) => {
            console.error("MSG91 OTP failure:", error);
            setLoading(false);
            alert("Failed to send OTP. Please try again.");
          },
        });
      }
      return;
    }

    // Prevent concurrent loads (React Strict Mode double-effect)
    if (window.__msg91Loading) return;
    window.__msg91Loading = true;

    const configuration = {
      widgetId: MSG91_WIDGET_ID,
      tokenAuth: MSG91_AUTH_KEY,
      exposeMethods: true,
      success: (data) => {
        setMsg91Token(data?.token || data?.jwt || data);
        setStep("otp");
        setTimer(30);
        setTimeout(() => otpRefs.current[0]?.focus(), 300);
      },
      failure: (error) => {
        console.error("MSG91 OTP failure:", error);
        setLoading(false);
        alert("Failed to send OTP. Please try again.");
      },
    };

    const SCRIPT_URLS = [
      "https://verify.msg91.com/otp-provider.js",
      "https://verify.phone91.com/otp-provider.js",
    ];

    function loadWidget(idx = 0) {
      if (idx >= SCRIPT_URLS.length) return;

      // Skip if script tag already in DOM
      if (document.querySelector(`script[src="${SCRIPT_URLS[idx]}"]`)) {
        if (typeof window.initSendOTP === "function") {
          window.initSendOTP(configuration);
          window.__msg91Loaded = true;
        }
        return;
      }

      const s = document.createElement("script");
      s.src = SCRIPT_URLS[idx];
      s.async = true;
      s.onload = () => {
        if (typeof window.initSendOTP === "function") {
          window.initSendOTP(configuration);
          window.__msg91Loaded = true;
        }
      };
      s.onerror = () => loadWidget(idx + 1);
      document.head.appendChild(s);
    }

    loadWidget();
  }, []);

  // ── OTP countdown ──
  useEffect(() => {
    if (timer <= 0) return;
    const id = setInterval(() => setTimer(t => t - 1), 1000);
    return () => clearInterval(id);
  }, [timer]);

  // ── Send OTP via MSG91 widget ──
  const handleSendOTP = (e) => {
    e.preventDefault();
    if (phone.length < 10) return;
    setLoading(true);

    const phoneNumber = `${countryCode}${phone}`;

    // Trigger MSG91 widget to send OTP
    if (typeof window.sendOtp === "function") {
      window.sendOtp(phoneNumber);
    } else if (typeof window.initSendOTP === "function") {
      // Re-init with identifier if sendOtp not exposed
      window.initSendOTP({
        widgetId: MSG91_WIDGET_ID,
        tokenAuth: MSG91_AUTH_KEY,
        identifier: phoneNumber,
        exposeMethods: true,
        success: (data) => {
          setMsg91Token(data?.token || data?.jwt || data);
          setStep("otp");
          setTimer(30);
          setLoading(false);
          setTimeout(() => otpRefs.current[0]?.focus(), 300);
        },
        failure: (error) => {
          console.error("MSG91 OTP failure:", error);
          setLoading(false);
          alert("Failed to send OTP. Please try again.");
        },
      });
    } else {
      // Fallback: manual OTP flow for demo
      console.warn("MSG91 widget not loaded yet. Using demo mode.");
      setStep("otp");
      setTimer(30);
      setLoading(false);
      setTimeout(() => otpRefs.current[0]?.focus(), 300);
    }
  };

  // ── Verify OTP via MSG91 API ──
  const verifyOTP = async (otpCode) => {
    // If we have a JWT token from the widget, verify via your backend
    if (msg91Token && MSG91_AUTH_KEY) {
      try {
        const resp = await fetch("https://control.msg91.com/api/v5/widget/verifyAccessToken", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            authkey: MSG91_AUTH_KEY,
            "access-token": msg91Token,
          }),
        });
        const data = await resp.json();
        if (data.type === "success") {
          return true;
        }
        return false;
      } catch (err) {
        console.error("Token verification error:", err);
        return false;
      }
    }

    // If exposeMethods is true, use verifyOtp
    if (typeof window.verifyOtp === "function") {
      return new Promise((resolve) => {
        window.verifyOtp({
          otp: otpCode,
          success: () => resolve(true),
          failure: () => resolve(false),
        });
      });
    }

    // Demo fallback: accept any 6-digit OTP
    return otpCode.length === 6;
  };

  // ── OTP input handling ──
  const handleOTPChange = async (val, idx) => {
    if (!/^\d?$/.test(val)) return;
    const next = [...otp];
    next[idx] = val;
    setOtp(next);
    if (val && idx < 5) otpRefs.current[idx + 1]?.focus();

    // Auto-verify when all 6 digits entered
    if (next.every(d => d !== "")) {
      const code = next.join("");
      setLoading(true);
      const verified = await verifyOTP(code);
      setLoading(false);

      if (verified) {
        const identifier = authMode === "register" && regName ? regName : `${countryCode}${phone}`;
        onLogin?.(identifier);
      } else {
        alert("Invalid OTP. Please try again.");
        setOtp(["", "", "", "", "", ""]);
        otpRefs.current[0]?.focus();
      }
    }
  };

  const handleOTPKeyDown = (e, idx) => {
    if (e.key === "Backspace" && !otp[idx] && idx > 0) {
      otpRefs.current[idx - 1]?.focus();
    }
  };

  // ── Google Login ──
  const handleGoogleLogin = async () => {
    try {
      setLoading(true);
      const result = await signInWithPopup(auth, googleProvider);
      onLogin?.(result.user.displayName || "Google User");
    } catch (error) {
      console.error("Google Login Error", error);
      alert("Google login failed");
    } finally {
      setLoading(false);
    }
  };

  // ── Resend OTP ──
  const handleResend = () => {
    setTimer(30);
    const phoneNumber = `${countryCode}${phone}`;
    if (typeof window.sendOtp === "function") {
      window.sendOtp(phoneNumber);
    }
  };

  const currentCountry = COUNTRY_CODES.find(c => c.code === countryCode);

  return (
    <div className="auth-page">
      {/* Decorative elements */}
      <div className="auth-bg-orb auth-orb-1" />
      <div className="auth-bg-orb auth-orb-2" />
      <div className="auth-bg-orb auth-orb-3" />
      <div className="auth-leaf auth-leaf-1">🌿</div>
      <div className="auth-leaf auth-leaf-2">🍃</div>
      <div className="auth-leaf auth-leaf-3">🌱</div>

      <div className="auth-container" ref={containerRef}>
        {/* Logo */}
        <div className="auth-logo-area">
          <img src={LOGO_URL} alt="DSA Naturals" className="auth-logo-img" />
          <h1 className="auth-brand">
            DSA
            <span className="auth-brand-nat"> Naturals</span>
          </h1>
        </div>

        {/* Card */}
        <div className="auth-card">
          <div className="auth-card-glow" />

          {step === "phone" ? (
            <>
              <h2 className="auth-title">{authMode === "login" ? "Welcome" : "Create Account"}</h2>
              <p className="auth-subtitle">
                {authMode === "login"
                  ? "Sign in with your mobile number to continue"
                  : "Register with your details to get started"}
              </p>

              <form onSubmit={handleSendOTP} className="auth-form">
                {authMode === "register" && (
                  <>
                    <div className="auth-field-group">
                      <label className="auth-label">Full Name</label>
                      <input
                        type="text"
                        className="auth-input"
                        placeholder="Enter your full name"
                        value={regName}
                        onChange={e => setRegName(e.target.value)}
                        autoFocus
                      />
                    </div>
                    <div className="auth-field-group">
                      <label className="auth-label">Email Address</label>
                      <input
                        type="email"
                        className="auth-input"
                        placeholder="Enter your email"
                        value={regEmail}
                        onChange={e => setRegEmail(e.target.value)}
                      />
                    </div>
                  </>
                )}

                <label className="auth-label">Mobile Number</label>
                <div className="auth-phone-row">
                  <button
                    type="button"
                    className="auth-country-btn"
                    onClick={() => setShowDropdown(!showDropdown)}
                  >
                    <span className="auth-flag">{currentCountry?.flag}</span>
                    <span className="auth-code">{countryCode}</span>
                    <svg width="10" height="10" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
                      <path d="M6 9l6 6 6-6" />
                    </svg>
                  </button>

                  {showDropdown && (
                    <div className="auth-dropdown">
                      {COUNTRY_CODES.map(c => (
                        <button
                          key={c.code}
                          type="button"
                          className={`auth-dropdown-item${c.code === countryCode ? " active" : ""}`}
                          onClick={() => { setCountryCode(c.code); setShowDropdown(false); }}
                        >
                          <span>{c.flag}</span>
                          <span>{c.name}</span>
                          <span className="auth-dropdown-code">{c.code}</span>
                        </button>
                      ))}
                    </div>
                  )}

                  <input
                    type="tel"
                    className="auth-phone-input"
                    placeholder="Enter mobile number"
                    value={phone}
                    onChange={e => setPhone(e.target.value.replace(/\D/g, "").slice(0, 10))}
                    maxLength={10}
                    autoFocus={authMode === "login"}
                  />
                </div>

                <button
                  type="submit"
                  className={`auth-submit${phone.length >= 10 && !loading ? " ready" : ""}`}
                  disabled={phone.length < 10 || loading || (authMode === "register" && (!regName.trim() || !regEmail.trim()))}
                >
                  <span>{loading ? "Sending..." : authMode === "login" ? "Get OTP" : "Register & Get OTP"}</span>
                  <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                    <path d="M5 12h14M12 5l7 7-7 7" />
                  </svg>
                </button>
              </form>

              <div className="auth-divider">
                <span>or continue with</span>
              </div>

              <button className="auth-google-btn" onClick={handleGoogleLogin} disabled={loading}>
                <svg width="20" height="20" viewBox="0 0 24 24">
                  <path d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92a5.06 5.06 0 0 1-2.2 3.32v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.1z" fill="#4285F4" />
                  <path d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" fill="#34A853" />
                  <path d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18A10.96 10.96 0 0 0 1 12c0 1.77.42 3.45 1.18 4.93l2.85-2.22.81-.62z" fill="#FBBC05" />
                  <path d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" fill="#EA4335" />
                </svg>
                <span>Continue with Google</span>
              </button>

              <div className="auth-toggle-mode">
                {authMode === "login" ? (
                  <span>New user? <button type="button" className="auth-toggle-btn" onClick={() => setAuthMode("register")}>Create Account</button></span>
                ) : (
                  <span>Already have an account? <button type="button" className="auth-toggle-btn" onClick={() => setAuthMode("login")}>Sign In</button></span>
                )}
              </div>

              <div className="auth-toggle-mode" style={{ marginTop: 4 }}>
                <button type="button" className="auth-toggle-btn" onClick={onAdminMode} style={{ fontSize: 12, opacity: 0.6 }}>
                  Admin Login
                </button>
              </div>
            </>
          ) : (
            <>
              <button className="auth-back-btn" onClick={() => { setStep("phone"); setOtp(["", "", "", "", "", ""]); }}>
                <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                  <path d="M19 12H5M12 19l-7-7 7-7" />
                </svg>
              </button>

              <h2 className="auth-title">Verify OTP</h2>
              <p className="auth-subtitle">
                Enter the 6-digit code sent to<br />
                <strong>{countryCode} {phone}</strong>
              </p>

              <div className="auth-otp-row">
                {otp.map((d, i) => (
                  <input
                    key={i}
                    ref={el => (otpRefs.current[i] = el)}
                    type="text"
                    inputMode="numeric"
                    className={`auth-otp-box${d ? " filled" : ""}`}
                    value={d}
                    onChange={e => handleOTPChange(e.target.value, i)}
                    onKeyDown={e => handleOTPKeyDown(e, i)}
                    maxLength={1}
                  />
                ))}
              </div>

              <div className="auth-resend">
                {timer > 0 ? (
                  <span className="auth-timer">Resend in <strong>{timer}s</strong></span>
                ) : (
                  <button className="auth-resend-btn" onClick={handleResend}>
                    Resend OTP
                  </button>
                )}
              </div>
            </>
          )}

          <p className="auth-terms">
            By continuing, you agree to our{" "}
            <a href="#">Terms of Service</a> &{" "}
            <a href="#">Privacy Policy</a>
          </p>
        </div>

        <p className="auth-footer-text">
          Pure &middot; Natural &middot; Organic
        </p>
      </div>
    </div>
  );
}
