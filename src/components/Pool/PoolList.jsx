import { useEffect, useState, useCallback } from "react";
import api from "../../api/axios";
import PoolCard from "./PoolCard";

const PoolList = ({ onJoin }) => {
  const [pools, setPools] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const fetchPools = useCallback(async () => {
    try {
      setLoading(true);
      setError("");

      const token = localStorage.getItem("token");

      const response = await api.get("/pools", {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      setPools(response.data.pools || []);
    } catch (err) {
      console.error("Get pools error:", err);

      setError(
        err.response?.data?.message || "Failed to load available pools."
      );
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchPools();
  }, [fetchPools]);

  if (loading) {
    return (
      <div className="rounded-2xl border border-stone-200 bg-white p-8 text-center">
        <div className="mx-auto h-8 w-8 animate-spin rounded-full border-4 border-stone-200 border-t-orange-500" />
        <p className="mt-3 text-sm text-stone-500">Loading available pools...</p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="rounded-2xl border border-red-200 bg-red-50 p-6">
        <p className="text-sm text-red-600">{error}</p>

        <button
          onClick={fetchPools}
          className="mt-3 rounded-lg bg-stone-900 px-4 py-2 text-sm font-medium text-white hover:bg-stone-800 transition"
        >
          Try Again
        </button>
      </div>
    );
  }

  return (
    <section className="mt-8">
      <div className="flex items-center justify-between mb-5">
        <div>
          <h2 className="text-xl font-bold text-stone-900">Available Pools</h2>

          <p className="mt-1 text-sm text-stone-500">
            Find a nearby ride pool and share your fare.
          </p>
        </div>

        <button
          onClick={fetchPools}
          className="text-sm font-medium text-stone-400 hover:text-stone-700 transition"
        >
          ↻ Refresh
        </button>
      </div>

      {pools.length === 0 ? (
        <div className="rounded-2xl border border-stone-200 bg-white p-8 text-center">
          <p className="text-4xl mb-3">🚌</p>
          <p className="font-medium text-stone-700">No available pools</p>
          <p className="mt-1 text-sm text-stone-500">
            Try again later when a driver creates a pool.
          </p>
        </div>
      ) : (
        <div className="grid grid-cols-1 gap-5 lg:grid-cols-2">
          {pools.map((pool) => (
            <PoolCard
              key={pool.id}
              pool={pool}
              onJoin={onJoin || (() => {})}
            />
          ))}
        </div>
      )}
    </section>
  );
};

export default PoolList;