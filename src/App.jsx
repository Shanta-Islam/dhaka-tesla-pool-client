import { useState } from "react";
import { useForm } from "react-hook-form";
import api from "./api/axios";
import useAuth from "./hooks/useAuth";
import PassengerDashboard from "./components/Dashboard/PassengerDashboard";
import DriverDashboard from "./components/Dashboard/DriverDashboard";
import jashimDriver from "./assets/driver.jpg";
import "./App.css";

/* ─── Logo ─────────────────────────────────── */
const Logo = () => (
  <div className="logo">
    <div className="logo-icon">
      <span>P</span>
    </div>
    <span className="logo-name">PoolDhaka</span>
    <span className="logo-dot" />
  </div>
);

/* ─── RouteStop ─────────────────────────────── */
const RouteStop = ({ letter, color, label, sublabel, position }) => (
  <div className="route-stop">
    <div className="route-stop-icon" style={{ border: `1.5px solid ${color}` }}>
      {position === "pickup"
        ? (
          <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth="2.5">
            <circle cx="12" cy="10" r="3" />
            <path d="M12 21C12 21 5 13.5 5 9a7 7 0 0114 0c0 4.5-7 12-7 12z" />
          </svg>
        )
        : <span style={{ fontWeight: 700, fontSize: 14, color }}>{letter}</span>
      }
    </div>
    <div className="route-stop-label">
      <div className="route-stop-tag">{label}</div>
      <div className="route-stop-sublabel">{sublabel}</div>
    </div>
  </div>
);

/* ─── LEFT PANEL ────────────────────────────── */
const LeftPanel = () => (
  <div className="left-panel grid-bg">

    {/* Top bar */}
    <div className="left-topbar">
      <Logo />
      <div className="left-topbar-badge">DHAKA / BANGLADESH</div>
    </div>

    {/* Hero content */}
    <div className="left-hero">
      <div className="left-eyebrow">BETTER TOGETHER / 01</div>
      <h1 className="left-h1">
        The city moves<br />
        <span className="left-h1-accent">better together.</span>
      </h1>
      <p className="left-p">
        Anywhere in <span>Dhaka</span> — from <span>your doorstep</span> to{" "}
        <span>your destination</span>. Share a seat, split the fare, and move
        smarter across the city.
      </p>

      {/* Route visualization */}
      <div className="route-row">
        <RouteStop letter="A" color="var(--green)" label="YOUR PICKUP" sublabel="Anywhere in Dhaka" position="pickup" />
        <div className="route-line" />
        <RouteStop letter="→" color="#f97316" label="SHARED ROUTE" sublabel="City-wide coverage" />
        <div className="route-line" />
        <RouteStop letter="B" color="var(--text-muted)" label="YOUR DESTINATION" sublabel="Any Dhaka address" />
      </div>
    </div>

    {/* Driver card */}
    <div className="driver-card">
      <img src={jashimDriver} alt="Driver" className="driver-card-avatar" />
      <div className="driver-card-info">
        <div className="driver-card-title">
          A driver is <span>near you now</span>
        </div>
        <div className="driver-card-sub">Seats available · Dhaka-wide coverage</div>
      </div>
      <div className="pulse-dot" style={{ width: 8, height: 8, borderRadius: "50%", background: "var(--green)" }} />
    </div>

    {/* Bottom breadcrumb */}
    <div className="breadcrumb-bar">
      <span>MIRPUR</span><span className="arrow">→</span>
      <span>MOHAKHALI</span><span className="arrow">→</span>
      <span>MOTIJHEEL</span><span className="arrow">→</span>
      <span>DHANMONDI</span><span className="arrow">→</span>
      <span>UTTARA</span>
    </div>
  </div>
);

/* ─── MAIN APP ──────────────────────────────── */
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
    <div className="auth-loading">
      <div className="auth-loading-inner">
        <div className="auth-spinner spin" />
        <p className="auth-loading-text">Checking session…</p>
      </div>
    </div>
  );

  /* ── dashboards ── */
  if (user?.role === "PASSENGER") return <PassengerDashboard user={user} onLogout={handleLogout} />;
  if (user?.role === "DRIVER") return <DriverDashboard user={user} onLogout={handleLogout} />;

  /* ── auth UI ── */
  return (
    <div className="auth-wrapper">

      {/* Left panel — hidden on tablet/mobile */}
      <div className="auth-left-panel left-panel">
        <LeftPanel />
      </div>

      {/* Right panel */}
      <div className="right-panel auth-right-panel">

        {/* Top bar */}
        <div className="right-topbar">
          <div className="show-mobile">
            <Logo />
          </div>
          <span className="right-topbar-label">SHARED RIDES, DHAKA ↗</span>
        </div>

        {/* Form area */}
        <div className="auth-form-area">
          <div className="auth-form-inner">

            <div className="form-breadcrumb">POOLDHAKA / ACCOUNT</div>

            <h1 className="auth-heading">
              {isLogin ? "Welcome back" : "Create account"}
            </h1>
            <p className="form-sub">
              {isLogin ? "Log in to continue your ride." : "Join in under a minute."}
            </p>

            {/* Role toggle (register only) */}
            {!isLogin && (
              <div className="role-toggle">
                {["PASSENGER", "DRIVER"].map(r => (
                  <button
                    key={r}
                    type="button"
                    onClick={() => setSelectedRole(r)}
                    className={`role-btn${selectedRole === r ? " active" : ""}`}
                  >
                    {r.charAt(0) + r.slice(1).toLowerCase()}
                  </button>
                ))}
              </div>
            )}

            {/* Alerts */}
            {error && <div className="alert-error">{error}</div>}
            {success && <div className="alert-success">{success}</div>}

            {/* Form */}
            <form onSubmit={handleSubmit(isLogin ? handleLogin : handleRegister)}>

              {/* Name (register) */}
              {!isLogin && (
                <div className="field">
                  <label className="field-label">FULL NAME</label>
                  <input
                    type="text"
                    placeholder="Nusrat Jahan"
                    className={`field-input${errors.name ? " has-error" : ""}`}
                    {...register("name", { required: "Name is required" })}
                  />
                  {errors.name && <p className="field-err">{errors.name.message}</p>}
                </div>
              )}

              {/* Phone / Email */}
              <div className="field">
                <label className="field-label">
                  {isLogin ? "PHONE OR EMAIL" : "PHONE"}
                </label>
                {isLogin ? (
                  <input
                    type="email"
                    placeholder="01XXXXXXXXX"
                    className={`field-input${errors.email ? " has-error" : ""}`}
                    {...register("email", {
                      required: "Email is required",
                      pattern: { value: /^[^\s@]+@[^\s@]+\.[^\s@]+$/, message: "Enter a valid email" },
                    })}
                  />
                ) : (
                  <input
                    type="text"
                    placeholder="01XXXXXXXXX"
                    className={`field-input${errors.phone ? " has-error" : ""}`}
                    {...register("phone", { required: "Phone is required" })}
                  />
                )}
                {(errors.email || errors.phone) && (
                  <p className="field-err">{errors.email?.message || errors.phone?.message}</p>
                )}
              </div>

              {/* Email (register only) */}
              {!isLogin && (
                <div className="field">
                  <label className="field-label">EMAIL</label>
                  <input
                    type="email"
                    placeholder="nusrat@example.com"
                    className={`field-input${errors.email ? " has-error" : ""}`}
                    {...register("email", {
                      required: "Email is required",
                      pattern: { value: /^[^\s@]+@[^\s@]+\.[^\s@]+$/, message: "Enter a valid email" },
                    })}
                  />
                  {errors.email && <p className="field-err">{errors.email.message}</p>}
                </div>
              )}

              {/* Password */}
              <div className="field">
                <label className="field-label">PASSWORD</label>
                <input
                  type="password"
                  placeholder="••••••••"
                  className={`field-input${errors.password ? " has-error" : ""}`}
                  {...register("password", {
                    required: "Password is required",
                    minLength: { value: 6, message: "Min 6 characters" },
                  })}
                />
                {errors.password && <p className="field-err">{errors.password.message}</p>}
              </div>

              {isLogin && (
                <div className="forgot-row">
                  <button type="button" className="forgot-btn">Forgot password?</button>
                </div>
              )}

              <button type="submit" disabled={loading} className="submit-btn">
                {loading
                  ? (isLogin ? "Logging in…" : "Creating account…")
                  : isLogin ? "Log in" : `Create ${selectedRole.toLowerCase()} account`}
              </button>
            </form>

            {/* Switch */}
            <p className="switch-row">
              {isLogin ? "New to PoolDhaka? " : "Already have an account? "}
              <button
                type="button"
                className="switch-btn"
                onClick={() => { setIsLogin(!isLogin); setError(""); setSuccess(""); reset(); }}
              >
                {isLogin ? "Create an account" : "Log in"}
              </button>
            </p>
          </div>
        </div>

        {/* Bottom breadcrumb */}
        <div className="auth-breadcrumb-bar">
          <span>BANANI</span><span className="arrow">→</span>
          <span>MOHAKHALI</span><span className="arrow">→</span>
          <span>GULSHAN</span>
        </div>
      </div>
    </div>
  );
}

export default App;