import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import Navbar from "../components/Navbar";
import { requestOtp, verifyOtp, setToken } from "../api/auth";

export default function AuthPage() {
  const navigate = useNavigate();
  const [phone, setPhone] = useState("");
  const [otp, setOtp] = useState("");
  const [step, setStep] = useState<"phone" | "otp">("phone");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [devCode, setDevCode] = useState<string | null>(null);

  const phoneRegex = /^\+?[0-9]{10,15}$/;

  async function handleSendOtp() {
    setError("");
    if (!phoneRegex.test(phone)) { setError("Enter a valid 10-digit phone number."); return; }
    setLoading(true);
    try {
      const res = await requestOtp(phone);
      if (res?.message === "OTP sent") {
        setStep("otp");
        if (res.devCode) setDevCode(res.devCode);
      } else {
        setError(res?.message || "Failed to send OTP.");
      }
    } catch { setError("Server error. Make sure the API is running."); }
    finally { setLoading(false); }
  }

  async function handleVerifyOtp() {
    setError("");
    if (otp.length !== 6) { setError("OTP must be exactly 6 digits."); return; }
    setLoading(true);
    try {
      const res = await verifyOtp(phone, otp);
      if (res?.accessToken) {
        setToken(res.accessToken);
        navigate("/listings");
      } else {
        setError(res?.message || "Invalid OTP.");
      }
    } catch { setError("Server error while verifying."); }
    finally { setLoading(false); }
  }

  const inputStyle: React.CSSProperties = {
    width: "100%", background: "#fff", border: "1px solid var(--fg)", borderRadius: 0,
    padding: "14px 16px", fontSize: "0.9rem", color: "var(--fg)", outline: "none", fontFamily: "inherit",
  };

  return (
    <div style={{ minHeight: "100vh", background: "var(--bg)" }}>
      <Navbar />

      <div style={{ maxWidth: "460px", margin: "60px auto", padding: "0 24px 60px" }}>
        {/* Header */}
        <div style={{ marginBottom: "32px" }}>
          <p style={{ fontSize: "0.68rem", fontWeight: 800, letterSpacing: "0.14em", textTransform: "uppercase", color: "var(--fg-faint)", marginBottom: "8px" }}>
            {step === "phone" ? "Step 1 of 2" : "Step 2 of 2"}
          </p>
          <h1 style={{ fontSize: "1.8rem", fontWeight: 900, letterSpacing: "-0.03em", textTransform: "uppercase", color: "var(--fg)", margin: 0, lineHeight: 1 }}>
            {step === "phone" ? "Sign In" : "Verify OTP"}
          </h1>
          <p style={{ fontSize: "0.82rem", color: "var(--fg-muted)", marginTop: "8px" }}>
            {step === "phone"
              ? "We'll send a one-time password to your phone."
              : <>Code sent to <strong style={{ color: "var(--fg)" }}>{phone}</strong></>
            }
          </p>
        </div>

        {/* Form card */}
        <div style={{ background: "var(--bg-white)", border: "1px solid var(--border-light)", padding: "32px" }}>

          {step === "phone" && (
            <div style={{ display: "flex", flexDirection: "column", gap: "16px" }}>
              <div>
                <label style={{ display: "block", fontSize: "0.68rem", fontWeight: 800, letterSpacing: "0.12em", textTransform: "uppercase", color: "var(--fg)", marginBottom: "8px" }}>
                  Phone Number
                </label>
                <div style={{ position: "relative" }}>
                  <span style={{ position: "absolute", left: "14px", top: "50%", transform: "translateY(-50%)", fontSize: "0.85rem" }}>🇮🇳</span>
                  <input
                    id="phone-input"
                    type="tel"
                    value={phone}
                    onChange={e => { setPhone(e.target.value); setError(""); }}
                    onKeyDown={e => e.key === "Enter" && handleSendOtp()}
                    placeholder="+91 98765 43210"
                    autoFocus
                    style={{ ...inputStyle, paddingLeft: "40px" }}
                  />
                </div>
              </div>

              {error && (
                <div style={{ background: "#fff0f0", border: "1px solid var(--red)", padding: "10px 14px", fontSize: "0.78rem", color: "var(--red)", display: "flex", gap: "8px" }}>
                  <span>⚠</span>{error}
                </div>
              )}

              <button id="send-otp-btn" onClick={handleSendOtp} disabled={loading} className="btn-primary" style={{ width: "100%", justifyContent: "center" }}>
                {loading ? (
                  <span style={{ display: "flex", alignItems: "center", gap: "8px" }}>
                    <span style={{ width: "14px", height: "14px", border: "2px solid rgba(0,0,0,0.2)", borderTopColor: "var(--fg)", borderRadius: "50%", animation: "spin 0.8s linear infinite", display: "inline-block" }} />
                    Sending…
                  </span>
                ) : "Send OTP →"}
              </button>
            </div>
          )}

          {step === "otp" && (
            <div style={{ display: "flex", flexDirection: "column", gap: "16px" }}>
              {devCode && (
                <div style={{ background: "#fffbea", border: "1px solid #d4a800", padding: "10px 14px", fontSize: "0.78rem", color: "#7a5c00" }}>
                  🔧 Dev mode — OTP is{" "}
                  <span onClick={() => setOtp(devCode)} style={{ fontFamily: "monospace", fontWeight: 800, cursor: "pointer", textDecoration: "underline" }}>
                    {devCode}
                  </span>{" "}(click to fill)
                </div>
              )}

              <div>
                <label style={{ display: "block", fontSize: "0.68rem", fontWeight: 800, letterSpacing: "0.12em", textTransform: "uppercase", color: "var(--fg)", marginBottom: "8px" }}>
                  6-Digit Code
                </label>
                <input
                  id="otp-input"
                  type="text"
                  inputMode="numeric"
                  maxLength={6}
                  value={otp}
                  onChange={e => { setOtp(e.target.value.replace(/\D/g, "")); setError(""); }}
                  onKeyDown={e => e.key === "Enter" && handleVerifyOtp()}
                  placeholder="• • • • • •"
                  autoFocus
                  style={{ ...inputStyle, textAlign: "center", fontSize: "1.4rem", fontWeight: 700, letterSpacing: "0.4em" }}
                />
                <p style={{ fontSize: "0.68rem", color: "var(--fg-faint)", marginTop: "6px", textAlign: "center" }}>Code expires in 10 minutes</p>
              </div>

              {error && (
                <div style={{ background: "#fff0f0", border: "1px solid var(--red)", padding: "10px 14px", fontSize: "0.78rem", color: "var(--red)", display: "flex", gap: "8px" }}>
                  <span>⚠</span>{error}
                </div>
              )}

              <button id="verify-otp-btn" onClick={handleVerifyOtp} disabled={loading || otp.length !== 6} className="btn-primary" style={{ width: "100%", justifyContent: "center" }}>
                {loading ? (
                  <span style={{ display: "flex", alignItems: "center", gap: "8px" }}>
                    <span style={{ width: "14px", height: "14px", border: "2px solid rgba(0,0,0,0.2)", borderTopColor: "var(--fg)", borderRadius: "50%", animation: "spin 0.8s linear infinite", display: "inline-block" }} />
                    Verifying…
                  </span>
                ) : "Verify & Sign In ✓"}
              </button>

              <button id="change-phone-btn" onClick={() => { setStep("phone"); setOtp(""); setError(""); setDevCode(null); }}
                style={{ background: "none", border: "none", fontSize: "0.75rem", color: "var(--fg-muted)", cursor: "pointer", letterSpacing: "0.06em", padding: "4px 0", textAlign: "center" }}>
                ← Change phone number
              </button>
            </div>
          )}
        </div>

        {/* Trust row */}
        <div style={{ marginTop: "20px", display: "flex", justifyContent: "center", gap: "20px" }}>
          {["🛡️ No password", "🔐 OTP secured", "🪪 KYC protected"].map(t => (
            <span key={t} style={{ fontSize: "0.68rem", color: "var(--fg-faint)", letterSpacing: "0.05em" }}>{t}</span>
          ))}
        </div>

        <div style={{ marginTop: "16px", textAlign: "center" }}>
          <Link to="/listings" style={{ fontSize: "0.72rem", color: "var(--fg-muted)", textDecoration: "underline", letterSpacing: "0.05em" }}>
            Browse without signing in →
          </Link>
        </div>
      </div>

      <style>{`@keyframes spin { to { transform: rotate(360deg); } }`}</style>
    </div>
  );
}