import { useEffect, useState } from "react";
import api from "../../api/axios";

const authHeaders = () => ({
  Authorization: `Bearer ${localStorage.getItem("token")}`,
});

// ─── Add Vehicle Form ────────────────────────────────────────────────────────
const AddVehicleForm = ({ onSuccess, onCancel }) => {

  const inputCls =
    "w-full px-4 py-3 rounded-xl bg-stone-100 border border-stone-200 text-stone-900 text-sm outline-none focus:border-orange-400 focus:ring-2 focus:ring-orange-100 transition";
  const labelCls =
    "block text-[10px] font-bold text-stone-500 uppercase tracking-widest mb-1.5";

  return (
    <div className="bg-white rounded-2xl border border-stone-200 p-6 shadow-sm">
      <h3 className="text-lg font-black text-stone-900 mb-1">Add Vehicle</h3>
      <p className="text-xs text-stone-400 mb-5">
        Register your vehicle to start creating pools.
      </p>

      {error && (
        <div className="mb-4 rounded-xl bg-red-50 border border-red-200 px-4 py-3">
          <p className="text-sm text-red-600">{error}</p>
        </div>
      )}

      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <label className={labelCls}>Vehicle Name / Model</label>
          <input
            name="vehicleName"
            value={form.vehicleName}
            onChange={handleChange}
            placeholder="e.g. Tesla Model 3"
            required
            className={inputCls}
          />
        </div>

        <div className="grid grid-cols-2 gap-3">
          <div>
            <label className={labelCls}>Type</label>
            <select
              name="vehicleType"
              value={form.vehicleType}
              onChange={handleChange}
              className={inputCls}
            >
              <option value="SEDAN">SEDAN</option>
              <option value="SUV">SUV</option>
              <option value="VAN">VAN</option>
              <option value="BUS">BUS</option>
            </select>
          </div>
          <div>
            <label className={labelCls}>Capacity</label>
            <input
              name="capacity"
              type="number"
              min="1"
              max="20"
              value={form.capacity}
              onChange={handleChange}
              required
              className={inputCls}
            />
          </div>
        </div>

        <div>
          <label className={labelCls}>Plate Number</label>
          <input
            name="plateNumber"
            value={form.plateNumber}
            onChange={handleChange}
            placeholder="e.g. DHAKA-METRO-GA-1234"
            required
            className={inputCls}
          />
        </div>

        <div className="flex gap-3 pt-1">
          {onCancel && (
            <button
              type="button"
              onClick={onCancel}
              className="flex-1 py-3 rounded-xl border border-stone-200 text-stone-600 text-sm font-semibold hover:bg-stone-50 transition"
            >
              Cancel
            </button>
          )}
          <button
            type="submit"
            disabled={loading}
            className="flex-1 py-3 rounded-xl bg-orange-500 hover:bg-orange-400 text-white text-sm font-bold transition disabled:opacity-50"
          >
            {loading ? "Adding..." : "Add Vehicle"}
          </button>
        </div>
      </form>
    </div>
  );
};

// ─── Vehicle Card ─────────────────────────────────────────────────────────────
const VehicleCard = ({ vehicle, onCreatePool }) => (
  <div className="bg-white rounded-2xl border border-stone-200 p-5 shadow-sm flex flex-col gap-4">
    <div className="flex items-start justify-between">
      <div>
        <p className="text-base font-black text-stone-900">
          {vehicle.vehicleName}
        </p>
        <p className="text-xs font-bold text-stone-400 mt-0.5 uppercase tracking-widest">
          {vehicle.vehicleType}
        </p>
      </div>
      <span className="bg-stone-100 text-stone-600 text-[11px] font-bold px-2.5 py-1 rounded-full">
        {vehicle.plateNumber}
      </span>
    </div>

    <div className="flex gap-3">
      <div className="flex-1 bg-stone-50 rounded-xl p-3 text-center">
        <p className="text-[10px] font-bold text-stone-400 uppercase tracking-widest">
          Capacity
        </p>
        <p className="text-xl font-black text-stone-900 mt-0.5">
          {vehicle.capacity}
        </p>
      </div>
      <div className="flex-1 bg-amber-50 rounded-xl p-3 text-center">
        <p className="text-[10px] font-bold text-amber-500 uppercase tracking-widest">
          Type
        </p>
        <p className="text-base font-black text-amber-600 mt-0.5">
          {vehicle.vehicleType}
        </p>
      </div>
    </div>

    <button
      onClick={() => onCreatePool(vehicle)}
      className="w-full py-3 rounded-xl bg-stone-900 hover:bg-stone-700 text-white text-sm font-bold transition"
    >
      Create Pool
    </button>
  </div>
);

// ─── Main VehicleList ─────────────────────────────────────────────────────────
const VehicleList = ({ onCreatePool }) => {
  const [vehicles, setVehicles] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [showAddForm, setShowAddForm] = useState(false);

  const fetchVehicles = async () => {
    try {
      setLoading(true);
      setError("");
      const res = await api.get("/vehicles/my", { headers: authHeaders() });
      setVehicles(res.data.vehicles || res.data || []);
    } catch (err) {
      setError(err.response?.data?.message || "Failed to load vehicles");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchVehicles();
  }, []);

  if (loading) {
    return (
      <div className="flex items-center justify-center py-16">
        <div className="w-8 h-8 border-4 border-stone-200 border-t-orange-400 rounded-full animate-spin" />
      </div>
    );
  }

  if (error) {
    return (
      <div className="bg-red-50 border border-red-200 rounded-2xl p-6 text-center">
        <p className="text-sm text-red-600 mb-3">{error}</p>
        <button
          onClick={fetchVehicles}
          className="text-sm font-bold text-red-600 underline"
        >
          Retry
        </button>
      </div>
    );
  }

  if (vehicles.length === 0 && !showAddForm) {
    return (
      <div className="bg-white rounded-2xl border border-dashed border-stone-300 p-10 text-center">
        <div className="w-14 h-14 bg-stone-100 rounded-2xl flex items-center justify-center mx-auto mb-4">
          <span className="text-2xl">🚗</span>
        </div>
        <p className="font-black text-stone-900 text-lg">No vehicles yet</p>
        <p className="text-sm text-stone-400 mt-1 mb-5">
          Add your vehicle to start creating ride pools.
        </p>
        <button
          onClick={() => setShowAddForm(true)}
          className="px-6 py-3 rounded-xl bg-orange-500 hover:bg-orange-400 text-white text-sm font-bold transition"
        >
          + Add Vehicle
        </button>
      </div>
    );
  }

  if (showAddForm) {
    return (
      <AddVehicleForm
        onSuccess={() => {
          setShowAddForm(false);
          fetchVehicles();
        }}
        onCancel={vehicles.length > 0 ? () => setShowAddForm(false) : null}
      />
    );
  }

  return (
    <div className="space-y-5">
      <div className="flex items-center justify-between">
        <div>
          <h3 className="text-lg font-black text-stone-900">My Vehicles</h3>
          <p className="text-xs text-stone-400 mt-0.5">
            Select a vehicle to create a pool
          </p>
        </div>
        <button
          onClick={() => setShowAddForm(true)}
          className="text-xs font-bold text-orange-500 border border-orange-200 px-3 py-1.5 rounded-full hover:bg-orange-50 transition"
        >
          + Add Vehicle
        </button>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        {vehicles.map((v) => (
          <VehicleCard key={v.id} vehicle={v} onCreatePool={onCreatePool} />
        ))}
      </div>
    </div>
  );
};

export default VehicleList;
