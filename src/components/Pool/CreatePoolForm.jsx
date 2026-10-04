import { useState } from "react";
import api from "../../api/axios";

const authHeaders = () => ({
  Authorization: `Bearer ${localStorage.getItem("token")}`,
});

// ─── CreatePoolForm ───────────────────────────────────────────────────────────
const CreatePoolForm = ({ vehicle, onSuccess, onBack }) => {
  const [maxSeats, setMaxSeats] = useState(vehicle.capacity || 3);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const handleCreate = async () => {
    try {
      setLoading(true);
      setError("");
      const res = await api.post(
        "/pools",
        {
          vehicleId: vehicle.id,
          maxCapacity: Number(maxSeats),
        },
        { headers: authHeaders() }
      );
      onSuccess(res.data.pool || res.data);
    } catch (err) {
      setError(err.response?.data?.message || "Failed to create pool");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="bg-white rounded-2xl border border-stone-200 p-6 shadow-sm max-w-md w-full">
      <button
        onClick={onBack}
        className="text-xs text-stone-400 hover:text-stone-700 font-semibold mb-4 flex items-center gap-1 transition"
      >
        ← Back
      </button>

      <h3 className="text-xl font-black text-stone-900 mb-1">Create Pool</h3>
      <p className="text-xs text-stone-400 mb-6">
        Set up your shared ride pool for passengers.
      </p>

      {error && (
        <div className="mb-4 rounded-xl bg-red-50 border border-red-200 px-4 py-3">
          <p className="text-sm text-red-600">{error}</p>
        </div>
      )}

      {/* Selected Vehicle */}
      <div className="mb-5">
        <p className="text-[10px] font-bold text-stone-400 uppercase tracking-widest mb-2">
          Vehicle
        </p>
        <div className="flex items-center gap-3 bg-stone-50 border border-stone-200 rounded-xl px-4 py-3">
          <span className="text-xl">🚗</span>
          <div className="flex-1">
            <p className="text-sm font-black text-stone-900">
              {vehicle.vehicleName}
            </p>
            <p className="text-[11px] text-stone-400">
              {vehicle.vehicleType} · {vehicle.plateNumber}
            </p>
          </div>
          <span className="text-xs font-bold text-teal-600 bg-teal-50 px-2 py-0.5 rounded-full">
            Selected
          </span>
        </div>
      </div>

      {/* Max Seats */}
      <div className="mb-6">
        <p className="text-[10px] font-bold text-stone-400 uppercase tracking-widest mb-2">
          Maximum Seats
        </p>
        <div className="flex items-center gap-4">
          <button
            onClick={() => setMaxSeats((s) => Math.max(1, s - 1))}
            className="w-10 h-10 rounded-full bg-stone-200 hover:bg-stone-300 text-stone-800 text-xl font-bold transition"
          >
            −
          </button>
          <div className="flex-1 text-center bg-stone-50 border border-stone-200 rounded-xl py-3">
            <span className="text-3xl font-black text-stone-900">
              {maxSeats}
            </span>
            <p className="text-[10px] text-stone-400 mt-0.5">seats</p>
          </div>
          <button
            onClick={() =>
              setMaxSeats((s) => Math.min(vehicle.capacity || 10, s + 1))
            }
            className="w-10 h-10 rounded-full bg-orange-500 hover:bg-orange-400 text-white text-xl font-bold transition"
          >
            +
          </button>
        </div>
        <p className="text-[11px] text-stone-400 text-center mt-2">
          Max vehicle capacity: {vehicle.capacity}
        </p>
      </div>

      <button
        onClick={handleCreate}
        disabled={loading}
        className="w-full py-4 rounded-2xl bg-orange-500 hover:bg-orange-400 text-white font-bold text-sm transition disabled:opacity-50"
      >
        {loading ? "Creating..." : "Create Pool"}
      </button>
    </div>
  );
};

export default CreatePoolForm;
