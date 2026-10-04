import { useEffect, useState, useCallback } from "react";
import api from "../../api/axios";

const authHeaders = () => ({
  Authorization: `Bearer ${localStorage.getItem("token")}`,
});

// Status badge helper
const StatusBadge = ({ status }) => {
  const map = {
    OPEN: "bg-teal-100 text-teal-700",
    FULL: "bg-orange-100 text-orange-700",
    CLOSED: "bg-stone-100 text-stone-600",
    IN_PROGRESS: "bg-amber-100 text-amber-700",
  };
  return (
    <span
      className={`text-[11px] font-bold px-3 py-1 rounded-full ${
        map[status] || "bg-stone-100 text-stone-600"
      }`}
    >
      {status}
    </span>
  );
};

// ─── ActivePoolView ───────────────────────────────────────────────────────────
const ActivePoolView = ({ pool, onRefresh }) => {
  const { vehicle, maxCapacity, occupiedSeats, status, members = [] } = pool;

  const isFull = occupiedSeats >= maxCapacity;

  return (
    <div className="space-y-5">
      {/* Pool Header Card */}
      <div className="bg-stone-900 text-white rounded-2xl p-5 shadow-sm">
        <div className="flex items-start justify-between mb-4">
          <div>
            <p className="text-[10px] font-bold text-stone-400 uppercase tracking-widest mb-1">
              Current Pool
            </p>
            <p className="text-xl font-black">
              {vehicle?.vehicleName || "Your Vehicle"}
            </p>
            <p className="text-xs text-stone-400 mt-0.5">
              {vehicle?.vehicleType} · {vehicle?.plateNumber}
            </p>
          </div>
          <StatusBadge status={status} />
        </div>

        {/* Seats visual */}
        <div className="flex gap-2 mb-4">
          {Array.from({ length: maxCapacity }).map((_, i) => (
            <div
              key={i}
              className={`flex-1 h-2 rounded-full transition ${
                i < occupiedSeats ? "bg-orange-400" : "bg-stone-700"
              }`}
            />
          ))}
        </div>

        <div className="grid grid-cols-3 gap-3">
          <div className="bg-stone-800 rounded-xl p-3 text-center">
            <p className="text-2xl font-black text-white">{occupiedSeats}</p>
            <p className="text-[10px] text-stone-400 mt-0.5">Booked</p>
          </div>
          <div className="bg-stone-800 rounded-xl p-3 text-center">
            <p className="text-2xl font-black text-white">{maxCapacity}</p>
            <p className="text-[10px] text-stone-400 mt-0.5">Total</p>
          </div>
          <div className="bg-stone-800 rounded-xl p-3 text-center">
            <p
              className={`text-2xl font-black ${
                isFull ? "text-orange-400" : "text-teal-400"
              }`}
            >
              {maxCapacity - occupiedSeats}
            </p>
            <p className="text-[10px] text-stone-400 mt-0.5">Open</p>
          </div>
        </div>
      </div>

      {/* Passengers */}
      <div className="bg-white rounded-2xl border border-stone-200 p-5 shadow-sm">
        <div className="flex items-center justify-between mb-4">
          <h3 className="text-base font-black text-stone-900">Passengers</h3>
          <button
            onClick={onRefresh}
            className="text-xs text-stone-400 hover:text-stone-700 font-semibold transition"
          >
            ↻ Refresh
          </button>
        </div>

        {members.length === 0 ? (
          <div className="text-center py-8">
            <p className="text-3xl mb-2">⏳</p>
            <p className="text-sm font-semibold text-stone-600">
              Waiting for passengers…
            </p>
            <p className="text-xs text-stone-400 mt-1">
              Your pool is OPEN. Passengers can join now.
            </p>
          </div>
        ) : (
          <div className="space-y-3">
            {members.map((m, idx) => {
              const passenger = m.passenger || m.user || m;
              const ride = m.ride || m;
              return (
                <div
                  key={m.id || idx}
                  className="flex items-center gap-4 p-4 bg-stone-50 rounded-xl border border-stone-100"
                >
                  {/* Avatar */}
                  <div className="w-10 h-10 rounded-full bg-amber-400 flex items-center justify-center text-sm font-black text-stone-900 flex-shrink-0">
                    {(passenger?.name || "?").charAt(0).toUpperCase()}
                  </div>

                  {/* Info */}
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-black text-stone-900">
                      {passenger?.name || "Passenger"}
                    </p>
                    <p className="text-xs text-stone-400 mt-0.5 truncate">
                      {ride?.pickupAddress || "—"} → {ride?.dropoffAddress || "—"}
                    </p>
                  </div>

                  {/* Fare */}
                  <div className="text-right flex-shrink-0">
                    <p className="text-sm font-black text-stone-900">
                      ৳{ride?.estimatedFare || "—"}
                    </p>
                    <p className="text-[10px] text-stone-400 mt-0.5">Fare</p>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>

      {/* Total earnings summary if passengers exist */}
      {members.length > 0 && (
        <div className="bg-amber-400 rounded-2xl p-4 flex items-center justify-between shadow-sm">
          <div>
            <p className="text-[10px] font-bold text-amber-900 uppercase tracking-widest">
              Total Pool Earnings
            </p>
            <p className="text-2xl font-black text-stone-900 mt-0.5">
              ৳
              {members.reduce((sum, m) => {
                const fare = Number((m.ride || m)?.estimatedFare || 0);
                return sum + fare;
              }, 0)}
            </p>
          </div>
          <p className="text-amber-800 text-sm font-bold">
            {members.length} / {maxCapacity} seats filled
          </p>
        </div>
      )}
    </div>
  );
};

// ─── Main ActivePool ──────────────────────────────────────────────────────────
const ActivePool = ({ initialPool }) => {
  const [pool, setPool] = useState(initialPool);
  const [loading, setLoading] = useState(false);

  const fetchPool = useCallback(async () => {
    if (!pool?.id) return;
    try {
      setLoading(true);
      const res = await api.get(`/pools/${pool.id}`, {
        headers: authHeaders(),
      });
      setPool(res.data.pool || res.data);
    } catch (err) {
      console.error("Refresh pool error:", err);
    } finally {
      setLoading(false);
    }
  }, [pool?.id]);

  // Auto-refresh every 15s when pool is OPEN or not FULL
  useEffect(() => {
    if (pool?.status === "FULL" || pool?.status === "CLOSED") return;
    const interval = setInterval(fetchPool, 15000);
    return () => clearInterval(interval);
  }, [fetchPool, pool?.status]);

  return (
    <div className="relative">
      {loading && (
        <div className="absolute top-0 right-0 p-2">
          <div className="w-4 h-4 border-2 border-stone-300 border-t-orange-400 rounded-full animate-spin" />
        </div>
      )}
      <ActivePoolView pool={pool} onRefresh={fetchPool} />
    </div>
  );
};

export default ActivePool;
