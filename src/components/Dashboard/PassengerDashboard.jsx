import { useEffect, useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { useForm } from "react-hook-form";
import useAxiosSecure from "../../hooks/useAxiosSecure";
import jashimDriver from "../../assets/driver.jpg";
import Swal from "sweetalert2";

/* ── helpers ── */
const SectionLabel = ({ children }) => (
  <div style={{ fontSize: 10, fontWeight: 700, color: "var(--green)", letterSpacing: 2, textTransform: "uppercase", marginBottom: 8 }}>
    {children}
  </div>
);

const StatusTag = ({ status }) => {
  const cfg = {
    MATCHED: { bg: "rgba(59,130,246,0.15)", color: "#60a5fa" },
    DRIVER_ARRIVED: { bg: "rgba(249,115,22,0.15)", color: "#fb923c" },
    STARTED: { bg: "rgba(0,232,122,0.15)", color: "var(--green)" },
    COMPLETED: { bg: "rgba(0,232,122,0.1)", color: "var(--green)" },
    CANCELLED: { bg: "rgba(239,68,68,0.15)", color: "#f87171" },
    REQUESTED: { bg: "rgba(255,255,255,0.06)", color: "#888" },
  };
  const c = cfg[status] || cfg.REQUESTED;
  return (
    <span style={{ fontSize: 10, fontWeight: 800, background: c.bg, color: c.color, borderRadius: 20, padding: "3px 10px", letterSpacing: 1 }}>
      {status}
    </span>
  );
};

const LOCATIONS = [
  { label: "Banani Road 11", lat: 23.7938, lng: 90.4066 },
  { label: "Mohakhali", lat: 23.7751, lng: 90.4042 },
  { label: "Gulshan 1", lat: 23.7806, lng: 90.4169 },
  { label: "Gulshan 2", lat: 23.7938, lng: 90.4160 },
  { label: "Banani", lat: 23.7945, lng: 90.4055 },
  { label: "Baridhara", lat: 23.8028, lng: 90.4229 },
];

const FARE_PER_KM = 22;

/* ─── PASSENGER DASHBOARD ─────────────────────────────── */
const PassengerDashboard = ({ user, onLogout }) => {
  const axiosSecure = useAxiosSecure();
  const [view, setView] = useState("book");
  const [selectedPool, setSelectedPool] = useState(null);
  const [seats, setSeats] = useState(1);
  const [pickupIdx, setPickupIdx] = useState(0);
  const [dropIdx, setDropIdx] = useState(2);

  const { register, handleSubmit, reset, formState: { errors } } = useForm();

  /* fetch pools */
  const { data: pools = [], isLoading: poolsLoading, isError, error, refetch } = useQuery({
    queryKey: ["availablePools"],
    queryFn: async () => {
      const r = await axiosSecure.get("/pools");
      return r.data.pools || [];
    },
  });

  /* fetch rides */
  const { data: myRides = [], isLoading: ridesLoading, refetch: refetchRides } = useQuery({
    queryKey: ["myRides"],
    queryFn: async () => {
      const r = await axiosSecure.get("/rides/my-rides");
      return r.data.rides || [];
    },
    refetchInterval: 15000,
  });

  const activeRide = myRides.find(r => ["MATCHED", "DRIVER_ARRIVED", "STARTED"].includes(r.status));
  const recentRides = myRides.filter(r => ["COMPLETED", "CANCELLED"].includes(r.status)).slice(0, 3);

  useEffect(() => {
    if (ridesLoading) return;
    if (activeRide) setView("activeRide");
    else setView("book");
  }, [activeRide, ridesLoading]);

  /* fare estimate */
  const pickupLoc = LOCATIONS[pickupIdx];
  const dropLoc = LOCATIONS[dropIdx];
  const distKm = (() => {
    const R = 6371;
    const dLat = ((dropLoc.lat - pickupLoc.lat) * Math.PI) / 180;
    const dLng = ((dropLoc.lng - pickupLoc.lng) * Math.PI) / 180;
    const a = Math.sin(dLat/2)**2 + Math.cos(pickupLoc.lat*Math.PI/180)*Math.cos(dropLoc.lat*Math.PI/180)*Math.sin(dLng/2)**2;
    return (R * 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1-a))).toFixed(1);
  })();
  const fareEst = Math.round(distKm * FARE_PER_KM);
  const durationMin = Math.round(distKm * 2.4);

  /* submit ride */
  const handleRideSubmit = async () => {
    if (!selectedPool && pools.length > 0) {
      setSelectedPool(pools[0]);
    }
    const pool = selectedPool || pools[0];
    if (!pool) {
      Swal.fire({ icon: "warning", title: "No pool available", text: "No open pools found right now.", confirmButtonColor: "#00e87a" });
      return;
    }
    try {
      const rideRes = await axiosSecure.post("/rides", {
        pickupAddress: pickupLoc.label,
        pickupLat: pickupLoc.lat, pickupLng: pickupLoc.lng,
        dropoffAddress: dropLoc.label,
        dropoffLat: dropLoc.lat, dropoffLng: dropLoc.lng,
        seats, estimatedFare: fareEst,
      });
      await axiosSecure.post("/pools/join", {
        poolId: pool.id,
        rideRequestId: rideRes.data.ride.id,
      });
      await Swal.fire({ icon: "success", title: "Ride Confirmed!", text: "Your shared ride has been booked.", confirmButtonColor: "#00e87a" });
      refetchRides();
      setView("activeRide");
    } catch (e) {
      Swal.fire({ icon: "error", title: "Failed!", text: e.response?.data?.message || "Could not book ride.", confirmButtonColor: "#00e87a" });
    }
  };

  if (poolsLoading || ridesLoading) return (
    <div style={{ minHeight: "100vh", display: "flex", alignItems: "center", justifyContent: "center", background: "var(--bg)" }}>
      <div style={{ width: 36, height: 36, border: "3px solid var(--border2)", borderTop: "3px solid var(--green)", borderRadius: "50%" }} className="spin" />
    </div>
  );

  if (isError) return (
    <div style={{ minHeight: "100vh", background: "var(--bg)", display: "flex", flexDirection: "column" }}>
      <Header user={user} onLogout={onLogout} />
      <div style={{ padding: 40 }}>
        <div style={{ background: "rgba(239,68,68,0.1)", border: "1px solid rgba(239,68,68,0.3)", borderRadius: 10, padding: 24, maxWidth: 480 }}>
          <h3 style={{ color: "#f87171", fontWeight: 700 }}>Failed to load pools</h3>
          <p style={{ color: "var(--text-muted)", marginTop: 8, fontSize: 13 }}>{error?.response?.data?.message || "Something went wrong."}</p>
          <button onClick={() => refetch()} style={greenBtn}>Try Again</button>
        </div>
      </div>
    </div>
  );

  /* ── layout: left sidebar + main ── */
  return (
    <div style={{ minHeight: "100vh", background: "var(--bg)", display: "flex", flexDirection: "column" }}>
      <Header user={user} onLogout={onLogout} />

      <div style={{ flex: 1, display: "flex" }}>

        {/* LEFT SIDEBAR — booking form */}
        <div style={{
          width: 280, background: "var(--bg2)", borderRight: "1px solid var(--border)",
          display: "flex", flexDirection: "column", flexShrink: 0, overflow: "auto",
        }}>
      
          {/* Journey form */}
          <div style={{ padding: "20px 20px", flex: 1 }}>
            <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: 20 }}>
              <div>
                <SectionLabel>YOUR JOURNEY</SectionLabel>
                <h2 style={{ fontSize: 18, fontWeight: 800, lineHeight: 1.1 }}>Book a shared ride</h2>
              </div>
              <span style={{ fontSize: 18 }}>⇌</span>
            </div>

            {/* Pickup */}
            <div style={{ marginBottom: 12 }}>
              <label style={lblStyle}>PICKUP LOCATION</label>
              <div style={{ position: "relative" }}>
                <div style={{ position: "absolute", left: 12, top: "50%", transform: "translateY(-50%)", width: 18, height: 18, borderRadius: 5, background: "rgba(0,232,122,0.2)", border: "1.5px solid var(--green)", display: "flex", alignItems: "center", justifyContent: "center" }}>
                  <span style={{ fontSize: 8, fontWeight: 800, color: "var(--green)" }}>A</span>
                </div>
                <select value={pickupIdx} onChange={e => setPickupIdx(Number(e.target.value))} style={selectStyle}>
                  {LOCATIONS.map((l, i) => <option key={i} value={i}>{l.label}</option>)}
                </select>
              </div>
            </div>

            {/* Destination */}
            <div style={{ marginBottom: 20 }}>
              <label style={lblStyle}>DESTINATION</label>
              <div style={{ position: "relative" }}>
                <div style={{ position: "absolute", left: 12, top: "50%", transform: "translateY(-50%)", width: 18, height: 18, borderRadius: 5, background: "rgba(255,255,255,0.06)", border: "1.5px solid var(--border2)", display: "flex", alignItems: "center", justifyContent: "center" }}>
                  <span style={{ fontSize: 8, fontWeight: 800, color: "var(--text-muted)" }}>B</span>
                </div>
                <select value={dropIdx} onChange={e => setDropIdx(Number(e.target.value))} style={selectStyle}>
                  {LOCATIONS.map((l, i) => <option key={i} value={i}>{l.label}</option>)}
                </select>
              </div>
            </div>

            {/* Seats */}
            <div style={{ marginBottom: 20 }}>
              <label style={lblStyle}>SEATS</label>
              <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", background: "#1a1a1a", border: "1px solid var(--border2)", borderRadius: 8, padding: "10px 14px" }}>
                <span style={{ fontSize: 13, color: "var(--text-muted)" }}>{seats} rider{seats > 1 ? "s" : ""}</span>
                <div style={{ display: "flex", alignItems: "center", gap: 12 }}>
                  <button onClick={() => setSeats(s => Math.max(1, s - 1))} style={seatBtnStyle}>−</button>
                  <span style={{ fontSize: 16, fontWeight: 800, minWidth: 20, textAlign: "center" }}>{seats}</span>
                  <button onClick={() => setSeats(s => Math.min(3, s + 1))} style={seatBtnStyle}>+</button>
                </div>
              </div>
            </div>

            {/* Fare estimate */}
            <div style={{ background: "rgba(0,232,122,0.06)", border: "1px solid rgba(0,232,122,0.2)", borderRadius: 10, padding: 14, marginBottom: 18 }}>
              <div style={{ fontSize: 10, color: "var(--text-muted)", fontWeight: 700, letterSpacing: 1, marginBottom: 6 }}>FARE ESTIMATE</div>
              <div style={{ fontSize: 36, fontWeight: 900, color: "#fff" }}>৳{fareEst * seats}</div>
              <div style={{ fontSize: 12, color: "var(--text-muted)", marginTop: 2 }}>৳{fareEst} / seat · {durationMin} min · {distKm} km</div>
            </div>

            {/* Pool picker */}
            {pools.length > 0 && (
              <div style={{ marginBottom: 16 }}>
                <label style={lblStyle}>SELECT POOL</label>
                <div style={{ display: "flex", flexDirection: "column", gap: 6 }}>
                  {pools.slice(0, 3).map(p => (
                    <button key={p.id} onClick={() => setSelectedPool(p)} style={{
                      background: selectedPool?.id === p.id ? "rgba(0,232,122,0.1)" : "rgba(255,255,255,0.03)",
                      border: `1px solid ${selectedPool?.id === p.id ? "var(--green)" : "var(--border)"}`,
                      borderRadius: 8, padding: "10px 12px", textAlign: "left", cursor: "pointer",
                    }}>
                      <div style={{ fontSize: 12, fontWeight: 700, color: selectedPool?.id === p.id ? "var(--green)" : "#fff" }}>
                        {p.vehicle?.vehicleName || "Shared Vehicle"}
                      </div>
                      <div style={{ fontSize: 11, color: "var(--text-muted)", marginTop: 2 }}>
                        {p.availableSeats ?? p.maxCapacity} seats free · {p.vehicle?.plateNumber}
                      </div>
                    </button>
                  ))}
                </div>
              </div>
            )}

            {/* CTA */}
            <button onClick={handleRideSubmit} style={{
              width: "100%", padding: "13px 0", borderRadius: 8,
              background: "var(--green)", color: "#000", fontWeight: 800, fontSize: 13,
              border: "none", cursor: "pointer", letterSpacing: 0.5,
              display: "flex", alignItems: "center", justifyContent: "center", gap: 6,
            }}>
              CONFIRM SHARED RIDE ↗
            </button>
          </div>

          {/* Recent rides */}
          <div style={{ padding: "0 20px 20px" }}>
            <div style={{ borderTop: "1px solid var(--border)", paddingTop: 16, marginBottom: 12 }}>
              <div style={{ display: "flex", justifyContent: "space-between" }}>
                <span style={{ fontSize: 12, fontWeight: 700 }}>RECENT RIDES</span>
                <span style={{ fontSize: 10, color: "var(--text-muted)" }}>Last 30 days</span>
              </div>
            </div>
            {recentRides.length === 0 ? (
              <p style={{ fontSize: 12, color: "var(--text-dim)" }}>No recent rides.</p>
            ) : recentRides.map(r => (
              <div key={r.id} style={{ marginBottom: 10, paddingBottom: 10, borderBottom: "1px solid var(--border)" }}>
                <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                  <span style={{ fontSize: 12, fontWeight: 700 }}>{r.pickupAddress} → {r.dropoffAddress}</span>
                  {r.estimatedFare && <span style={{ fontSize: 12, fontWeight: 800, color: r.status === "CANCELLED" ? "var(--text-dim)" : "var(--green)" }}>
                    {r.status === "CANCELLED" ? "—" : `৳${r.estimatedFare}`}
                  </span>}
                </div>
                <div style={{ display: "flex", justifyContent: "space-between", marginTop: 4 }}>
                  <StatusTag status={r.status} />
                  <span style={{ fontSize: 11, color: "var(--text-dim)" }}>
                    {new Date(r.createdAt).toLocaleDateString("en-BD", { day: "numeric", month: "short" })} · {new Date(r.createdAt).toLocaleTimeString("en-BD", { hour: "2-digit", minute: "2-digit" })}
                  </span>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* MAIN AREA */}
        <div style={{ flex: 1, display: "flex", flexDirection: "column", overflow: "auto" }} className="grid-bg">

          {/* ─── BOOK VIEW: route visualization ─── */}
          {(view === "book" || view === "pools") && (
            <div style={{ flex: 1, display: "flex", flexDirection: "column" }}>
              {/* Top: Live ride badge or header */}
              <div style={{ padding: "28px 40px 0" }}>
                <SectionLabel>YOUR ROUTE</SectionLabel>
                <h2 style={{ fontSize: 28, fontWeight: 900, letterSpacing: -1, marginBottom: 4 }}>
                  {pickupLoc.label} → {dropLoc.label}
                </h2>
              </div>

              {/* Route diagram */}
              <div style={{ flex: 1, display: "flex", alignItems: "center", justifyContent: "center", padding: "40px" }}>
                <div style={{ width: "100%", maxWidth: 640 }}>
                  {/* Route stops */}
                  <div style={{ display: "flex", alignItems: "center", marginBottom: 60 }}>
                    <RouteStop letter="A" color="var(--green)" label="PICKUP" sublabel={pickupLoc.label} />
                    <div style={{ flex: 1, height: 1.5, background: "var(--border2)", margin: "0 0 24px" }} />
                    <RouteStop letter="M" color="#f97316" label="VIA" sublabel="Mohakhali" />
                    <div style={{ flex: 1, height: 1.5, background: "var(--border2)", margin: "0 0 24px" }} />
                    <RouteStop letter="B" color="var(--text-muted)" label="DROP-OFF" sublabel={dropLoc.label} />
                  </div>

                  {/* Stats */}
                  <div style={{ display: "flex", gap: 1, borderTop: "1px solid var(--border)" }}>
                    {[
                      { value: durationMin, label: "MINUTES" },
                      { value: distKm, label: "KILOMETRES" },
                      { value: pools.length, label: "POOLS OPEN" },
                    ].map((s, i) => (
                      <div key={i} style={{ flex: 1, padding: "24px 0", borderRight: i < 2 ? "1px solid var(--border)" : "none", textAlign: i === 0 ? "left" : i === 2 ? "right" : "center" }}>
                        <div style={{ fontSize: 40, fontWeight: 900, letterSpacing: -1, lineHeight: 1 }}>{s.value}</div>
                        <div style={{ fontSize: 10, color: "var(--text-muted)", fontWeight: 700, letterSpacing: 2, marginTop: 4 }}>{s.label}</div>
                      </div>
                    ))}
                  </div>
                </div>
              </div>

              {/* Pool list */}
              {pools.length > 0 && (
                <div style={{ padding: "0 40px 32px" }}>
                  <SectionLabel>YOUR POOL</SectionLabel>
                  <div style={{ display: "flex", flexDirection: "column", gap: 10 }}>
                    {pools.map(p => {
                      const members = p.members || [];
                      const occupiedSeats = members.reduce((a, m) => a + (m.rideRequest?.seats || 0), 0);
                      const totalSeats = p.maxCapacity || 3;
                      return (
                        <div key={p.id} style={{ background: "rgba(255,255,255,0.03)", border: `1px solid ${selectedPool?.id === p.id ? "var(--green)" : "var(--border)"}`, borderRadius: 12, padding: "16px 20px" }}>
                          <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between" }}>
                            <div style={{ display: "flex", alignItems: "center", gap: 12 }}>
                              <img src={jashimDriver} alt="" style={{ width: 36, height: 36, borderRadius: 6, objectFit: "cover" }} />
                              <div>
                                <div style={{ fontWeight: 700, fontSize: 14 }}>{p.driver?.name || "Driver"}</div>
                                <div style={{ fontSize: 11, color: "var(--text-muted)", marginTop: 2 }}>
                                  {p.vehicle?.vehicleName} · {p.vehicle?.plateNumber}
                                </div>
                                <div style={{ fontSize: 11, color: "var(--text-dim)", marginTop: 1 }}>
                                  {p.vehicle?.vehicleType}
                                </div>
                              </div>
                            </div>
                            <div style={{ display: "flex", gap: 6, alignItems: "center" }}>
                              {members.map((m, i) => (
                                <div key={i} style={{ fontSize: 11, fontWeight: 700, background: "rgba(0,232,122,0.15)", color: "var(--green)", borderRadius: 20, padding: "3px 10px" }}>
                                  {m.passenger?.name?.split(" ")[0] || "Passenger"} {i === 0 && members.length > 1 ? "· You" : "· Matched"}
                                </div>
                              ))}
                              {[...Array(Math.max(0, totalSeats - members.length))].map((_, i) => (
                                <div key={`empty-${i}`} style={{ fontSize: 11, fontWeight: 700, background: "rgba(255,255,255,0.05)", color: "var(--text-dim)", borderRadius: 20, padding: "3px 10px" }}>
                                  Seat {members.length + i + 1} · Open
                                </div>
                              ))}
                              <div style={{ fontSize: 11, color: "var(--text-muted)", marginLeft: 6 }}>
                                {occupiedSeats}/{totalSeats} seats matched
                              </div>
                            </div>
                          </div>
                        </div>
                      );
                    })}
                  </div>
                </div>
              )}
            </div>
          )}

          {/* ─── ACTIVE RIDE VIEW ─── */}
          {view === "activeRide" && activeRide && (
            <div style={{ padding: "28px 40px" }} className="fade-in">
              <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: 8 }}>
                <div>
                  <div style={{ fontSize: 10, fontWeight: 700, color: "var(--green)", letterSpacing: 2, textTransform: "uppercase", marginBottom: 6 }}>
                    LIVE RIDE / {activeRide.id?.slice(0, 5).toUpperCase()}
                  </div>
                  <h2 style={{ fontSize: 28, fontWeight: 900, letterSpacing: -1 }}>Your route</h2>
                  <div style={{ fontSize: 14, color: "var(--text-muted)", marginTop: 4 }}>
                    {activeRide.pickupAddress} → {activeRide.dropoffAddress}
                  </div>
                </div>
              </div>

              {/* Status banner */}
              <div style={{
                display: "inline-flex", alignItems: "center", gap: 8,
                background: "rgba(0,232,122,0.1)", border: "1px solid rgba(0,232,122,0.3)",
                borderRadius: 20, padding: "6px 16px", marginBottom: 40, fontSize: 13, fontWeight: 600, color: "var(--green)",
              }}>
                <span style={{ width: 7, height: 7, borderRadius: "50%", background: "var(--green)" }} className="pulse-dot" />
                {activeRide.status === "MATCHED" && "Driver matched · ETA 4 min"}
                {activeRide.status === "DRIVER_ARRIVED" && "Driver arrived · ETA 4 min"}
                {activeRide.status === "STARTED" && "Ride in progress"}
              </div>

              {/* Route diagram */}
              <div style={{ display: "flex", alignItems: "center", marginBottom: 0, maxWidth: 600 }}>
                <RouteStop letter="A" color="var(--green)" label="PICKUP" sublabel={activeRide.pickupAddress} />
                <div style={{ flex: 1, height: 1.5, background: "var(--green)", margin: "0 0 24px", opacity: 0.4 }} />
                <RouteStop letter="M" color="#f97316" label="VIA" sublabel="Mohakhali" />
                <div style={{ flex: 1, height: 1.5, background: "var(--border2)", margin: "0 0 24px" }} />
                <RouteStop letter="B" color="var(--text-muted)" label="DROP-OFF" sublabel={activeRide.dropoffAddress} />
              </div>

              {/* Stats */}
              <div style={{ display: "flex", gap: 1, borderTop: "1px solid var(--border)", marginBottom: 40, maxWidth: 600 }}>
                {[
                  { value: "18", label: "MINUTES" },
                  { value: "7.4", label: "KILOMETRES" },
                  { value: "3", label: "STOPS" },
                ].map((s, i) => (
                  <div key={i} style={{ flex: 1, padding: "20px 0", borderRight: i < 2 ? "1px solid var(--border)" : "none", textAlign: i === 0 ? "left" : i === 2 ? "right" : "center" }}>
                    <div style={{ fontSize: 36, fontWeight: 900, lineHeight: 1 }}>{s.value}</div>
                    <div style={{ fontSize: 10, color: "var(--text-muted)", fontWeight: 700, letterSpacing: 2, marginTop: 4 }}>{s.label}</div>
                  </div>
                ))}
              </div>

              {/* Pool info */}
              {activeRide.pool && (
                <div>
                  <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 12 }}>
                    <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
                      <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" style={{ color: "var(--text-muted)" }}><path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2"/><circle cx="9" cy="7" r="4"/><path d="M23 21v-2a4 4 0 0 0-3-3.87"/><path d="M16 3.13a4 4 0 0 1 0 7.75"/></svg>
                      <span style={{ fontSize: 14, fontWeight: 700 }}>Your pool</span>
                    </div>
                    <span style={{ fontSize: 12, color: "var(--green)", fontWeight: 700 }}>
                      {activeRide.pool.members?.length || 0}/{activeRide.pool.maxCapacity} seats matched
                    </span>
                  </div>
                  <div style={{ background: "rgba(255,255,255,0.03)", border: "1px solid var(--border)", borderRadius: 12, padding: "16px 20px" }}>
                    <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between" }}>
                      <div style={{ display: "flex", alignItems: "center", gap: 12 }}>
                        <img src={jashimDriver} alt="" style={{ width: 40, height: 40, borderRadius: 6, objectFit: "cover" }} />
                        <div>
                          <div style={{ fontWeight: 700, display: "flex", alignItems: "center", gap: 6 }}>
                            {activeRide.pool.driver?.name || "Driver"}
                            <span style={{ fontSize: 12, color: "#f59e0b" }}>★ 4.9</span>
                          </div>
                          <div style={{ fontSize: 11, color: "var(--text-muted)", marginTop: 2 }}>
                            {activeRide.pool.vehicle?.vehicleType} · {activeRide.pool.vehicle?.plateNumber}
                          </div>
                          <div style={{ fontSize: 11, color: "var(--text-dim)", marginTop: 1 }}>
                            Battery-powered · {activeRide.pool.maxCapacity} seats
                          </div>
                        </div>
                      </div>
                      <div style={{ display: "flex", gap: 6, flexWrap: "wrap", maxWidth: 260 }}>
                        {(activeRide.pool.members || []).map((m, i) => (
                          <div key={i} style={{ fontSize: 11, fontWeight: 700, background: i === 0 ? "rgba(0,232,122,0.15)" : "rgba(255,255,255,0.06)", color: i === 0 ? "var(--green)" : "var(--text-muted)", borderRadius: 20, padding: "4px 12px" }}>
                            {m.passenger?.name?.split(" ")[0] || "Passenger"}{i === 0 ? " · You" : " · Matched"}
                          </div>
                        ))}
                        {[...Array(Math.max(0, (activeRide.pool.maxCapacity || 3) - (activeRide.pool.members?.length || 0)))].map((_, i) => (
                          <div key={`open-${i}`} style={{ fontSize: 11, fontWeight: 700, background: "rgba(255,255,255,0.04)", color: "var(--text-dim)", borderRadius: 20, padding: "4px 12px" }}>
                            Seat {(activeRide.pool.members?.length || 0) + i + 1} · Open
                          </div>
                        ))}
                      </div>
                    </div>
                  </div>
                </div>
              )}

              {/* Fare info */}
              <div style={{ marginTop: 24, display: "grid", gridTemplateColumns: "repeat(3, 1fr)", gap: 12, maxWidth: 600 }}>
                {[
                  { label: "FARE", value: `৳${activeRide.estimatedFare}` },
                  { label: "SEATS", value: activeRide.seats },
                  { label: "STATUS", value: activeRide.status },
                ].map(s => (
                  <div key={s.label} style={{ background: "rgba(255,255,255,0.03)", border: "1px solid var(--border)", borderRadius: 10, padding: 16 }}>
                    <div style={{ fontSize: 10, color: "var(--text-muted)", fontWeight: 700, letterSpacing: 1, marginBottom: 6 }}>{s.label}</div>
                    <div style={{ fontWeight: 800, fontSize: 16, color: s.label === "STATUS" ? "var(--green)" : "#fff" }}>{s.value}</div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Bottom breadcrumb */}
          <div style={{
            padding: "12px 40px", borderTop: "1px solid var(--border)",
            display: "flex", gap: 8, alignItems: "center",
            fontSize: 10, color: "var(--text-dim)", fontWeight: 600, letterSpacing: 1.5, textTransform: "uppercase",
            marginTop: "auto",
          }}>
            <span>DHANMONDI</span><span style={{ color: "var(--green)" }}>→</span>
            <span>FARMGATE</span><span style={{ color: "var(--green)" }}>→</span>
            <span>TEJGAON</span><span style={{ color: "var(--green)" }}>→</span>
            <span>RAMPURA</span><span style={{ color: "var(--green)" }}>→</span>
            <span>BADDA</span>
          </div>
        </div>
      </div>
    </div>
  );
};

/* ── sub components ── */
const Header = ({ user, onLogout }) => {
  const [open, setOpen] = useState(false);
  return (
    <header style={{
      display: "flex", alignItems: "center", justifyContent: "space-between",
      padding: "0 32px", height: 56, borderBottom: "1px solid var(--border)",
      background: "var(--bg)", flexShrink: 0,
    }}>
      <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
        <div style={{ width: 32, height: 32, borderRadius: 7, background: "var(--green)", display: "flex", alignItems: "center", justifyContent: "center" }}>
          <span style={{ fontWeight: 900, fontSize: 15, color: "#000" }}>P</span>
        </div>
        <span style={{ fontWeight: 800, fontSize: 16, letterSpacing: -0.5 }}>PoolDhaka</span>
        <span style={{ width: 5, height: 5, borderRadius: "50%", background: "var(--green)" }} />
      </div>

      <div style={{ display: "flex", gap: 10, alignItems: "center" }}>
        <div style={{ border: "1px solid var(--border2)", borderRadius: 6, padding: "5px 12px", fontSize: 11, fontWeight: 700, color: "var(--text-muted)", letterSpacing: 0.5 }}>
          PASSENGER
        </div>

        {/* Avatar dropdown */}
        <div style={{ position: "relative" }}>
          <button
            onClick={() => setOpen(o => !o)}
            style={{
              width: 34, height: 34, borderRadius: "50%",
              background: "#333", border: "2px solid transparent",
              cursor: "pointer", fontWeight: 800, fontSize: 13, color: "#fff",
              display: "flex", alignItems: "center", justifyContent: "center",
              transition: "border-color 0.15s",
            }}
          >
            {user?.name?.charAt(0)?.toUpperCase() || "P"}
          </button>
          {open && (
            <>
              <div onClick={() => setOpen(false)} style={{ position: "fixed", inset: 0, zIndex: 99 }} />
              <div style={{
                position: "absolute", right: 0, top: 42,
                background: "#1e1e1e", border: "1px solid var(--border2)",
                borderRadius: 10, padding: 4, minWidth: 160, zIndex: 100,
                boxShadow: "0 12px 32px rgba(0,0,0,0.6)",
              }}>
                <div style={{ padding: "10px 12px 8px", borderBottom: "1px solid var(--border)", marginBottom: 4 }}>
                  <div style={{ fontSize: 13, fontWeight: 700 }}>{user?.name}</div>
                  <div style={{ fontSize: 11, color: "var(--text-muted)", marginTop: 2 }}>{user?.email}</div>
                </div>
                <button
                  onClick={() => { setOpen(false); onLogout(); }}
                  style={{
                    width: "100%", padding: "9px 12px", background: "none",
                    border: "none", color: "#f87171", fontSize: 13, fontWeight: 600,
                    textAlign: "left", cursor: "pointer", borderRadius: 6,
                  }}
                >
                  Log out
                </button>
              </div>
            </>
          )}
        </div>
      </div>
    </header>
  );
};

const RouteStop = ({ letter, color, label, sublabel }) => (
  <div style={{ display: "flex", flexDirection: "column", alignItems: "center", gap: 6, minWidth: 90 }}>
    <div style={{ width: 48, height: 48, borderRadius: 8, border: `1.5px solid ${color}`, display: "flex", alignItems: "center", justifyContent: "center", background: `${color}18` }}>
      <span style={{ fontWeight: 800, fontSize: 16, color }}>{letter}</span>
    </div>
    <div style={{ textAlign: "center" }}>
      <div style={{ fontSize: 9, color: "var(--text-dim)", textTransform: "uppercase", letterSpacing: 1, fontWeight: 600 }}>{label}</div>
      <div style={{ fontSize: 13, fontWeight: 700, marginTop: 2 }}>{sublabel}</div>
    </div>
  </div>
);

/* ── style constants ── */
const greenBtn = {
  width: "100%", padding: "11px 0", borderRadius: 8,
  background: "var(--green)", color: "#000", fontWeight: 800,
  fontSize: 13, border: "none", cursor: "pointer", marginTop: 12,
};

const lblStyle = {
  fontSize: 10, fontWeight: 700, color: "var(--text-muted)", letterSpacing: 1.5,
  textTransform: "uppercase", display: "block", marginBottom: 6,
};

const selectStyle = {
  width: "100%", padding: "10px 14px 10px 38px",
  background: "#1a1a1a", border: "1px solid var(--border2)",
  borderRadius: 8, color: "#fff", fontSize: 13, outline: "none",
  appearance: "none",
};

const seatBtnStyle = {
  width: 26, height: 26, borderRadius: 6, background: "rgba(255,255,255,0.08)",
  border: "1px solid var(--border2)", color: "#fff", fontSize: 16,
  cursor: "pointer", display: "flex", alignItems: "center", justifyContent: "center",
  lineHeight: 1,
};

export default PassengerDashboard;
