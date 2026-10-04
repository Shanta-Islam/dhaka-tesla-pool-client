import { useState } from "react";
import { useForm } from "react-hook-form";
import api from "./api/axios";
import useAuth from "./hooks/useAuth";
import PassengerDashboard from "./components/Dashboard/PassengerDashboard";
import DriverDashboard from "./components/Dashboard/DriverDashboard";
import jashimDriver from "./assets/driver.jpg";

/* ─── tiny helpers ─────────────────────────────────── */
const Logo = () => (
  <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
    <div style={{
      width: 34, height: 34, borderRadius: 8,
      background: "var(--green)", display: "flex",
      alignItems: "center", justifyContent: "center",
      flexShrink: 0,
    }}>
      <span style={{ fontWeight: 900, fontSize: 16, color: "#000", letterSpacing: -1 }}>P</span>
    </div>
    <span style={{ fontWeight: 800, fontSize: 17, letterSpacing: -0.5 }}>PoolDhaka</span>
    <span style={{ width: 6, height: 6, borderRadius: "50%", background: "var(--green)", marginLeft: 2 }} />
  </div>
);

const RouteStop = ({ letter, color, label, sublabel, position }) => (
  <div style={{ display: "flex", flexDirection: "column", alignItems: "center", gap: 6 }}>
    <div style={{
      width: 44, height: 44, borderRadius: 6,
      border: `1.5px solid ${color}`,
      display: "flex", alignItems: "center", justifyContent: "center",
    }}>
      {position === "pickup"
        ? <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth="2.5"><circle cx="12" cy="10" r="3"/><path d="M12 21C12 21 5 13.5 5 9a7 7 0 0114 0c0 4.5-7 12-7 12z"/></svg>
        : <span style={{ fontWeight: 700, fontSize: 14, color }}>{letter}</span>
      }
    </div>
    <div style={{ textAlign: "center" }}>
      <div style={{ fontSize: 9, color: "var(--text-dim)", textTransform: "uppercase", letterSpacing: 1, fontWeight: 600 }}>{label}</div>
      <div style={{ fontSize: 13, fontWeight: 700, color: "#fff", marginTop: 2 }}>{sublabel}</div>
    </div>
  </div>
);

/* ─── LEFT PANEL ─────────────────────────────────────── */
const LeftPanel = () => (
  <div style={{
    width: "55%", minHeight: "100vh",
    borderRight: "1px solid var(--border)",
    display: "flex", flexDirection: "column",
    position: "relative", overflow: "hidden",
  }} className="grid-bg">

    {/* Top bar */}
    <div style={{
      display: "flex", alignItems: "center", justifyContent: "space-between",
      padding: "20px 32px", borderBottom: "1px solid var(--border)",
    }}>
      <Logo />
      <div style={{
        border: "1px solid var(--border2)", borderRadius: 6,
        padding: "6px 14px", fontSize: 11, fontWeight: 600,
        letterSpacing: 1, color: "var(--text-muted)",
      }}>DHAKA / BANGLADESH</div>
    </div>

    {/* Hero content */}
    <div style={{ flex: 1, padding: "60px 48px", display: "flex", flexDirection: "column", justifyContent: "center" }}>
      <div style={{ fontSize: 11, fontWeight: 700, color: "var(--green)", letterSpacing: 2, textTransform: "uppercase", marginBottom: 20 }}>
        BETTER TOGETHER / 01
      </div>
      <h1 style={{ fontSize: 52, fontWeight: 900, lineHeight: 1.05, letterSpacing: -2, marginBottom: 24 }}>
        The city moves<br />
        <span style={{ color: "var(--green)" }}>better together.</span>
      </h1>
      <p style={{ fontSize: 14, color: "var(--text-muted)", lineHeight: 1.7, maxWidth: 340 }}>
        Anywhere in <span style={{ color: "#fff" }}>Dhaka</span> — from <span style={{ color: "#fff" }}>your doorstep</span> to <span style={{ color: "#fff" }}>your destination</span>. Share a seat, split the fare, and move smarter across the city.
      </p>

      {/* Route visualization */}
      <div style={{ marginTop: 64, display: "flex", alignItems: "flex-start", gap: 0 }}>
        <RouteStop letter="A" color="var(--green)" label="YOUR PICKUP" sublabel="Anywhere in Dhaka" position="pickup" />
        <div style={{
          flex: 1, height: 1.5, background: "var(--border2)",
          margin: "21px 0 0",
        }} />
        <RouteStop letter="→" color="#f97316" label="SHARED ROUTE" sublabel="City-wide coverage" />
        <div style={{
          flex: 1, height: 1.5, background: "var(--border2)",
          margin: "21px 0 0",
        }} />
        <RouteStop letter="B" color="var(--text-muted)" label="YOUR DESTINATION" sublabel="Any Dhaka address" />
      </div>
    </div>

    {/* Driver card at bottom */}
    <div style={{
      margin: "0 32px 32px",
      background: "rgba(255,255,255,0.04)",
      border: "1px solid var(--border2)",
      borderRadius: 10, padding: "14px 18px",
      display: "flex", alignItems: "center", gap: 14,
    }}>
      <img src={jashimDriver} alt="Driver" style={{
        width: 40, height: 40, borderRadius: "50%",
        objectFit: "cover", border: "2px solid var(--green)", flexShrink: 0,
      }} />
      <div style={{ flex: 1 }}>
        <div style={{ fontSize: 13, fontWeight: 700 }}>
          A driver is <span style={{ color: "var(--green)" }}>near you now</span>
        </div>
        <div style={{ fontSize: 11, color: "var(--text-muted)", marginTop: 2 }}>
          Seats available · Dhaka-wide coverage
        </div>
      </div>
      <div style={{ width: 8, height: 8, borderRadius: "50%", background: "var(--green)" }} className="pulse-dot" />
    </div>

    {/* Bottom breadcrumb */}
    <div style={{
      padding: "12px 32px", borderTop: "1px solid var(--border)",
      display: "flex", gap: 8, alignItems: "center",
      fontSize: 10, color: "var(--text-dim)", fontWeight: 600, letterSpacing: 1.5, textTransform: "uppercase",
    }}>
      <span>MIRPUR</span>
      <span style={{ color: "var(--green)" }}>→</span>
      <span>MOHAKHALI</span>
      <span style={{ color: "var(--green)" }}>→</span>
      <span>MOTIJHEEL</span>
      <span style={{ color: "var(--green)" }}>→</span>
      <span>DHANMONDI</span>
      <span style={{ color: "var(--green)" }}>→</span>
      <span>UTTARA</span>
    </div>
  </div>
);

/* ─── MAIN APP ─────────────────────────────────────── */
function App() {
  const [isLogin, setIsLogin] = useState(true);
  const [selectedRole, setSelectedRole] = useState("PASSENGER");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");

  const { user, setUser, loading: checkingAuth, logout } = useAuth();

  const { register, handleSubmit, reset, formState: { errors } } = useForm();

  /* ── login ── */
  const handleLogin = async (data) => {
    try {
      setLoading(true); setError(""); setSuccess("");
      const res = await api.post("/auth/login", { email: data.email, password: data.password });
      const token = res.data.token;
      if (!token) throw new Error("Token not received");
      localStorage.setItem("token", token);
      const meRes = await api.get("/auth/me", { headers: { Authorization: `Bearer ${token}` } });
      setUser(meRes.data.user || meRes.data);
      setSuccess("Login successful!");
      reset();
    } catch (e) {
      localStorage.removeItem("token");
      setUser(null);
      setError(e.response?.data?.message || e.message || "Login failed");
    } finally { setLoading(false); }
  };

  /* ── register ── */
  const handleRegister = async (data) => {
    try {
      setLoading(true); setError(""); setSuccess("");
      await api.post("/auth/register", {
        name: data.name, email: data.email,
        password: data.password, phone: data.phone, role: selectedRole,
      });
      setSuccess("Account created! Please log in.");
      setIsLogin(true);
      reset({ email: data.email, password: "" });
      setSelectedRole("PASSENGER");
    } catch (e) {
      setError(e.response?.data?.message || e.message || "Registration failed");
    } finally { setLoading(false); }
  };

  const handleLogout = () => { logout(); setIsLogin(true); setError(""); setSuccess(""); reset(); };

  /* ── auth loading ── */
  if (checkingAuth) return (
    <div style={{ minHeight: "100vh", display: "flex", alignItems: "center", justifyContent: "center", background: "var(--bg)" }}>
      <div style={{ textAlign: "center" }}>
        <div style={{ width: 36, height: 36, border: "3px solid var(--border2)", borderTop: "3px solid var(--green)", borderRadius: "50%", margin: "0 auto" }} className="spin" />
        <p style={{ marginTop: 16, color: "var(--text-muted)", fontSize: 13 }}>Checking session…</p>
      </div>
    </div>
  );

  /* ── dashboards ── */
  if (user?.role === "PASSENGER") return <PassengerDashboard user={user} onLogout={handleLogout} />;
  if (user?.role === "DRIVER") return <DriverDashboard user={user} onLogout={handleLogout} />;

  /* ── auth UI ── */
  return (
    <div style={{ display: "flex", minHeight: "100vh", background: "var(--bg)" }}>
      {/* Left */}
      <LeftPanel />

      {/* Right */}
      <div style={{
        flex: 1, display: "flex", flexDirection: "column",
        background: "var(--bg2)",
      }}>
        {/* Top right bar */}
        <div style={{
          padding: "20px 40px", borderBottom: "1px solid var(--border)",
          display: "flex", justifyContent: "flex-end", alignItems: "center",
        }}>
          <span style={{ fontSize: 11, fontWeight: 600, letterSpacing: 1.5, color: "var(--text-muted)", textTransform: "uppercase" }}>
            SHARED RIDES, DHAKA →
          </span>
        </div>

        {/* Form area */}
        <div style={{ flex: 1, display: "flex", alignItems: "center", justifyContent: "center", padding: "40px" }}>
          <div style={{ width: "100%", maxWidth: 400 }} className="fade-in">
            {/* Breadcrumb */}
            <div style={{ fontSize: 10, fontWeight: 700, color: "var(--green)", letterSpacing: 2, textTransform: "uppercase", marginBottom: 16 }}>
              POOLDHAKA / ACCOUNT
            </div>

            {/* Heading */}
            <h1 style={{ fontSize: 42, fontWeight: 900, letterSpacing: -1.5, lineHeight: 1.05, marginBottom: 8 }}>
              {isLogin ? "Welcome back" : "Create account"}
            </h1>
            <p style={{ fontSize: 14, color: "var(--text-muted)", marginBottom: 28 }}>
              {isLogin ? "Log in to continue your ride." : "Join in under a minute."}
            </p>

            {/* Role toggle (register only) */}
            {!isLogin && (
              <div style={{
                display: "flex", background: "#222", borderRadius: 8,
                padding: 4, marginBottom: 22, gap: 4,
              }}>
                {["PASSENGER", "DRIVER"].map(r => (
                  <button key={r} type="button" onClick={() => setSelectedRole(r)}
                    style={{
                      flex: 1, padding: "10px 0", borderRadius: 6, border: "none",
                      fontWeight: 700, fontSize: 13, cursor: "pointer",
                      transition: "all 0.2s",
                      background: selectedRole === r ? "var(--green)" : "transparent",
                      color: selectedRole === r ? "#000" : "var(--text-muted)",
                    }}>
                    {r.charAt(0) + r.slice(1).toLowerCase()}
                  </button>
                ))}
              </div>
            )}

            {/* Error / Success */}
            {error && (
              <div style={{ background: "rgba(239,68,68,0.1)", border: "1px solid rgba(239,68,68,0.3)", borderRadius: 8, padding: "10px 14px", marginBottom: 16, fontSize: 13, color: "#f87171" }}>
                {error}
              </div>
            )}
            {success && (
              <div style={{ background: "rgba(0,232,122,0.1)", border: "1px solid rgba(0,232,122,0.3)", borderRadius: 8, padding: "10px 14px", marginBottom: 16, fontSize: 13, color: "var(--green)" }}>
                {success}
              </div>
            )}

            {/* Form */}
            <form onSubmit={handleSubmit(isLogin ? handleLogin : handleRegister)}>

              {/* Name (register) */}
              {!isLogin && (
                <div style={{ marginBottom: 14 }}>
                  <label style={{ fontSize: 10, fontWeight: 700, color: "var(--text-muted)", letterSpacing: 1.5, textTransform: "uppercase", display: "block", marginBottom: 8 }}>
                    FULL NAME
                  </label>
                  <input
                    type="text" placeholder="Nusrat Jahan"
                    {...register("name", { required: "Name is required" })}
                    style={inputStyle(errors.name)}
                  />
                  {errors.name && <p style={errStyle}>{errors.name.message}</p>}
                </div>
              )}

              {/* Phone/Email */}
              <div style={{ marginBottom: 14 }}>
                <label style={{ fontSize: 10, fontWeight: 700, color: "var(--text-muted)", letterSpacing: 1.5, textTransform: "uppercase", display: "block", marginBottom: 8 }}>
                  {isLogin ? "PHONE OR EMAIL" : "PHONE"}
                </label>
                {isLogin ? (
                  <input
                    type="email" placeholder="01XXXXXXXXX"
                    {...register("email", {
                      required: "Email is required",
                      pattern: { value: /^[^\s@]+@[^\s@]+\.[^\s@]+$/, message: "Enter a valid email" },
                    })}
                    style={inputStyle(errors.email)}
                  />
                ) : (
                  <input
                    type="text" placeholder="01XXXXXXXXX"
                    {...register("phone", { required: "Phone is required" })}
                    style={inputStyle(errors.phone)}
                  />
                )}
                {(errors.email || errors.phone) && <p style={errStyle}>{errors.email?.message || errors.phone?.message}</p>}
              </div>

              {/* Email (register) */}
              {!isLogin && (
                <div style={{ marginBottom: 14 }}>
                  <label style={{ fontSize: 10, fontWeight: 700, color: "var(--text-muted)", letterSpacing: 1.5, textTransform: "uppercase", display: "block", marginBottom: 8 }}>
                    EMAIL
                  </label>
                  <input
                    type="email" placeholder="nusrat@example.com"
                    {...register("email", {
                      required: "Email is required",
                      pattern: { value: /^[^\s@]+@[^\s@]+\.[^\s@]+$/, message: "Enter a valid email" },
                    })}
                    style={inputStyle(errors.email)}
                  />
                  {errors.email && <p style={errStyle}>{errors.email.message}</p>}
                </div>
              )}

              {/* Password */}
              <div style={{ marginBottom: isLogin ? 4 : 14 }}>
                <label style={{ fontSize: 10, fontWeight: 700, color: "var(--text-muted)", letterSpacing: 1.5, textTransform: "uppercase", display: "block", marginBottom: 8 }}>
                  PASSWORD
                </label>
                <input
                  type="password" placeholder="••••••••"
                  {...register("password", {
                    required: "Password is required",
                    minLength: { value: 6, message: "Min 6 characters" },
                  })}
                  style={inputStyle(errors.password)}
                />
                {errors.password && <p style={errStyle}>{errors.password.message}</p>}
              </div>

              {isLogin && (
                <div style={{ textAlign: "right", marginBottom: 20 }}>
                  <button type="button" style={{ background: "none", border: "none", color: "var(--text-muted)", fontSize: 13, cursor: "pointer" }}>
                    Forgot password?
                  </button>
                </div>
              )}

              {/* Submit */}
              <button
                type="submit" disabled={loading}
                style={{
                  width: "100%", padding: "14px 0", borderRadius: 8,
                  background: "var(--green)", color: "#000",
                  fontWeight: 800, fontSize: 14, border: "none", cursor: loading ? "not-allowed" : "pointer",
                  opacity: loading ? 0.7 : 1, transition: "all 0.2s",
                  letterSpacing: 0.3, marginTop: isLogin ? 0 : 4,
                }}
              >
                {loading
                  ? (isLogin ? "Logging in…" : "Creating account…")
                  : isLogin ? "Log in" : `Create ${selectedRole.toLowerCase()} account`}
              </button>
            </form>

            {/* Switch */}
            <p style={{ textAlign: "center", marginTop: 22, fontSize: 14, color: "var(--text-muted)" }}>
              {isLogin ? "New to PoolDhaka? " : "Already have an account? "}
              <button
                type="button"
                onClick={() => { setIsLogin(!isLogin); setError(""); setSuccess(""); reset(); }}
                style={{ background: "none", border: "none", color: "var(--green)", fontWeight: 700, cursor: "pointer", textDecoration: "underline" }}
              >
                {isLogin ? "Create an account" : "Log in"}
              </button>
            </p>
          </div>
        </div>

        {/* Bottom breadcrumb */}
        <div style={{
          padding: "14px 40px", borderTop: "1px solid var(--border)",
          display: "flex", gap: 8, alignItems: "center",
          fontSize: 10, color: "var(--text-dim)", fontWeight: 600, letterSpacing: 1.5, textTransform: "uppercase",
        }}>
          <span>BANANI</span><span style={{ color: "var(--green)" }}>→</span>
          <span>MOHAKHALI</span><span style={{ color: "var(--green)" }}>→</span>
          <span>GULSHAN</span>
        </div>
      </div>
    </div>
  );
}

/* ── inline style helpers ── */
const inputStyle = (hasError) => ({
  width: "100%", padding: "13px 16px",
  background: "#1e1e1e", border: `1px solid ${hasError ? "rgba(239,68,68,0.5)" : "var(--border2)"}`,
  borderRadius: 8, color: "#fff", fontSize: 14, outline: "none",
  transition: "border-color 0.2s",
});

const errStyle = { fontSize: 11, color: "#f87171", marginTop: 5 };

export default App;