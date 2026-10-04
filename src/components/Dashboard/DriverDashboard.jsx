import { useState, useEffect } from "react";
import { useForm } from "react-hook-form";
import { useQuery } from "@tanstack/react-query";
import Swal from "sweetalert2";
import useAxiosSecure from "../../hooks/useAxiosSecure";
import jashimDriver from "../../assets/driver.jpg";

/* ─── small reusable pieces ───────────────────────────── */
const Logo = ({ onLogout, user }) => {
  const [open, setOpen] = useState(false);
  return (
    <header style={{
      display: "flex", alignItems: "center", justifyContent: "space-between",
      padding: "0 32px", height: 56, borderBottom: "1px solid var(--border)",
      background: "var(--bg)", position: "sticky", top: 0, zIndex: 50,
    }}>
      <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
        <div style={{ width: 32, height: 32, borderRadius: 7, background: "var(--green)", display: "flex", alignItems: "center", justifyContent: "center" }}>
          <span style={{ fontWeight: 900, fontSize: 15, color: "#000" }}>P</span>
        </div>
        <span style={{ fontWeight: 800, fontSize: 16, letterSpacing: -0.5 }}>PoolDhaka</span>
        <span style={{ width: 5, height: 5, borderRadius: "50%", background: "var(--green)" }} />
      </div>

      <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
        <div style={{ border: "1px solid var(--border2)", borderRadius: 6, padding: "5px 12px", fontSize: 11, fontWeight: 700, color: "var(--text-muted)", letterSpacing: 0.5 }}>
          DRIVER
        </div>

        {/* Avatar dropdown */}
        <div style={{ position: "relative" }}>
          <button
            onClick={() => setOpen(o => !o)}
            style={{
              width: 34, height: 34, borderRadius: "50%",
              background: "var(--green)", border: "2px solid transparent",
              cursor: "pointer", fontWeight: 800, fontSize: 13, color: "#000",
              display: "flex", alignItems: "center", justifyContent: "center",
              transition: "border-color 0.15s",
            }}
          >
            {user?.name?.charAt(0)?.toUpperCase() || "D"}
          </button>
          {open && (
            <>
              {/* backdrop */}
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

const SectionLabel = ({ children }) => (
  <div style={{ fontSize: 10, fontWeight: 700, color: "var(--green)", letterSpacing: 2, textTransform: "uppercase", marginBottom: 8 }}>
    {children}
  </div>
);

const StatusBadge = ({ status }) => {
  const cfg = {
    COMPLETED: { color: "var(--green)", label: "COMPLETED" },
    CANCELLED: { color: "#ef4444", label: "CANCELLED" },
    MATCHED: { color: "#3b82f6", label: "MATCHED" },
    STARTED: { color: "#f97316", label: "STARTED" },
  };
  const c = cfg[status] || { color: "var(--text-muted)", label: status };
  return (
    <span style={{ fontSize: 10, fontWeight: 700, color: c.color, letterSpacing: 1 }}>{c.label}</span>
  );
};

/* ─── DRIVER DASHBOARD ────────────────────────────────── */
const DriverDashboard = ({ user, onLogout }) => {
  const axiosSecure = useAxiosSecure();
  const [view, setView] = useState("vehicles");
  const [selectedVehicle, setSelectedVehicle] = useState(null);

  const { register, handleSubmit, reset, formState: { errors } } = useForm();

  /* fetch vehicles */
  const { data: vehicles = [], isLoading, isError, error, refetch } = useQuery({
    queryKey: ["myVehicles"],
    queryFn: async () => {
      const r = await axiosSecure.get("/vehicles");
      return r.data.vehicles || [];
    },
  });

  /* fetch pool */
  const { data: currentPool, isLoading: poolLoading, refetch: refetchPool } = useQuery({
    queryKey: ["myPool"],
    queryFn: async () => {
      const r = await axiosSecure.get("/pools/my-pool");
      return r.data.pool;
    },
    retry: false,
  });

  const hasActivePool = currentPool && ["OPEN", "FULL", "IN_PROGRESS"].includes(currentPool.status);

  useEffect(() => {
    if (!poolLoading && currentPool && ["OPEN", "FULL", "IN_PROGRESS"].includes(currentPool.status) && view === "vehicles") {
      setView("currentPool");
    }
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [poolLoading, currentPool]);

  /* add vehicle */
  const handleAddVehicle = async (data) => {
    try {
      await axiosSecure.post("/vehicles", {
        vehicleName: data.vehicleName, vehicleType: data.vehicleType,
        plateNumber: data.plateNumber, capacity: Number(data.capacity),
      });
      await Swal.fire({ icon: "success", title: "Vehicle Added!", confirmButtonColor: "#00e87a" });
      reset(); await refetch(); setView("vehicles");
    } catch (e) {
      Swal.fire({ icon: "error", title: "Failed!", text: e.response?.data?.message || "Failed to add vehicle.", confirmButtonColor: "#00e87a" });
    }
  };

  /* delete vehicle */
  const handleDeleteVehicle = async (id) => {
    const r = await Swal.fire({ title: "Delete Vehicle?", icon: "warning", showCancelButton: true, confirmButtonColor: "#ef4444", cancelButtonColor: "#333", confirmButtonText: "Delete" });
    if (!r.isConfirmed) return;
    try {
      await axiosSecure.delete(`/vehicles/${id}`);
      await Swal.fire({ icon: "success", title: "Deleted!", confirmButtonColor: "#00e87a" });
      await refetch();
      if (selectedVehicle?.id === id) setSelectedVehicle(null);
    } catch (e) {
      Swal.fire({ icon: "error", title: "Failed!", text: e.response?.data?.message, confirmButtonColor: "#00e87a" });
    }
  };

  /* create pool */
  const handleCreatePool = async (e) => {
    e.preventDefault();
    if (!selectedVehicle) return;
    try {
      await axiosSecure.post("/pools", { vehicleId: selectedVehicle.id, maxCapacity: selectedVehicle.capacity });
      await refetchPool();
      await Swal.fire({ icon: "success", title: "Pool Created!", confirmButtonColor: "#00e87a" });
      setView("currentPool");
    } catch (e) {
      Swal.fire({ icon: "error", title: "Failed!", text: e.response?.data?.message, confirmButtonColor: "#00e87a" });
    }
  };

  const handleDriverArrived = async (rideId) => {
    try {
      await axiosSecure.patch("/rides/driver-arrived", { rideRequestId: rideId });
      await refetchPool();
      Swal.fire({ icon: "success", title: "Driver Arrived", confirmButtonColor: "#00e87a" });
    } catch (e) {
      Swal.fire({ icon: "error", title: "Failed!", text: e.response?.data?.message, confirmButtonColor: "#00e87a" });
    }
  };

  const handleStartRide = async (rideId) => {
    try {
      await axiosSecure.patch("/rides/start", { rideRequestId: rideId });
      await refetchPool();
      Swal.fire({ icon: "success", title: "Ride Started", confirmButtonColor: "#00e87a" });
    } catch (e) {
      Swal.fire({ icon: "error", title: "Failed!", text: e.response?.data?.message, confirmButtonColor: "#00e87a" });
    }
  };

  const handleCompleteRide = async (rideId) => {
    try {
      const res = await axiosSecure.patch("/rides/complete", { rideRequestId: rideId });
      await Swal.fire({ icon: "success", title: "Ride Completed", confirmButtonColor: "#00e87a" });
      await refetchPool();
      if (res.data.pool?.status === "COMPLETED") setView("vehicles");
    } catch (e) {
      Swal.fire({ icon: "error", title: "Failed!", text: e.response?.data?.message, confirmButtonColor: "#00e87a" });
    }
  };

  if (isLoading) return (
    <div style={{ minHeight: "100vh", display: "flex", alignItems: "center", justifyContent: "center", background: "var(--bg)" }}>
      <div style={{ width: 36, height: 36, border: "3px solid var(--border2)", borderTop: "3px solid var(--green)", borderRadius: "50%" }} className="spin" />
    </div>
  );

  if (isError) return (
    <div style={{ minHeight: "100vh", background: "var(--bg)", display: "flex", flexDirection: "column" }}>
      <Logo user={user} onLogout={onLogout} />
      <div style={{ padding: "40px 32px" }}>
        <div style={{ background: "rgba(239,68,68,0.1)", border: "1px solid rgba(239,68,68,0.3)", borderRadius: 10, padding: 24, maxWidth: 480 }}>
          <h3 style={{ color: "#f87171", fontWeight: 700 }}>Failed to load vehicles</h3>
          <p style={{ color: "var(--text-muted)", marginTop: 8, fontSize: 13 }}>{error?.response?.data?.message || "Something went wrong."}</p>
          <button onClick={() => refetch()} style={greenBtnStyle}>Try Again</button>
        </div>
      </div>
    </div>
  );

  /* recent rides (last few from pool members) */
  const recentRides = currentPool?.members?.flatMap(m => m.rideRequest ? [m.rideRequest] : []) || [];

  return (
    <div style={{ minHeight: "100vh", background: "var(--bg)", display: "flex", flexDirection: "column" }}>
      <Logo user={user} onLogout={onLogout} />

      {/* Body: 2-column */}
      <div style={{ flex: 1, display: "flex" }}>

        {/* Left main */}
        <div style={{ flex: 1, borderRight: "1px solid var(--border)", padding: "32px 40px", overflow: "auto" }} className="grid-bg">

          {/* Page header */}
          <div style={{ display: "flex", alignItems: "flex-start", justifyContent: "space-between", marginBottom: 40 }}>
            <div>
              <SectionLabel>DRIVER CONSOLE / DHAKA</SectionLabel>
              <h1 style={{ fontSize: 40, fontWeight: 900, letterSpacing: -1.5, lineHeight: 1 }}>Your vehicles</h1>
              <p style={{ color: "var(--text-muted)", marginTop: 8, fontSize: 13 }}>Manage your rides across the city.</p>
            </div>
            {hasActivePool && (
              <div style={{
                border: "1px solid var(--border2)", borderRadius: 8,
                padding: "6px 14px", fontSize: 12, fontWeight: 600,
                color: "var(--text-muted)", cursor: "pointer",
              }} onClick={() => setView("currentPool")}>
                {currentPool.status === "OPEN" ? "● Active pool" : `● ${currentPool.status}`}
              </div>
            )}
            {!hasActivePool && (
              <div style={{ border: "1px solid var(--border)", borderRadius: 8, padding: "6px 14px", fontSize: 12, color: "var(--text-dim)", fontWeight: 600 }}>
                No active pool
              </div>
            )}
          </div>

          {/* ─── VEHICLES VIEW ─── */}
          {view === "vehicles" && (
            <div className="fade-in">
              {vehicles.length === 0 ? (
                <div>
                  <button onClick={() => setView("addVehicle")} style={{
                    width: 52, height: 52, borderRadius: 10,
                    border: "1.5px solid var(--green)", background: "rgba(0,232,122,0.06)",
                    display: "flex", alignItems: "center", justifyContent: "center",
                    cursor: "pointer", marginBottom: 24,
                  }}>
                    <span style={{ fontSize: 24, color: "var(--green)", lineHeight: 1 }}>+</span>
                  </button>
                  <h2 style={{ fontSize: 22, fontWeight: 800, marginBottom: 8 }}>No vehicles yet</h2>
                  <p style={{ color: "var(--text-muted)", fontSize: 13, marginBottom: 24 }}>Add your vehicle to open a shared ride.</p>
                  <button onClick={() => setView("addVehicle")} style={greenBtnStyle}>+ Add vehicle</button>
                </div>
              ) : (
                <div>
                  <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(280px, 1fr))", gap: 16, marginBottom: 32 }}>
                    {vehicles.map(v => (
                      <div key={v.id} style={cardStyle}>
                        <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: 16 }}>
                          <div>
                            <div style={{ fontWeight: 800, fontSize: 16 }}>{v.vehicleName}</div>
                            <div style={{ fontSize: 12, color: "var(--text-muted)", marginTop: 2 }}>{v.vehicleType}</div>
                          </div>
                          <div style={{ fontSize: 11, fontWeight: 700, color: "var(--green)", border: "1px solid var(--green)", borderRadius: 5, padding: "3px 8px" }}>
                            {v.capacity} seats
                          </div>
                        </div>
                        <div style={{ fontSize: 12, color: "var(--text-dim)", marginBottom: 20 }}>
                          <span style={{ color: "var(--text-muted)" }}>Plate: </span>{v.plateNumber}
                        </div>
                        <div style={{ display: "flex", gap: 8 }}>
                          <button
                            disabled={hasActivePool}
                            onClick={() => { setSelectedVehicle(v); setView("createPool"); }}
                            style={{ ...greenBtnStyle, flex: 1, opacity: hasActivePool ? 0.4 : 1, cursor: hasActivePool ? "not-allowed" : "pointer" }}>
                            {hasActivePool ? "Pool Active" : "Create Pool"}
                          </button>
                          {!hasActivePool && (
                            <button onClick={() => handleDeleteVehicle(v.id)} style={ghostBtnStyle}>Delete</button>
                          )}
                        </div>
                      </div>
                    ))}
                    {/* Add vehicle card */}
                    <button onClick={() => setView("addVehicle")} style={{
                      ...cardStyle, border: "1.5px dashed var(--border2)",
                      display: "flex", flexDirection: "column", alignItems: "center",
                      justifyContent: "center", gap: 8, cursor: "pointer",
                      background: "transparent", minHeight: 160,
                    }}>
                      <span style={{ fontSize: 28, color: "var(--text-dim)" }}>+</span>
                      <span style={{ fontSize: 13, color: "var(--text-muted)", fontWeight: 600 }}>Add vehicle</span>
                    </button>
                  </div>
                </div>
              )}
            </div>
          )}

          {/* ─── ADD VEHICLE ─── */}
          {view === "addVehicle" && (
            <div className="fade-in" style={{ maxWidth: 480 }}>
              <button onClick={() => setView("vehicles")} style={backBtnStyle}>← Back to vehicles</button>
              <div style={cardStyle}>
                <h2 style={{ fontSize: 24, fontWeight: 800, marginBottom: 4 }}>Add Vehicle</h2>
                <p style={{ color: "var(--text-muted)", fontSize: 13, marginBottom: 28 }}>Add your vehicle before creating a pool.</p>
                <form onSubmit={handleSubmit(handleAddVehicle)} style={{ display: "flex", flexDirection: "column", gap: 18 }}>
                  {[
                    { name: "vehicleName", label: "VEHICLE NAME", ph: "Bullet" },
                    { name: "vehicleType", label: "VEHICLE TYPE", ph: "Battery-powered · 3 seats" },
                    { name: "plateNumber", label: "PLATE NUMBER", ph: "DHAKA-M-12-841" },
                  ].map(f => (
                    <div key={f.name}>
                      <label style={labelStyle}>{f.label}</label>
                      <input type="text" placeholder={f.ph}
                        {...register(f.name, { required: `${f.label} is required` })}
                        style={inputStyle(errors[f.name])} />
                      {errors[f.name] && <p style={errStyle}>{errors[f.name].message}</p>}
                    </div>
                  ))}
                  <div>
                    <label style={labelStyle}>CAPACITY (max 3)</label>
                    <input type="number" min="1" max="3" placeholder="3"
                      {...register("capacity", {
                        required: "Capacity is required", valueAsNumber: true,
                        min: { value: 1, message: "Min 1" }, max: { value: 3, message: "Max 3" },
                      })}
                      style={inputStyle(errors.capacity)} />
                    {errors.capacity && <p style={errStyle}>{errors.capacity.message}</p>}
                  </div>
                  <button type="submit" style={{ ...greenBtnStyle, marginTop: 8 }}>Add Vehicle</button>
                </form>
              </div>
            </div>
          )}

          {/* ─── CREATE POOL ─── */}
          {view === "createPool" && (
            <div className="fade-in" style={{ maxWidth: 480 }}>
              <button onClick={() => { setSelectedVehicle(null); setView("vehicles"); }} style={backBtnStyle}>← Back to vehicles</button>
              <div style={cardStyle}>
                <h2 style={{ fontSize: 24, fontWeight: 800, marginBottom: 4 }}>Create Pool</h2>
                <p style={{ color: "var(--text-muted)", fontSize: 13, marginBottom: 24 }}>Create a shared ride pool using your vehicle.</p>
                {selectedVehicle && (
                  <div style={{ background: "rgba(0,232,122,0.06)", border: "1px solid rgba(0,232,122,0.2)", borderRadius: 10, padding: 20, marginBottom: 24 }}>
                    <div style={{ fontWeight: 800, fontSize: 16, marginBottom: 4 }}>{selectedVehicle.vehicleName}</div>
                    <div style={{ fontSize: 13, color: "var(--text-muted)" }}>{selectedVehicle.vehicleType} · {selectedVehicle.plateNumber}</div>
                    <div style={{ marginTop: 14, display: "flex", gap: 12 }}>
                      <div style={{ flex: 1, background: "rgba(255,255,255,0.05)", borderRadius: 8, padding: 12 }}>
                        <div style={{ fontSize: 10, color: "var(--text-dim)", marginBottom: 4 }}>CAPACITY</div>
                        <div style={{ fontWeight: 700 }}>{selectedVehicle.capacity} seats</div>
                      </div>
                      <div style={{ flex: 1, background: "rgba(255,255,255,0.05)", borderRadius: 8, padding: 12 }}>
                        <div style={{ fontSize: 10, color: "var(--text-dim)", marginBottom: 4 }}>POOL SIZE</div>
                        <div style={{ fontWeight: 700 }}>{selectedVehicle.capacity} seats</div>
                      </div>
                    </div>
                  </div>
                )}
                <form onSubmit={handleCreatePool}>
                  <button type="submit" style={greenBtnStyle}>Open Pool →</button>
                </form>
              </div>
            </div>
          )}

          {/* ─── CURRENT POOL ─── */}
          {view === "currentPool" && (
            <div className="fade-in">
              {poolLoading ? (
                <div style={{ display: "flex", alignItems: "center", gap: 10, color: "var(--text-muted)" }}>
                  <div style={{ width: 20, height: 20, border: "2px solid var(--border2)", borderTop: "2px solid var(--green)", borderRadius: "50%" }} className="spin" />
                  Loading current pool…
                </div>
              ) : !currentPool ? (
                <div>
                  <h2 style={{ fontSize: 22, fontWeight: 800, marginBottom: 8 }}>No Active Pool</h2>
                  <p style={{ color: "var(--text-muted)", fontSize: 13, marginBottom: 20 }}>You don't have an active pool right now.</p>
                  <button onClick={() => setView("vehicles")} style={greenBtnStyle}>Go to Vehicles</button>
                </div>
              ) : (
                <div>
                  <div style={{ display: "flex", alignItems: "center", gap: 12, marginBottom: 32 }}>
                    <h2 style={{ fontSize: 30, fontWeight: 900 }}>Current Pool</h2>
                    <div style={{ fontSize: 11, fontWeight: 700, color: "var(--green)", border: "1px solid var(--green)", borderRadius: 20, padding: "4px 12px" }}>
                      {currentPool.status}
                    </div>
                  </div>

                  <div style={{ display: "grid", gridTemplateColumns: "repeat(3, 1fr)", gap: 12, marginBottom: 24 }}>
                    {[
                      { label: "Occupied Seats", value: currentPool.occupiedSeats },
                      { label: "Available Seats", value: currentPool.availableSeats },
                      { label: "Total Capacity", value: currentPool.maxCapacity },
                    ].map(s => (
                      <div key={s.label} style={cardStyle}>
                        <div style={{ fontSize: 10, color: "var(--text-muted)", marginBottom: 8, textTransform: "uppercase", letterSpacing: 1 }}>{s.label}</div>
                        <div style={{ fontSize: 32, fontWeight: 900, color: "var(--green)" }}>{s.value ?? "—"}</div>
                      </div>
                    ))}
                  </div>

                  {/* Vehicle info */}
                  <div style={{ ...cardStyle, marginBottom: 24 }}>
                    <div style={{ fontSize: 10, color: "var(--text-muted)", marginBottom: 12, textTransform: "uppercase", letterSpacing: 1 }}>Vehicle</div>
                    <div style={{ fontWeight: 700, marginBottom: 4 }}>{currentPool.vehicle?.vehicleName}</div>
                    <div style={{ fontSize: 13, color: "var(--text-muted)" }}>{currentPool.vehicle?.vehicleType} · {currentPool.vehicle?.plateNumber}</div>
                  </div>

                  {/* Passengers */}
                  <div style={{ ...cardStyle }}>
                    <div style={{ fontSize: 10, color: "var(--text-muted)", marginBottom: 16, textTransform: "uppercase", letterSpacing: 1 }}>
                      Passengers ({currentPool.members?.length || 0})
                    </div>
                    {!currentPool.members?.length ? (
                      <p style={{ color: "var(--text-dim)", fontSize: 13 }}>No passengers yet.</p>
                    ) : (
                      <div style={{ display: "flex", flexDirection: "column", gap: 16 }}>
                        {currentPool.members.map(m => (
                          <div key={m.id} style={{ background: "rgba(255,255,255,0.03)", border: "1px solid var(--border)", borderRadius: 10, padding: 16 }}>
                            <div style={{ display: "flex", justifyContent: "space-between", marginBottom: 12 }}>
                              <div>
                                <div style={{ fontWeight: 700 }}>{m.passenger?.name}</div>
                                <div style={{ fontSize: 12, color: "var(--text-muted)" }}>{m.passenger?.phone || "No phone"}</div>
                              </div>
                              <StatusBadge status={m.rideRequest?.status} />
                            </div>
                            <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 10, fontSize: 12, marginBottom: 14 }}>
                              <div><span style={{ color: "var(--text-dim)" }}>Pickup: </span>{m.rideRequest?.pickupAddress}</div>
                              <div><span style={{ color: "var(--text-dim)" }}>Drop-off: </span>{m.rideRequest?.dropoffAddress}</div>
                              <div><span style={{ color: "var(--text-dim)" }}>Seats: </span>{m.rideRequest?.seats}</div>
                              <div><span style={{ color: "var(--text-dim)" }}>Fare: </span><span style={{ color: "var(--green)", fontWeight: 700 }}>৳{m.fareAmount}</span></div>
                            </div>
                            {m.rideRequest?.status === "MATCHED" && (
                              <button onClick={() => handleDriverArrived(m.rideRequest.id)} style={greenBtnStyle}>🚗 Driver Arrived</button>
                            )}
                            {m.rideRequest?.status === "DRIVER_ARRIVED" && (
                              <button onClick={() => handleStartRide(m.rideRequest.id)} style={greenBtnStyle}>▶ Start Ride</button>
                            )}
                            {m.rideRequest?.status === "STARTED" && (
                              <button onClick={() => handleCompleteRide(m.rideRequest.id)} style={greenBtnStyle}>✓ Complete Ride</button>
                            )}
                            {m.rideRequest?.status === "COMPLETED" && (
                              <div style={{ padding: "8px 14px", background: "rgba(0,232,122,0.1)", borderRadius: 8, fontSize: 12, color: "var(--green)", fontWeight: 700 }}>
                                ✓ Ride Completed
                              </div>
                            )}
                          </div>
                        ))}
                      </div>
                    )}
                  </div>
                </div>
              )}
            </div>
          )}

          {/* ─── RECENT RIDES ─── */}
          {view === "vehicles" && (
            <div style={{ marginTop: 48 }}>
              <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 20 }}>
                <h3 style={{ fontSize: 18, fontWeight: 800 }}>Recent rides</h3>
                <span style={{ fontSize: 12, color: "var(--text-muted)" }}>Last 30 days</span>
              </div>
              <div style={{ display: "grid", gridTemplateColumns: "repeat(3, 1fr)", gap: 12 }}>
                {recentRides.length === 0 ? (
                  <div style={{ gridColumn: "1/-1", color: "var(--text-dim)", fontSize: 13 }}>No recent rides.</div>
                ) : recentRides.map(r => (
                  <div key={r.id} style={{ ...cardStyle }}>
                    <StatusBadge status={r.status} />
                    <div style={{ fontWeight: 700, marginTop: 8, fontSize: 14 }}>
                      {r.pickupAddress} → {r.dropoffAddress}
                    </div>
                    <div style={{ fontSize: 11, color: "var(--text-muted)", marginTop: 6 }}>
                      {new Date(r.createdAt).toLocaleDateString("en-BD", { day: "numeric", month: "short" })} · {new Date(r.createdAt).toLocaleTimeString("en-BD", { hour: "2-digit", minute: "2-digit" })}
                    </div>
                    {r.estimatedFare && (
                      <div style={{ fontWeight: 800, color: "var(--green)", marginTop: 10 }}>৳{r.estimatedFare}</div>
                    )}
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>

        {/* Right Sidebar */}
        <div style={{ width: 280, background: "var(--bg2)", padding: "32px 24px", display: "flex", flexDirection: "column", gap: 0 }}>
          {/* Driver Profile */}
          <div style={{ borderBottom: "1px solid var(--border)", paddingBottom: 24, marginBottom: 24 }}>
            <SectionLabel>DRIVER PROFILE</SectionLabel>
            <div style={{ display: "flex", alignItems: "center", gap: 12 }}>
              <img src={jashimDriver} alt={user?.name} style={{ width: 44, height: 44, borderRadius: 6, objectFit: "cover", flexShrink: 0 }} />
              <div>
                <div style={{ fontWeight: 800, fontSize: 16 }}>{user?.name || "Driver"}</div>
                <div style={{ fontSize: 12, color: "var(--green)", marginTop: 2 }}>PoolDhaka driver</div>
              </div>
            </div>
          </div>

          {/* Fleet Status */}
          <div style={{ borderBottom: "1px solid var(--border)", paddingBottom: 24, marginBottom: 24 }}>
            <SectionLabel>FLEET STATUS</SectionLabel>
            <div style={{ fontSize: 48, fontWeight: 900, color: "var(--green)", lineHeight: 1, marginBottom: 4 }}>
              {String(vehicles.length).padStart(2, "0")}
            </div>
            <div style={{ fontSize: 12, color: "var(--text-muted)" }}>registered vehicles</div>
          </div>

          {/* Current Route */}
          <div style={{ marginBottom: 24 }}>
            <SectionLabel>CURRENT ROUTE</SectionLabel>
            <div style={{ display: "flex", flexDirection: "column", gap: 12 }}>
              <div style={{ display: "flex", alignItems: "center", gap: 12 }}>
                <div style={{ width: 30, height: 30, borderRadius: 6, background: "rgba(0,232,122,0.15)", border: "1px solid var(--green)", display: "flex", alignItems: "center", justifyContent: "center", fontWeight: 800, color: "var(--green)", fontSize: 13 }}>A</div>
                <span style={{ fontSize: 13, color: "var(--text-muted)" }}>Awaiting a pool</span>
              </div>
              <div style={{ display: "flex", alignItems: "center", gap: 12 }}>
                <div style={{ width: 30, height: 30, borderRadius: 6, background: "rgba(255,255,255,0.06)", border: "1px solid var(--border2)", display: "flex", alignItems: "center", justifyContent: "center", fontWeight: 800, color: "var(--text-muted)", fontSize: 13 }}>B</div>
                <span style={{ fontSize: 13, color: "var(--text-muted)" }}>Choose your destination</span>
              </div>
            </div>
          </div>

          {/* Nav */}
          <div style={{ borderTop: "1px solid var(--border)", paddingTop: 20, marginTop: "auto", display: "flex", flexDirection: "column", gap: 4 }}>
            {[
              { label: "Vehicles", action: () => setView("vehicles"), active: view === "vehicles" },
              { label: "+ Add Vehicle", action: () => { reset(); setView("addVehicle"); }, active: view === "addVehicle" },
              { label: "Current Pool", action: () => setView("currentPool"), active: view === "currentPool" },
            ].map(n => (
              <button key={n.label} onClick={n.action} style={{
                background: n.active ? "rgba(0,232,122,0.1)" : "none",
                border: n.active ? "1px solid rgba(0,232,122,0.3)" : "1px solid transparent",
                borderRadius: 8, padding: "9px 14px", fontSize: 13,
                fontWeight: n.active ? 700 : 500, color: n.active ? "var(--green)" : "var(--text-muted)",
                cursor: "pointer", textAlign: "left", transition: "all 0.15s",
              }}>{n.label}</button>
            ))}
          </div>

          {/* Breadcrumb */}
          <div style={{ marginTop: 24, paddingTop: 16, borderTop: "1px solid var(--border)", display: "flex", gap: 6, fontSize: 10, color: "var(--text-dim)", fontWeight: 700, letterSpacing: 1.5, textTransform: "uppercase", flexWrap: "wrap" }}>
            <span>MIRPUR</span><span style={{ color: "var(--green)" }}>→</span>
            <span>DHANMONDI</span><span style={{ color: "var(--green)" }}>→</span>
            <span>MOTIJHEEL</span><span style={{ color: "var(--green)" }}>→</span>
            <span>UTTARA</span>
          </div>
        </div>
      </div>
    </div>
  );
};

/* ── style helpers ── */
const greenBtnStyle = {
  width: "100%", padding: "11px 0", borderRadius: 8,
  background: "var(--green)", color: "#000",
  fontWeight: 800, fontSize: 13, border: "none", cursor: "pointer",
  transition: "opacity 0.2s",
};

const ghostBtnStyle = {
  padding: "10px 16px", borderRadius: 8, border: "1px solid var(--border2)",
  background: "none", color: "var(--text-muted)", fontWeight: 600,
  fontSize: 13, cursor: "pointer",
};

const cardStyle = {
  background: "rgba(255,255,255,0.03)", border: "1px solid var(--border)",
  borderRadius: 12, padding: 20,
};

const labelStyle = {
  fontSize: 10, fontWeight: 700, color: "var(--text-muted)",
  letterSpacing: 1.5, textTransform: "uppercase", display: "block", marginBottom: 8,
};

const inputStyle = (hasErr) => ({
  width: "100%", padding: "12px 14px",
  background: "#1a1a1a", border: `1px solid ${hasErr ? "rgba(239,68,68,0.5)" : "var(--border2)"}`,
  borderRadius: 8, color: "#fff", fontSize: 14, outline: "none",
});

const errStyle = { fontSize: 11, color: "#f87171", marginTop: 5 };

const backBtnStyle = {
  background: "none", border: "none", color: "var(--text-muted)", fontSize: 13,
  fontWeight: 600, cursor: "pointer", marginBottom: 20, padding: 0,
};

export default DriverDashboard;
